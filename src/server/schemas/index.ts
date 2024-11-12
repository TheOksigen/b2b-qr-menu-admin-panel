import { z } from "zod";

const userSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["OWNER", "EMPLOYEE"]),
    restaurantId: z.string().optional(),
});

const restaurantSchema = z.object({
    name: z.string().min(2, "Restaurant name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const menuSchema = z.object({
    title: z.string().min(2, "Menu title must be at least 2 characters"),
    description: z.string().optional(),
    restaurantId: z.string(),
});

const menuItemSchema = z.object({
    name: z.string().min(2, "Item name must be at least 2 characters"),
    price: z.number().positive("Price must be positive"),
    details: z.string().optional(),
    menuId: z.string(),
    categoryId: z.string().optional(),
    availableFrom: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format").optional(),
    availableUntil: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format").optional(),
    availableMonths: z.array(z.number().min(1).max(12)).optional(),
});

const categorySchema = z.object({
    name: z.string().min(2, "Category name must be at least 2 characters"),
});

export { userSchema, restaurantSchema, menuSchema, menuItemSchema, categorySchema };