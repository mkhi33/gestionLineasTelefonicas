import jwt from 'jsonwebtoken';
import db from '@/database/config';

const authMiddleware = (handler) => async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó un token de autenticación' });
  }

  try {
    // Verificar y decodificar el token
    const decodedToken = jwt.verify(token, process.env.PALABRA_SECRETA);

    // Verificar si el usuario existe
    const query = `SELECT * FROM Usuario WHERE idUsuario = ${decodedToken.idUsuario}`;
    db.query(query, (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: 'Error al verificar el usuario' });
      } else if (results.length === 0) {
        res.status(404).json({ error: 'El usuario no existe' });
      } else {
        // Pasar el usuario a la siguiente petición
        req.user = { ...results[0], contrasenia: undefined };
        return handler(req, res);

      }
    });

  } catch (error) {
    return res.status(401).json({ message: 'Token de autenticación inválido' });
  }
}
export default authMiddleware;




