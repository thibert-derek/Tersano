import { Router } from 'express';
import { addProduct, getProducts, deleteProduct } from '../controllers/productController';

const router = Router();

router.post('/', addProduct);
router.get('/', getProducts);
router.delete('/:id', deleteProduct);

export default router;