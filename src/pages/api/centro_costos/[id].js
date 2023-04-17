import db from '@/database/config';

export default function handler(req, res) {
    const { id, departamentoId } = req.query; 

    if(req.method === 'GET'){
        // Obtener centro de costo por idCentro de costo o por id de departamento
        const query = !departamentoId ? `SELECT * FROM CentroCosto WHERE idCentroCosto = ${id}` : `SELECT * FROM CentroCosto WHERE idDepartamento = ${departamentoId}`;
        
        db.query(query, (error, results, fields) => {
            if(error){
                res.status(500).json({error: 'Error al obtener el centro de costo'});
            }else{
                res.status(200).json(results);
            }
        });

    }else if( req.method === 'PUT') {

        const {nombreCentroCosto, idDepartamento} = req.body;

        // Actualizar centro de costo solo si el departamento existe
        db.query('SELECT * FROM Departamento WHERE idDepartamento = ?', [idDepartamento], (error, results, fields) => {
            if(error){
                res.status(500).json({error: 'Error al obtener el departamento'});
            }else{
                if(results.length > 0){
                    // El departamento existe

                    // Verificar que el centro de costos exite

                    db.query('SELECT * FROM CentroCosto WHERE idCentroCosto = ?', [id], (error, results, fields) => {
                        if(error){
                            res.status(500).json({error: 'Error al obtener el centro de costo'});
                        }else{
                            if(results.length > 0){
                                // El centro de costo existe, actualizar

                                db.query('UPDATE CentroCosto SET nombreCentroCosto = ?, idDepartamento = ? WHERE idCentroCosto = ?', [nombreCentroCosto, idDepartamento, id], (error, results, fields) => {
                                    if(error){
                                        res.status(500).json({error: 'Error al actualizar el centro de costo'});
                                    }else{
                                        res.status(200).json({message: 'Centro de costo actualizado correctamente'});
                                    }
                                });

                            }else{
                                // El centro de costo no existe
                                res.status(404).json({error: 'El centro de costo no existe'});
                            }
                        }
                    })

                }else{
                    // El departamento no existe
                    res.status(404).json({error: 'El departamento no existe'});
                }
            }
        })

    } else if(req.method === 'DELETE') {
        // Eliminar centro de costo
        db.query('DELETE FROM CentroCosto WHERE idCentroCosto = ?', [id], (error, results, fields) => {
            if(error){
                res.status(500).json({error: 'Error al eliminar el centro de costo'});
            }else{
                res.status(200).json({message: 'Centro de costo eliminado correctamente'});
            }
        });
    } else {
        res.status(405).json({error: 'Error, metodo no permitido'});
    }

}