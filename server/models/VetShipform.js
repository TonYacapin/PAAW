const mongoose = require('mongoose');

const veterinaryShipmentSchema = new mongoose.Schema({
  shipmentType: {
    type: String,
    enum: ['Outgoing', 'Incoming'],
    required: true,
  },
  shipperName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  pointOfOrigin: {
    type: String,
    required: true,
  },
  remarks: {
    type: String,
  },
  liveAnimals: {
    Carabao: {
      type: Number,
      default: 0,
    },
    Cattle: {
      type: Number,
      default: 0,
    },
    Swine: {
      type: Number,
      default: 0,
    },
    Horse: {
      type: Number,
      default: 0,
    },
    Chicken: {
      type: Number,
      default: 0,
    },
    Duck: {
      type: Number,
      default: 0,
    },
    Other: {
      type: Number,
      default: 0,
    },
  },
  animalByProducts: {
    Beef: {
      type: Number,
      default: 0,
    },
    Carabeef: {
      type: Number,
      default: 0,
    },
    Pork: {
      type: Number,
      default: 0,
    },
    PoultryMeat: {
      type: Number,
      default: 0,
    },
    Egg: {
      type: Number,
      default: 0,
    },
    ChickenDung: {
      type: Number,
      default: 0,
    },
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

const VeterinaryShipment = mongoose.model('VeterinaryShipment', veterinaryShipmentSchema);

module.exports = VeterinaryShipment;
