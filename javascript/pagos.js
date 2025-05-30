const express = require('express');
const stripe = require('stripe')(''); // Clave eliminada - usa variables de entorno en producción
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Configuración CORS más completa
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// Middleware esencial
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para el frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pagos.html'));
});

// Ruta de pago con mejor manejo de errores
app.post('/crear-pago', async (req, res) => {
  try {
    console.log('Datos recibidos:', req.body); // Para depuración
    
    const { cantidad, moneda, descripcion } = req.body;
    
    if (!cantidad || isNaN(cantidad) || cantidad < 0.5) {
      return res.status(400).json({ error: 'Cantidad mínima: $0.50' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(parseFloat(cantidad) * 100), // Conversión explícita
      currency: moneda || 'mxn',
      description: descripcion || 'Pago general',
      automatic_payment_methods: { enabled: true },
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });
    
  } catch (error) {
    console.error('Error en Stripe:', error);
    res.status(500).json({ 
      success: false,
      error: error.raw?.message || error.message 
    });
  }
});

// Iniciar servidor con manejo de errores
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Servidor activo en http://localhost:${port}`);
}).on('error', (err) => {
  console.error('❌ Error al iniciar:', err);
});