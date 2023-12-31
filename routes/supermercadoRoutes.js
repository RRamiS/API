const express = require('express');
const router = express.Router();
const cors = require('cors');
const Supermercado = require('../models/supermercado');
router.use(cors());

router.get('/', async (req, res) => {
    try {
      const supermercados = await Supermercado.find().populate('productos.productoId');
      res.json(supermercados);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.post('/', async (req, res) => {
    const supermercado = new Supermercado({
      nombre: req.body.nombre,

    });
  
    try {
      const nuevoSupermercado = await supermercado.save();
      res.status(201).json(nuevoSupermercado);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });


router.post('/:supermercadoId/productos', async (req, res) => {
    const { supermercadoId } = req.params;
    const { nombre, precio } = req.body;
  
    try {
      const supermercado = await Supermercado.findById(supermercadoId);
  
      if (!supermercado) {
        return res.status(404).json({ message: 'Supermercado no encontrado' });
      }
  

      supermercado.productos.push({ nombre, precio });
      await supermercado.save();
  
      res.status(201).json(supermercado);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });


module.exports = router;
