import db from '@/database/config';
export default function handler(req, res) {
  const { id } = req.query; // Obtener el ID del departamento de la consulta


  if (req.method === 'GET') {
    db.query('SELECT * FROM Departamento WHERE idDepartamento = ?', [id], (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: 'Error al obtener el departamento' });
      } else {
        if (results.length > 0) {
          res.status(200).json(results[0]);
        } else {
          res.status(404).json({ error: 'Departamento no encontrado' });
        }
      }
    });
  } else if (req.method === 'PUT') {
    const { nombreDepartamento, descripcion, limiteLineas } = req.body;
    db.query('UPDATE Departamento SET nombreDepartamento = ?, descripcion = ?, limiteLineas = ? WHERE idDepartamento = ?', [nombreDepartamento, descripcion, limiteLineas, id], (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: 'Error al actualizar el departamento' });
      } else {
        res.status(200).json({ message: 'Departamento actualizado correctamente' });
      }
    });
  } else if (req.method === 'DELETE') {
    db.query('DELETE FROM Departamento WHERE idDepartamento = ?', [id], (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: 'Error al eliminar el departamento' });
      } else {
        res.status(200).json({ message: 'Departamento eliminado correctamente' });
      }
    });
  } else {
    res.status(404).json({ error: 'Ruta no encontrada' });
  }
}