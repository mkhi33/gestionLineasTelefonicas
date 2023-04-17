import db from '@/database/config';

export default function handler(req, res) {
    
    if( req.method === 'GET') {
        // Obtener todas las lineas telefonicas
        db.query('SELECT * FROM LineaTelefonica', (error, results, fields) => {
            if(error){
                res.status(500).json({error: 'Error al obtener las lineas telefonicas'});
            }else{
                res.status(200).json(results);
            }
        });
    }else if( req.method === 'POST') {
        const { numeroLinea, idDepartamento, idCentroCosto } = req.body;

        // Comprobar la disponibilidad del numero de linea en la ListaLineasTelefonicas
        const query = `SELECT numeroLinea, EstadoLineaTelefonica.idEstadoLineaTelefonica, nombreEstado FROM ListaLineasTelefonicas INNER JOIN EstadoLineaTelefonica ON ListaLineasTelefonicas.idEstadoLineaTelefonica = EstadoLineaTelefonica.idEstadoLineaTelefonica WHERE numeroLinea = ${numeroLinea}`;

        db.query(query, (error, results, fields) => {
            if(error){
                res.status(500).json({error: 'Error al obtener el estado de la linea telefonica'});
            }else if(results.length === 0){
                res.status(404).json({error: 'El numero de linea no existe'});
            }else if(results[0].idEstadoLineaTelefonica !== 1){
                res.status(500).json({error: 'El numero de linea no esta disponible'});
            }else {
                // Insertar la linea telefonica
                const query = `INSERT INTO LineaTelefonica (numeroLinea, idDepartamento, idCentroCosto) VALUES (${numeroLinea}, ${idDepartamento}, ${idCentroCosto})`;

                db.query(query, (error, results, fields) => {
                    if(error){
                        res.status(500).json({error: 'Error al insertar la linea telefonica'});
                    }else{
                        // Actualizar el estado de la linea telefonica en la ListaLineasTelefonicas
                        const query = `UPDATE ListaLineasTelefonicas SET idEstadoLineaTelefonica = 2 WHERE numeroLinea = ${numeroLinea}`;
                        db.query(query, (error, results, fields) => {
                            if(error){
                                res.status(500).json({error: 'La linea telefonica fue agregada pero no se pudo actualizar el estado en la lista de lineas telefonicas'});
                            }else {
                                res.status(200).json({message: 'Linea telefonica insertada correctamente'});
                            }
                        });
                    }
                })
            }
        });

    }else {
        res.status(405).json({error: 'Metodo no permitido'});
    }
}