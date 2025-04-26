const express = require('express');
const cors = require('cors');
const app = express(); 
const port = 3000;

app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const {MongoClient} = require('mongodb');

const uri = 'mongodb+srv://202260138:aMigoS6A@baloo.1nlyg.mongodb.net/?retryWrites=true&w=majority&appName=Baloo';
const cliente = new MongoClient(uri);

// Ruta home
app.get('/home', (req, res) => {
    res.sendFile(__dirname + '/crud.html');
});

// Insertar vehículo
app.post('/insertar', async (req, res) => {
    try {
        const { marca, modelo, placa, color, año } = req.body;
        await cliente.connect();
        const db = cliente.db('DataBaseGrupoA');
        const coleccion = db.collection('carros');  // Cambiado a 'carros'
        
        await coleccion.insertOne({
            marca: marca,
            modelo: modelo,
            placa: placa,
            color: color,
            año: año
        });
        
        res.send(`
            <script>
                alert("Vehículo registrado correctamente");
                window.location.href = "/home";
            </script>
        `);
    } catch (error) {
        console.error(error);
        res.send(`
            <script>
                alert("Error al insertar: ${error.message}");
                window.location.href = "/home";
            </script>
        `);
    } finally {
        await cliente.close();
    }
});

// Actualizar vehículo
app.post('/actualizar', async (req, res) => {
    try {
        const { placa, marca, modelo, color, año } = req.body;
        await cliente.connect();
        const db = cliente.db('DataBaseGrupoA');
        const coleccion = db.collection('carros');  // Cambiado a 'carros'

        const resultado = await coleccion.updateOne(
            { placa: placa },
            { $set: { 
                marca: marca,
                modelo: modelo,
                color: color,
                año: año 
            }}
        );

        if (resultado.modifiedCount > 0) {
            res.send(`
                <script>
                    alert("Vehículo actualizado correctamente");
                    window.location.href = "/home";
                </script>
            `);
        } else {
            res.send(`
                <script>
                    alert("Vehículo no encontrado o sin cambios");
                    window.location.href = "/home";
                </script>
            `);
        }
    } catch (error) {
        console.error(error);
        res.send(`
            <script>
                alert("Error al actualizar: ${error.message}");
                window.location.href = "/home";
            </script>
        `);
    } finally {
        await cliente.close();
    }
});

// Consultar vehículo
app.post('/consultar', async (req, res) => {
    try {
        const { placa } = req.body;
        await cliente.connect();
        const db = cliente.db('DataBaseGrupoA');
        const coleccion = db.collection('carros');  // Cambiado a 'carros'

        const vehiculo = await coleccion.findOne({ placa: placa });

        if (vehiculo) {
            res.send(`
                <script>
                    alert("Vehículo encontrado:\\n\\nMarca: ${vehiculo.marca}\\nModelo: ${vehiculo.modelo}\\nPlaca: ${vehiculo.placa}\\nColor: ${vehiculo.color}\\nAño: ${vehiculo.año}");
                    window.location.href = "/home";
                </script>
            `);
        } else {
            res.send(`
                <script>
                    alert("Vehículo no encontrado");
                    window.location.href = "/home";
                </script>
            `);
        }
    } catch (error) {
        console.error(error);
        res.send(`
            <script>
                alert("Error al consultar: ${error.message}");
                window.location.href = "/home";
            </script>
        `);
    } finally {
        await cliente.close();
    }
});

// Eliminar vehículo
app.post('/eliminar', async (req, res) => {
    try {
        const { placa } = req.body;
        await cliente.connect();
        const db = cliente.db('DataBaseGrupoA');
        const coleccion = db.collection('carros');  // Cambiado a 'carros'

        const resultado = await coleccion.deleteOne({ placa: placa });

        if (resultado.deletedCount > 0) {
            res.send(`
                <script>
                    alert("Vehículo eliminado correctamente");
                    window.location.href = "/home";
                </script>
            `);
        } else {
            res.send(`
                <script>
                    alert("Vehículo no encontrado");
                    window.location.href = "/home";
                </script>
            `);
        }
    } catch (error) {
        console.error(error);
        res.send(`
            <script>
                alert("Error al eliminar: ${error.message}");
                window.location.href = "/home";
            </script>
        `);
    } finally {
        await cliente.close();
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});