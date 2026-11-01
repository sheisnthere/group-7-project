import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from './config/db';
import User from './models/User';
import Product from './models/Product';

const sampleProducts = [
  {
    name: 'Kemeja Flanel',
    description: 'Kemeja flanel lengan panjang bahan katun premium.',
    price: 150000,
    image: 'https://via.placeholder.com/300?text=Kemeja+Flanel',
    category: 'Fashion',
    stock: 25,
  },
  {
    name: 'Sepatu Sneakers',
    description: 'Sneakers kasual nyaman untuk aktivitas sehari-hari.',
    price: 350000,
    image: 'https://via.placeholder.com/300?text=Sneakers',
    category: 'Fashion',
    stock: 40,
  },
  {
    name: 'Headphone Wireless',
    description: 'Headphone bluetooth dengan noise cancelling.',
    price: 499000,
    image: 'https://via.placeholder.com/300?text=Headphone',
    category: 'Elektronik',
    stock: 15,
  },
  {
    name: 'Botol Minum Stainless',
    description: 'Botol minum stainless steel 1 liter tahan panas & dingin.',
    price: 89000,
    image: 'https://via.placeholder.com/300?text=Botol+Minum',
    category: 'Peralatan',
    stock: 100,
  },
];

const seed = async (): Promise<void> => {
  try {
    await connectDB();

    const adminEmail = (process.env.SEED_ADMIN_EMAIL || 'admin@marketplace.com').toLowerCase();
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'password123';

    // Start from scratch: wipe the two collections we manage.
    await Promise.all([Product.deleteMany({}), User.deleteMany({})]);
    console.log('Koleksi products & users dikosongkan.');

    // Seed a demo admin user.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    const admin = await User.create({
      name: 'Admin Group 7',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    });

    // Seed products owned by the demo admin.
    await Product.insertMany(sampleProducts.map((p) => ({ ...p, createdBy: admin._id })));

    console.log(`Seed selesai: 1 admin + ${sampleProducts.length} produk.`);
    console.log(`Login demo -> email: ${adminEmail} | password: ${adminPassword}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Seed error:', message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seed();
