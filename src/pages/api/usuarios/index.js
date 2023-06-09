import db from '@/database/config';
import generarContrasenia from '@/helpers/generarContrasenia';
import transporter from '@/emails/config';
import short from 'short-uuid';
import authMiddlelware from '@/helpers/middleware';

function handler(req, res) {

    if(req.method === 'GET') {
        // Obtener todos los usuarios
        console.log("GET")
        const query = `SELECT idUsuario, Usuario.idEmpleado, correoElectronico, idRolUsuario, primerNombre, segundoNombre, primerApellido, idDepartamento FROM Usuario INNER JOIN Empleado ON Usuario.idEmpleado = Empleado.idEmpleado;`
        db.query(query, (error, results, fields) => {
            if(error){
                res.status(500).json({error: 'Error al obtener los usuarios'});
            }else{
                res.status(200).json(results);
            }
        }); 
    } else if( req.method === 'POST'){
        // Verificar que el usuario sea administrador
        if(req.user.idRolUsuario !== 1){
            res.status(403).json({error: 'Solo los administradores del sistema puden crear usuarios'});
            return;
        }
        const { correoElectronico, idRolUsuario, primerNombre, segundoNombre, primerApellido, segundoApellido, idDepartamento } = req.body;
        // Verificar que el departamento existe
        const query = `SELECT * FROM Departamento WHERE idDepartamento = ${idDepartamento}`;
        db.query(query, (error, results, fields) => {
            if(error){
                res.status(500).json({error: 'Error al verificar el departamento'});
            }else if(results.length === 0){
                res.status(404).json({error: 'El departamento no existe'});
            }else {
                // Verificar que el rol del usuario existe
                const query = `SELECT * FROM UsuarioRol WHERE idRolUsuario = ${idRolUsuario}`;
                db.query(query, (error, results, fields) => {
                    if(error){
                        console.log(error)
                        res.status(500).json({error: 'Error al verificar el rol del usuario'});
                    }else if(results.length === 0){
                        res.status(404).json({error: 'El rol del usuario no existe'});
                    }else {
                        // Verificar que el correo electronico no este registrado
                        const query = `SELECT * FROM Usuario WHERE correoElectronico = '${correoElectronico}'`;
                        db.query(query, (error, results, fields) => {
                            if(error){
                                res.status(500).json({error: 'Error al verificar el correo electronico'});
                            }else if(results.length > 0){
                                res.status(500).json({error: 'El correo electronico ya esta registrado'});
                            }else {
                                // Guardar el empleado
                                const queryEmpleado = `INSERT INTO Empleado (primerNombre, segundoNombre, primerApellido, segundoApellido, idDepartamento) VALUES ('${primerNombre}', '${segundoNombre}', '${primerApellido}','${segundoApellido}', ${idDepartamento});`
                                db.query(queryEmpleado, (error, results, fields) => {
                                    if(error){
                                        console.log(error);
                                        res.status(500).json({error: 'Error al guardar el empleado'});  
                                    }else {
                                        // El empleado fue registrado correctamente, ahora generar el usuario
                                        // Generar una contraseña sin hash
                                        const contrasenia = short.generate();
                                        // Generar una contraseña sha256
                                        const contraseniaSHA256 = generarContrasenia(contrasenia);

                                        const queryUsuario = `INSERT INTO Usuario (idEmpleado, correoElectronico, contrasenia, idRolUsuario) VALUES (${results.insertId}, '${correoElectronico}', '${contraseniaSHA256}', ${idRolUsuario})`;
                                    
                                        db.query(queryUsuario, (error, results, fields) => {
                                            if(error){
                                                res.status(500).json({error: 'Error al guardar el usuario'});
                                            }else {
                                                // Enviar el correo electronico
                                                const mailOptions = {
                                                    from: process.env.EMAIL_ADDRESS,
                                                    to: correoElectronico,
                                                    subject: 'Registro de usuario',
                                                    html: ``,
                                                    text: `Se ha generado su contraseña de usuario para la plataforma de gestión y de lineas telefónicas.\n\nSu contraseña es: ${contrasenia}`
                                                }
                                                transporter.sendMail(mailOptions, (error, info) => {
                                                    if(error){
    
                                                        res.status(500).json({error: 'Error al enviar el correo electronico'});
                                                        
                                                    }else {
                                                        res.status(200).json({mensaje: 'Usuario registrado correctamente'});
                                                        console.log(info);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });

            }
        });
    } else {
        res.status(405).json({error: 'Metodo no permitido'});
    }

}

export default authMiddlelware(handler);