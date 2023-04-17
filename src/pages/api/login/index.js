import db from '@/database/config';
import jwt from 'jsonwebtoken';
import generarContraseniaSHA256 from '@/helpers/generarContrasenia';

export default function handler(req, res) {

    if(req.method === 'POST') {
        const { correoElectronico } = req.body;
        const contrasenia = generarContraseniaSHA256(req.body.contrasenia);
        
        const query = `SELECT idUsuario, Usuario.idEmpleado, correoElectronico, contrasenia, idRolUsuario, primerNombre, segundoNombre, primerApellido, idDepartamento FROM Usuario INNER JOIN Empleado ON Usuario.idEmpleado = Empleado.idEmpleado WHERE correoElectronico = '${correoElectronico}';`



        db.query(query, (error, results, fields) => {
            if(error) {
                return res.status(500).json({ error: 'Error al iniciar sesión' });
            } else if(results.length === 0) {
                return res.status(404).json({ error: 'Error al iniciar sesión, credenciales no válidas' });
            } else {
                if(results[0].contrasenia !== contrasenia) {
                    return res.status(404).json({ error: 'Error al iniciar sesión, credenciales no válidas' });
                }

                // Generar un  token para el usuario
                try {
                    const usuario = results[0]
                    // Genera el token de acceso con una clave secreta y opciones adicionales
                    const token = jwt.sign({ userId: usuario.id }, process.env.PALABRA_SECRETA, { expiresIn: '1h' });
                    return res.status(200).json({
                        token,
                        user: {...usuario, contrasenia: undefined}
                    });
                } catch (error) {
                    console.log(error);
                    return res.status(500).json({ error: 'Error al iniciar sesión' });
                }   

            }
        });
    }
}