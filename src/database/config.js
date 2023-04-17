import mysql from 'mysql';

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'admin',
    database: 'db_gestor_lineas_telefonicas'
  });
export default connection;