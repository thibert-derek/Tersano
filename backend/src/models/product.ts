// src/models/product.ts
export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    userId: string; // The ID of the user who created the product
}

export const products: Product[] = []; // Mock database for products
