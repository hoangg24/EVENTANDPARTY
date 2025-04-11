import express from 'express';
const app = express();
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
dotenv.config();
import router from './routes/index.js';
import userRoutes from './routes/user.js';
import connectDB from './database/database.js';
import eventRoutes from './routes/eventRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js'; 
import paymentRoutes from './routes/paymentRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Khởi động server
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(session({ 
    secret: 'your_secret_key', 
    resave: false, 
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

// Sử dụng router cho tất cả các route
app.use('/api', router);
app.use('/api/users', userRoutes);
app.use('/api/event', eventRoutes);
app.use("/api/services", serviceRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, async () => {
    await connectDB(); // Kết nối với MongoDB
    console.log(`Server is running on http://localhost:${PORT}`);
});