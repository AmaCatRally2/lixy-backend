require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // Admin şifresini hashlemek için

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Body parser

// MongoDB Bağlantısı
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected...');
    // İlk admin kullanıcısını oluştur (sadece sunucu ilk kez çalıştırıldığında)
    createAdminUser();
  })
  .catch(err => console.error(err));

// Modelleri İçeri Aktar
const User = require('./models/User');
const StoreGame = require('./models/StoreGame');

// Routes'ları İçeri Aktar
const authRoutes = require('./routes/auth');
const storeRoutes = require('./routes/store');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/store', storeRoutes);

app.get('/', (req, res) => {
  res.send('Lixy Backend API is running!');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Admin Kullanıcısını Oluşturma Fonksiyonu
async function createAdminUser() {
  try {
    const adminExists = await User.findOne({ username: process.env.ADMIN_USERNAME });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
      
      const adminUser = new User({
        username: process.env.ADMIN_USERNAME,
        password: hashedPassword,
        role: 'admin' // Yeni bir 'role' alanı ekleyeceğiz
      });
      await adminUser.save();
      console.log('Default admin user created successfully.');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}