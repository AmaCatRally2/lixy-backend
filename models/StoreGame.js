const mongoose = require('mongoose');

const StoreGameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  genre: { type: String },
  downloadUrl: { type: String, required: true }, // Oyunun indirileceği URL
  coverImage: { type: String }, // Mağazada gösterilecek kapak resmi URL'si
  bannerImage: { type: String }, // Detay sayfasında gösterilecek banner resmi URL'si
  size: { type: String }, // Oyunun boyutu (örn: "15 GB")
  developer: { type: String },
  publisher: { type: String },
  releaseDate: { type: Date },
  price: { type: Number, default: 0 }, // Ücretsiz veya fiyat
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('StoreGame', StoreGameSchema);