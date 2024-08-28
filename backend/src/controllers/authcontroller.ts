// src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { users, User } from '../models/user';
import { v4 as uuidv4 } from 'uuid';
import { body, validationResult } from 'express-validator';

// Sign-up controller
export const signup = [
    body('username'),
    body('email').isEmail(),
    body('password'),
    (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;

        // Check if the user already exists
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Create a new user
        const newUser: User = {
            id: uuidv4(),
            username,
            email,
            password: hashedPassword,
        };

        // Add the user to the mock database
        users.push(newUser);

        return res.status(201).json({ message: 'User registered successfully' });
    }
];

// Login controller
export const login = [
    body('email').isEmail(),
    body('password').exists(),
    (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Find the user by email
        const user = users.find(user => user.email === email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid email' });
        }

        // Compare the password
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', { expiresIn: '1h' });

        return res.json({ token });
    }
];
