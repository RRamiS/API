const express = require('express');
const router = express.Router();
const cors = require('cors');
const CarritoFarmacia = require('../models/carrito');
const Farmacia = require('../models/farmacia');
const ProductoFarmacia = require('../models/productoFarmacia');
router.use(cors());
router.post('/agregar', async (req, res) => {
  const { farmaciaId, productoId, cantidad } = req.body;

  try {
    let carritoFarmacia = await CarritoFarmacia.findOne({ farmaciaId });

    if (!carritoFarmacia) {
      carritoFarmacia = new CarritoFarmacia({ farmaciaId, productos: [] });
    }

    const productoIndex = carritoFarmacia.productos.findIndex(p => p.productoId === productoId);

    if (productoIndex !== -1) {
      carritoFarmacia.productos[productoIndex].cantidad += cantidad;
    } else {
      carritoFarmacia.productos.push({ productoId, cantidad });
    }

    await carritoFarmacia.save();

    res.status(201).json(carritoFarmacia);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/comparar-precios', async (req, res) => {
  const { productos } = req.body;

  try {
    const farmacias = await Farmacia.find().populate('productos.productoId');

    const resultadosComparacion = compararPrecios(farmacias, productos);
    res.json(resultadosComparacion);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error('Error al comparar precios:', error);
    throw error;
  }
});

function compararPrecios(farmacias, productos) {
  if (!farmacias || farmacias.length === 0) {
    console.error('No se encontraron datos de farmacias.');
    return {
      farmaciaMasBarata: null,
      preciosIndividuales: {},
    };
  }
  let farmaciaMasBarata = null;
  let precioTotalMasBajo = Infinity;

  farmacias.forEach(farmacia => {
    const precioTotal = productos.reduce((total, producto) => {
      const productoEnFarmacia = farmacia.productos.find(p => p.nombre === producto);

      if (productoEnFarmacia) {
        return total + productoEnFarmacia.precio;
      } else {
        console.error(`Producto '${producto}' no encontrado en la farmacia '${farmacia.nombre}'`);
        return total;
      }
    }, 0);

    if (precioTotal < precioTotalMasBajo) {
      precioTotalMasBajo = precioTotal;
      farmaciaMasBarata = farmacia;
    }
  });

  const preciosIndividuales = {};
  productos.forEach(producto => {
    preciosIndividuales[producto] = farmacias.map(farmacia => {
      const productoEnFarmacia = farmacia.productos.find(p => p.nombre === producto);
      return {
        farmacia: farmacia.nombre,
        precio: productoEnFarmacia && productoEnFarmacia.precio ? productoEnFarmacia.precio : null,
      };
    });
  });

  return {
    farmaciaMasBarata,
    preciosIndividuales,
  };
}

module.exports = router;
