// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const supermercadoRoutes = require('./routes/supermercadoRoutes');
const carritoRoutes = require('./routes/carritoRoutes');
const farmaciaRoutes = require('./routes/farmaciaRoutes');
const carritoFarmaciaRoutes = require('./routes/carritoFarmacia');
const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

const handler = (req, res) => {
  const d = new Date()
  res.end(d.toString())
}

module.exports = allowCors(handler)

const app = express();
const port = 3000;
app.use(cors());



mongoose.connect('mongodb+srv://ramiro053:fU1BaZ3oLIwSsVFj@gestordeprecios.gwughqe.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });


app.use(bodyParser.json());

app.use('/supermercadosRoutes', supermercadoRoutes);
app.use('/carritosRoutes', carritoRoutes);
app.use('/carritosFarmacia', carritoFarmaciaRoutes);
app.use('/farmaciaRoutes', farmaciaRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
