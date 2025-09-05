const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  location: {
    type: String,
    required: true
  },
  propertyType: { type: String, enum: ["Apartment", "House", "Villa", "Land"] ,default:"House"},
  bedrooms: Number,
  bathrooms: Number,
  amenities: [String],
  images: { type: String, required: true }, // URLs or file paths
  listedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // agent/admin
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', PropertySchema);
