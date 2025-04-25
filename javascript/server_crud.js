const express = require ('express');
const cors = require ('cors');
const app = express(); 
const port =3000;


app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const{MongoClient} = require('mongodb');

const uri = 'mongodb+srv://202260138:aMigoS6A@baloo.1nlyg.mongodb.net/?retryWrites=true&w=majority&appName=Baloo'
const cliente = new MongoClient(uri);
//rutahome
app.get('/home',(req,res)=>{
    res.sendFile(__dirname+'/home.html');
});

//crear la ruta

app.post('/insertar', async(req,res)=>{
    try{
        const{usuario,password}=req.body;
        await cliente.connect();
        const db=cliente.db('DataBaseGrupoA');
        const coleccion=db.collection('users');
        await coleccion.insertOne({usuario:usuario,password:password});
        res.send (`
            <script>
                    alert("datos enviados correctamente");
                    windows.location.href= "http:localhost3000/home";
                    </script>
            `);
    }finally{
        await cliente.close();
    }
});
// Ruta para actualizar un usuario existente
app.post('/update', async(req, res) => {
    try {
        const { usuario, nuevoPassword } = req.body;
        await cliente.connect();
        const db = cliente.db('DataBaseGrupoA');
        const coleccion = db.collection('users');

        const resultado = await coleccion.updateOne(
            { usuario: usuario },
            { $set: { password: nuevoPassword } }
        );

        if (resultado.modifiedCount > 0) {
            res.send(`
                <script>
                    alert("Usuario actualizado correctamente");
                    window.location.href = "http://localhost:3000/home";
                </script>
            `);
        } else {
            res.send(`
                <script>
                    alert("Usuario no encontrado o sin cambios");
                    window.location.href = "http://localhost:3000/home";
                </script>
            `);
        }
    } finally {
        await cliente.close();
    }
});

// Ruta para recuperar los datos de un usuario
app.post('/retrieve', async(req, res) => {
    try {
        const { usuario } = req.body;
        await cliente.connect();
        const db = cliente.db('DataBaseGrupoA');
        const coleccion = db.collection('users');

        const usuarioEncontrado = await coleccion.findOne({ usuario: usuario });

        if (usuarioEncontrado) {
            res.send(`
                <script>
                    alert("Usuario: ${usuarioEncontrado.usuario} \\nPassword: ${usuarioEncontrado.password}");
                    window.location.href = "http://localhost:3000/home";
                </script>
            `);
        } else {
            res.send(`
                <script>
                    alert("Usuario no encontrado");
                    window.location.href = "http://localhost:3000/home";
                </script>
            `);
        }
    } finally {
        await cliente.close();
    }
});

// Ruta para eliminar un usuario
app.post('/delete', async(req, res) => {
    try {
        const { usuario } = req.body;
        await cliente.connect();
        const db = cliente.db('DataBaseGrupoA');
        const coleccion = db.collection('users');

        const resultado = await coleccion.deleteOne({ usuario: usuario });

        if (resultado.deletedCount > 0) {
            res.send(`
                <script>
                    alert("Usuario eliminado correctamente");
                    window.location.href = "http://localhost:3000/home";
                </script>
            `);
        } else {
            res.send(`
                <script>
                    alert("Usuario no encontrado");
                    window.location.href = "http://localhost:3000/home";
                </script>
            `);
        }
    } finally {
        await cliente.close();
    }
});


app.listen(port,()=>{

    console.log(`server listenig at http:localhost//localhost:${port}`);
});