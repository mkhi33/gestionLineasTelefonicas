import db from '@/database/config';
import transporter from '@/emails/config';
import short from 'short-uuid';
import generarContrasenia from '@/helpers/generarContrasenia';
export default function handler(req, res) {
    const { id, actualizarContrasenia } = req.query;

    if (req.method === 'GET') {
        const query = `SELECT idUsuario, Usuario.idEmpleado, correoElectronico, idRolUsuario, primerNombre, segundoNombre, primerApellido, segundoApellido, idDepartamento FROM Usuario INNER JOIN Empleado ON Usuario.idEmpleado = Empleado.idEmpleado WHERE idUsuario = ${id};`
        db.query(query, (error, results, fields) => {
            if (error) {
                res.status(500).json({ error: 'Error al obtener el usuario' });
            } else {
                if (results.length === 0) {
                    res.status(404).json({ error: 'El usuario no existe' });
                    return;
                }
                return res.status(200).json(results[0]);
            }
        });
    } else if (req.method === 'PUT') {
        const { correoElectronico, idRolUsuario, primerNombre, segundoNombre, primerApellido, segundoApellido, idDepartamento } = req.body;
        // Verificar que el departamento existe
        const query = `SELECT * FROM Departamento WHERE idDepartamento = ${idDepartamento}`;
        db.query(query, (error, results, fields) => {
            if (error) {
                res.status(500).json({ error: 'Error al verificar el departamento' });
            } else if (results.length === 0) {
                res.status(404).json({ error: 'El departamento no existe' });
            } else {
                // Verificar que el rol del usuario existe
                const query = `SELECT * FROM UsuarioRol WHERE idRolUsuario = ${idRolUsuario}`;
                db.query(query, (error, results, fields) => {
                    if (error) {
                        res.status(500).json({ error: 'Error al verificar el rol del usuario' });
                    } else if (results.length === 0) {
                        res.status(404).json({ error: 'El rol del usuario no existe' });
                    } else {
                        // Verificar que el correo electronico no este registrado
                        const query = `SELECT * FROM Usuario WHERE correoElectronico = '${correoElectronico}' AND idUsuario != ${id}`;
                        db.query(query, (error, results, fields) => {
                            if (error) {
                                res.status(500).json({ error: 'Error al verificar el correo electronico' });
                            } else if (results.length > 0) {
                                res.status(500).json({ error: 'El correo electronico ya esta registrado' });
                            } else {
                                // Actualizar el empleado
                                const queryEmpleado = `UPDATE Empleado SET primerNombre = '${primerNombre}', segundoNombre = '${segundoNombre}', primerApellido = '${primerApellido}', segundoApellido = '${segundoApellido}', idDepartamento = ${idDepartamento} WHERE idEmpleado = (SELECT idEmpleado FROM Usuario WHERE idUsuario = ${id})`;
                                db.query(queryEmpleado, (error, results, fields) => {
                                    if (error) {
                                        res.status(500).json({ error: 'Error al guardar el empleado' });
                                    } else {
                                        // El empleado fue actualizado correctamente, ahora actualizar el usuario
                                        // Generar una contraseña sin hash


                                        let queryUsuario = ""
                                        let contrasenia = ""
                                        let contraseniaSHA256 = ""
                                        if (actualizarContrasenia == 1) {
                                            contrasenia = short.generate();
                                            // Generar una contraseña sha256
                                            contraseniaSHA256 = generarContrasenia(contrasenia);
                                            queryUsuario = `UPDATE Usuario SET correoElectronico = '${correoElectronico}', contrasenia = '${contraseniaSHA256}', idRolUsuario = ${idRolUsuario} WHERE idUsuario = ${id}`;
                                        } else {
                                            queryUsuario = `UPDATE Usuario SET correoElectronico = '${correoElectronico}', idRolUsuario = ${idRolUsuario} WHERE idUsuario = ${id}`;
                                        }

                                        db.query(queryUsuario, (error, results, fields) => {
                                            if (error) {
                                                res.status(500).json({ error: 'Error al actualizar el usuario' });
                                            } else {
                                                if (actualizarContrasenia == 1) {
                                                    // Enviar el correo electronico
                                                    const mailOptions = {
                                                        from: process.env.EMAIL_ADDRESS,
                                                        to: correoElectronico,
                                                        subject: 'Actualización de contraseña',
                                                        html: `<h1>Actualización de contraseña</h1> <p>Se ha actualizado la contraseña de su cuenta, su nueva contraseña es: <b>${contrasenia}</b></p>`
                                                    };
                                                    transporter.sendMail(mailOptions, (error, info) => {
                                                        if (error) {
                                                            console.log(error);
                                                        } else {
                                                            console.log('Email sent: ' + info.response);
                                                        }
                                                    });
                                                }

                                                res.status(200).json({ mensaje: 'Usuario actualizado correctamente' });
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
    } else if (req.method === 'DELETE') {
        const query = `DELETE FROM Usuario WHERE idUsuario = ${id}`;
        // Verificar si el usuario existe
        db.query(`SELECT * FROM Usuario WHERE idUsuario = ${id}`, (error, results, fields) => {
            if (error) {
                res.status(500).json({ error: 'Error al verificar el usuario' });
            } else if (results.length === 0) {
                res.status(404).json({ error: 'El usuario no existe' });
            } else {

                db.query(query, (error, results, fields) => {
                    if (error) {
                        res.status(500).json({ error: 'Error al eliminar el usuario' });
                    } else {
                        res.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
                    }
                });
            }
        });
    } else {
        res.status(405).json({ error: 'Metodo no permitido' });
    }


}