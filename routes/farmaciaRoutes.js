const express = require('express');
const router = express.Router();
const cors = require('cors');
const Farmacia = require('../models/farmacia');
router.use(cors());

router.get('/', async (req, res) => {
    try {
      const farmacias = await Farmacia.find().populate('productos.productoId');
      res.json(farmacias);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

  router.post('/', async (req, res) => {
    const farmacia = new Farmacia({
      nombre: req.body.nombre,

    });
  
    try {
      const nuevoFarmacia = await farmacia.save();
      res.status(201).json(nuevoFarmacia);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });


router.post('/:farmaciaId/productos', async (req, res) => {
    const { farmaciaId } = req.params;
    const { nombre, precio } = req.body;
  
    try {
      const farmacia = await Farmacia.findById(farmaciaId);
  
      if (!farmacia) {
        return res.status(404).json({ message: 'Farmacia no encontrada' });
      }
  
 
      farmacia.productos.push({ nombre, precio });
      await farmacia.save();
  
      res.status(201).json(farmacia);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });


module.exports = router;
