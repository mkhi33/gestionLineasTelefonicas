import db from '@/database/config';
import authMiddlelware from '@/helpers/middleware';
function handler(req, res) {

    if (req.method === 'GET') {
        db.query('SELECT * FROM Departamento', (error, results, fields) => {
            if (error) {
                console.log(error);
                res.status(500).json({ error: 'Error al obtener la lista de Departamento' });
            } else {
                res.status(200).json(results);
            }
        });
    } else if (req.method === 'POST') {
        const { nombreDepartamento, descripcion, limiteLineas } = req.body;
        if(req.user.idRolUsuario !== 1){
            return res.status(401).json({message: 'No tiene permisos para crear el departamento'});
        }
        db.query('INSERT INTO Departamento (nombreDepartamento, descripcion, limiteLineas) VALUES (?, ?, ?)', [nombreDepartamento, descripcion, limiteLineas], (error, results, fields) => {
            if (error) {
                console.log(error);
                res.status(500).json({ error: 'Error al insertar el departamento' });
            } else {
                res.status(200).json({ message: 'Departamento insertado correctamente' });
            }
        });
    } else {
        res.status(404).json({ error: 'Ruta no encontrada' });
    }

}

export default authMiddlelware(handler);