import db from '@/database/config';
import authMiddlelware from '@/helpers/middleware';
function handler(req, res) {

    if(req.method === 'GET'){
        db.query('SELECT * FROM CentroCosto', (error, results, fields) => {
            if(error){
                res.status(500).json({error: 'Error al obtener los centros de costos'});
            }else{
                res.status(200).json(results);
            }
        });
    
    } else if(req.method === 'POST'){
        const {nombreCentroCosto, idDepartamento} = req.body;

        // Verificar si el usuario es administrador del departamento
        if(req.user.idDepartamento !== idDepartamento){
            return res.status(401).json({message: 'No tiene permisos para crear el centro de costo'});
        }

        // Agregar centro de costo solo si el departamento existe
        db.query('SELECT * FROM Departamento WHERE idDepartamento = ?', [idDepartamento], (error, results, fields) => {
            if(error){
                res.status(500).json({error: 'Error al obtener el departamento'});
            }else{
                if(results.length > 0){
                    // El departamento existe
                    db.query('INSERT INTO CentroCosto (nombreCentroCosto, idDepartamento) VALUES (?, ?)', [nombreCentroCosto, idDepartamento], (error, results, fields) => {
                        if(error){
                            res.status(500).json({error: 'Error al insertar el centro de costo'});
                        }else{
                            res.status(200).json({message: 'Centro de costo insertado correctamente'});
                        }
                    });
                }else{
                    // El departamento no existe
                    res.status(404).json({error: 'El departamento no existe'});
                }
            }
        })

    }
}

export default authMiddlelware(handler);