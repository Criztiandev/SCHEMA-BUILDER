# Code Generation Reference

This document explains how Schema Builder generates code from your schema definitions and provides examples of the generated output.

## Overview

Schema Builder automatically generates three types of code from your schema:

1. **TypeScript Interface** - For type safety in your application
2. **Zod Schema** - For runtime validation
3. **Database Model** - For database operations (NoSQL or SQL)

## TypeScript Interface Generation

TypeScript interfaces provide compile-time type checking and IDE support.

### Basic Example

**Input Schema:**
```json
{
  "name": "User",
  "fields": [
    {
      "name": "email",
      "type": "string",
      "required": true,
      "unique": true
    },
    {
      "name": "age",
      "type": "number",
      "required": false
    }
  ]
}
```

**Generated TypeScript:**
```typescript
export interface User {
  /** @unique */
  email: string;
  age?: number;
}
```

### Advanced Features

**With Validation Comments:**
```typescript
export interface Product {
  /** @unique @pattern ^[A-Z0-9-]+$ */
  sku: string;
  /** @min 1 @max 200 */
  name: string;
  /** @min 0 */
  price: number;
  /** @default true */
  inStock: boolean;
}
```

**With Arrays and Objects:**
```typescript
export interface User {
  email: string;
  tags: string[];
  profile: {
    bio?: string;
    website?: string;
  };
}
```

### Type Mapping

| Schema Type | TypeScript Type | Notes |
|-------------|----------------|-------|
| `string` | `string` | Basic string type |
| `number` | `number` | Includes integers and decimals |
| `boolean` | `boolean` | True/false values |
| `date` | `Date` | JavaScript Date object |
| `array` | `T[]` | Array of specified type |
| `object` | `{ ... }` | Nested object structure |

## Zod Schema Generation

Zod schemas provide runtime validation for forms, APIs, and data processing.

### Basic Example

**Generated Zod Schema:**
```typescript
import { z } from 'zod';

export const UserSchema = z.object({
  email: z.string(),
  age: z.number().optional()
});

export type User = z.infer<typeof UserSchema>;
```

### Validation Rules

**String Validation:**
```typescript
export const UserSchema = z.object({
  email: z.string()
    .min(5, "Email is too short")
    .max(100, "Email is too long")
    .regex(/^[^@]+@[^@]+\.[^@]+$/, "Invalid email format"),
  
  firstName: z.string()
    .min(1, "First name is required")
    .max(50, "First name is too long"),
  
  bio: z.string()
    .max(500, "Bio is too long")
    .default("")
});
```

**Number Validation:**
```typescript
export const ProductSchema = z.object({
  price: z.number()
    .min(0, "Price cannot be negative")
    .max(10000, "Price is too high"),
  
  rating: z.number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5")
    .default(5)
});
```

**Array Validation:**
```typescript
export const PostSchema = z.object({
  tags: z.array(z.string())
    .min(1, "At least one tag is required")
    .max(10, "Too many tags"),
  
  categories: z.array(z.string())
    .optional()
    .default([])
});
```

**Object Validation:**
```typescript
export const UserSchema = z.object({
  profile: z.object({
    bio: z.string().max(500).optional(),
    website: z.string().url().optional(),
    social: z.object({
      twitter: z.string().optional(),
      linkedin: z.string().optional()
    }).optional()
  }).optional()
});
```

### Smart Defaults

When Smart Defaults is enabled, additional intelligent validation is added:

```typescript
export const UserSchema = z.object({
  // Required strings get min(1) automatically
  firstName: z.string()
    .min(1, "First name is required")
    .max(155, "First name is too long"),
  
  // Optional strings don't get min validation
  middleName: z.string()
    .max(155, "Middle name is too long")
    .optional(),
  
  // Numbers get reasonable defaults
  age: z.number()
    .min(0, "Age cannot be negative")
    .max(120, "Age seems unrealistic")
    .optional()
});
```

## Database Model Generation

### NoSQL (Mongoose) Models

**Basic Mongoose Schema:**
```typescript
import { Schema, model, Document } from 'mongoose';

export interface UserDocument extends Document {
  email: string;
  age?: number;
}

const UserSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  age: { type: Number }
}, {
  timestamps: true
});

export const User = model<UserDocument>('User', UserSchema);
```

**Advanced Mongoose Schema:**
```typescript
const ProductSchema = new Schema<ProductDocument>({
  sku: { 
    type: String, 
    required: true, 
    unique: true,
    match: /^[A-Z0-9-]+$/
  },
  name: { 
    type: String, 
    required: true, 
    minlength: 1, 
    maxlength: 200 
  },
  price: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  inStock: { 
    type: Boolean, 
    required: true, 
    default: true 
  },
  tags: [{ type: String }],
  specifications: {
    weight: { type: Number, min: 0 },
    dimensions: { type: String },
    color: { type: String }
  }
}, {
  timestamps: true
});
```

