// src/controllers/productController.ts
import { Request, Response } from 'express';
import { products, Product } from '../models/product';
import { v4 as uuidv4 } from 'uuid';
import { validationResult, body } from 'express-validator';
import jwt from 'jsonwebtoken';

// Middleware to authenticate user
export const authenticate = (req: Request, res: Response, next: Function) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded: any = jwt.verify(token, 'your_jwt_secret');
        req.body.userId = decoded.userId; // Attach userId to the request body
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Add a new product
export const addProduct = [
    authenticate,
    body('name').isLength({ min: 1 }),
    body('price').isFloat({ gt: 0 }),
    body('description').isLength({ min: 5 }),
    (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, price, description, userId } = req.body;

        const newProduct: Product = {
            id: uuidv4(),
            name,
            price,
            description,
            userId,
        };

        products.push(newProduct);
        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    }
];

// Get all products
export const getProducts = (req: Request, res: Response) => {
    res.json(products);
};

// Delete a product by ID
export const deleteProduct = [
    authenticate,
    (req: Request, res: Response) => {
        const { id } = req.params;
        const { userId } = req.body;

        const productIndex = products.findIndex(product => product.id === id && product.userId === userId);

        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found or unauthorized' });
        }

        products.splice(productIndex, 1);
        res.json({ message: 'Product deleted successfully' });
    }
];
