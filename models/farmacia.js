const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productoSchema = new Schema({
  productoId: { type: Schema.Types.ObjectId, ref: 'Producto' },
  nombre: String,
  precio: Number,
  cantidad: Number,
});

const farmaciaSchema = new Schema({
  nombre: String,
  productos: [productoSchema],
 
});

module.exports = mongoose.model('Farmacia', farmaciaSchema);