**Array and Object Handling:**
```typescript
const BlogPostSchema = new Schema<BlogPostDocument>({
  // Array of strings
  tags: [{ type: String }],
  
  // Array of objects
  comments: [{
    author: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Nested object
  metadata: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    featured: { type: Boolean, default: false }
  }
});
```

### SQL Models

**Basic SQL Schema:**
```sql
-- Create User table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  age INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for unique fields
CREATE UNIQUE INDEX idx_users_email ON users(email);
```

**Advanced SQL Schema:**
```sql
-- Create Product table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  sku VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  in_stock BOOLEAN NOT NULL DEFAULT true,
  tags JSONB,
  specifications JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for unique fields
CREATE UNIQUE INDEX idx_products_sku ON products(sku);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**Complex Data Types in SQL:**
```sql
-- Arrays and objects stored as JSONB
CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  tags JSONB, -- Array of strings
  metadata JSONB, -- Object with nested properties
  comments JSONB, -- Array of objects
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes on JSONB fields
CREATE INDEX idx_blog_posts_tags ON blog_posts USING GIN (tags);
CREATE INDEX idx_blog_posts_metadata ON blog_posts USING GIN (metadata);
```

## Type Mapping Reference

### Schema to TypeScript

| Schema Type | TypeScript | Required | Optional |
|-------------|------------|----------|----------|
| `string` | `string` | `field: string` | `field?: string` |
| `number` | `number` | `field: number` | `field?: number` |
| `boolean` | `boolean` | `field: boolean` | `field?: boolean` |
| `date` | `Date` | `field: Date` | `field?: Date` |
| `array` | `T[]` | `field: T[]` | `field?: T[]` |
| `object` | `{ ... }` | `field: { ... }` | `field?: { ... }` |

### Schema to Zod

| Schema Type | Zod Schema | With Validation |
|-------------|------------|-----------------|
| `string` | `z.string()` | `z.string().min(1).max(100)` |
| `number` | `z.number()` | `z.number().min(0).max(1000)` |
| `boolean` | `z.boolean()` | `z.boolean().default(true)` |
| `date` | `z.date()` | `z.date().default(new Date())` |
| `array` | `z.array(T)` | `z.array(T).min(1).max(10)` |
| `object` | `z.object({...})` | `z.object({...}).optional()` |

### Schema to Database

| Schema Type | Mongoose | SQL |
|-------------|----------|-----|
| `string` | `String` | `VARCHAR(255)` |
| `number` | `Number` | `DECIMAL(10,2)` or `INTEGER` |
| `boolean` | `Boolean` | `BOOLEAN` |
| `date` | `Date` | `TIMESTAMP` |
| `array` | `[Type]` | `JSONB` |
| `object` | `{ ... }` | `JSONB` |

## Usage Examples

### Form Validation

```typescript
import { UserSchema } from './generated/schemas';

// Validate form data
const validateUser = (formData: unknown) => {
  try {
    const user = UserSchema.parse(formData);
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error.errors };
  }
};
```

### API Endpoint

```typescript
import { UserSchema, User } from './generated/schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userData = UserSchema.parse(body);
    
    // Save to database
    const user = new User(userData);
    await user.save();
    
    return Response.json({ success: true, user });
  } catch (error) {
    return Response.json({ error: 'Invalid data' }, { status: 400 });
  }
}
```

### Database Query

```typescript
// Mongoose
const users = await User.find({ isActive: true })
  .select('email firstName lastName')
  .limit(10);

// SQL (with an ORM like Prisma)
const users = await prisma.user.findMany({
  where: { isActive: true },
  select: { email: true, firstName: true, lastName: true },
  take: 10
});
```

## Best Practices

### Code Organization

```
src/
├── schemas/
│   ├── user.schema.ts      # Generated schemas
│   ├── product.schema.ts
│   └── index.ts           # Export all schemas
├── models/
│   ├── user.model.ts      # Generated models
│   ├── product.model.ts
│   └── index.ts
└── types/
    ├── user.types.ts      # Generated interfaces
    ├── product.types.ts
    └── index.ts
```

### Import Strategy

```typescript
// Centralized exports
export * from './user.schema';
export * from './product.schema';

// Usage
import { UserSchema, ProductSchema } from '@/schemas';
import { User, Product } from '@/models';
import type { User as UserType, Product as ProductType } from '@/types';
```

### Validation Patterns

```typescript
// Create reusable validation functions
export const validateAndCreate = async <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  model: any
) => {
  const validated = schema.parse(data);
  return await model.create(validated);
};

// Usage
const user = await validateAndCreate(UserSchema, userData, User);
```