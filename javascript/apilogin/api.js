
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');
const app = express();
const port = 3000;

// Configuración de middleware
app.use(express.json());
app.use(cors());

// Conexión a MongoDB Atlas
const uri = "mongodb+srv://202260138:aMigoS6A@baloo.1nlyg.mongodb.net/DataBaseGrupoA?retryWrites=true&w=majority&appName=Baloo";
mongoose.connect(uri);


// Definir el esquema de usuario
const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    correo: { type: String, required: true },
    contraseña: { type: String, required: true }
});

// Crear el modelo de usuario
const Usuario = mongoose.model('Usuario', usuarioSchema);

// Ruta para registrar usuarios
app.post('/registro', async (req, res) => {
    const { nombre, correo, contraseña } = req.body;

    // Validar los datos recibidos
    if (!nombre || !correo || !contraseña) {
        return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }

    try {
        // Crear un nuevo usuario
        const nuevoUsuario = new Usuario({ nombre, correo, contraseña });
        const usuarioGuardado = await nuevoUsuario.save();
        res.status(201).json({ mensaje: 'Usuario registrado exitosamente', usuario: usuarioGuardado });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ mensaje: 'Error al registrar usuario' });
    }
});


//login
app.post('/login', async (req, res) => {
    const { nombre, contraseña } = req.body;
    console.log(nombre, contraseña);
    // Validar los datos recibidos
    if (!nombre || !contraseña) {
        return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }

    try {
        // Buscar al usuario por nombre
        const usuario = await Usuario.findOne({ nombre });
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const claveVericar=CryptoJS.SHA256(contraseña).toString(CryptoJS.enc.Hex);

        if (!(claveVericar===usuario.contraseña)) {
             return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }
        res.status(200).json({ mensaje: 'Inicio de sesión exitoso', usuario: { nombre: usuario.nombre, correo: usuario.correo } });
    } catch (error) {
        console.error('Error durante el inicio de sesión:', error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
});


// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});