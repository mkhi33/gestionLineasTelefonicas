import crypto from 'crypto';

// Función para generar una contraseña con hash SHA256
const generarContraseñaSHA256 = (contraseña) => {

    const hash = crypto.createHash('sha256');

    hash.update(contraseña);

    const hashHex = hash.digest('hex');

    return hashHex;
};

export default generarContraseñaSHA256;