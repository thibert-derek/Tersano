import express from 'express';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
const PORT = process.env.PORT || 5000;

// app.get('/', (req, res) => {
//     res.send('Bonjour!');
// });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
