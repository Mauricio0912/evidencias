const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const { MongoClient } = require('mongodb');


const uri = "mongodb+srv://202260138:aMigoS6A@baloo.1nlyg.mongodb.net/DataBaseGrupoA?retryWrites=true&w=majority&appName=Baloo";
const client = new MongoClient(uri);

// Configuración del servidor 
app.use(express.json());
app.use(cors());

// Conexión a MongoDB y configuración de la colección
let db, cancionesCollection;

async function conectarMongoDB() {
    try {
        await client.connect();
        db = client.db('DataBaseGrupoA');
        cancionesCollection = db.collection('canciones');
        console.log('Conectado a MongoDB Atlas');
        
        // Insertar datos iniciales si la colección está vacía
        const count = await cancionesCollection.countDocuments();
        if (count === 0) {
            await cancionesCollection.insertMany([
                { id: 1, cancion: 'Shape of You', artista: 'Ed Sheeran', duracion: '4:24' },
                { id: 2, cancion: 'Blinding Lights', artista: 'The Weeknd', duracion: '3:20' },
                { id: 3, cancion: 'Rolling in the Deep', artista: 'Adele', duracion: '3:48' }
            ]);
            console.log('Datos iniciales insertados');
        }
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
    }
}

conectarMongoDB();


const dbOperations = {
    getAll: async () => await cancionesCollection.find({}).toArray(),
    add: async (cancion) => {
        const lastIdDoc = await cancionesCollection.find().sort({id: -1}).limit(1).toArray();
        const newId = lastIdDoc.length > 0 ? lastIdDoc[0].id + 1 : 1;
        cancion.id = newId;
        await cancionesCollection.insertOne(cancion);
        return cancion;
    },
    update: async (id, newData) => {
        await cancionesCollection.updateOne(
            { id: parseInt(id, 10) },
            { $set: newData }
        );
        return await cancionesCollection.findOne({ id: parseInt(id, 10) });
    },
    delete: async (id) => {
        const cancionEliminada = await cancionesCollection.findOne({ id: parseInt(id, 10) });
        await cancionesCollection.deleteOne({ id: parseInt(id, 10) });
        return cancionEliminada;
    }
};

// Rutas 
app.get('/canciones', async (req, res) => {
    try {
        const canciones = await dbOperations.getAll();
        res.json(canciones);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener canciones' });
    }
});

app.post('/canciones', async (req, res) => {
    try {
        const nuevaCancion = await dbOperations.add(req.body);
        res.status(201).json({ mensaje: 'Canción agregada exitosamente', cancion: nuevaCancion });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al agregar canción' });
    }
});

app.put('/canciones/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const cancionActualizada = await dbOperations.update(id, req.body);
        
        if (cancionActualizada) {
            res.json({ mensaje: 'Canción actualizada exitosamente', cancion: cancionActualizada });
        } else {
            res.status(404).json({ mensaje: 'Canción no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar canción' });
    }
});

app.delete('/canciones/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const cancionEliminada = await dbOperations.delete(id);
        
        if (cancionEliminada) {
            res.json({ mensaje: 'Canción eliminada exitosamente', cancion: cancionEliminada });
        } else {
            res.status(404).json({ mensaje: 'Canción no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar canción' });
    }
});

// Iniciar el servidor 
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

// Manejo de cierre de conexión
process.on('SIGINT', async () => {
    await client.close();
    process.exit();
});