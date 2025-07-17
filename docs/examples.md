# Examples

This document provides practical examples of using Schema Builder for common use cases and scenarios.

## Basic Examples

### User Management Schema

A typical user schema for authentication and profile management.

```json
{
  "name": "User",
  "fields": [
    {
      "name": "id",
      "type": "string",
      "required": true,
      "unique": true
    },
    {
      "name": "email",
      "type": "string",
      "required": true,
      "unique": true,
      "validation": {
        "regex": "^[^@]+@[^@]+\\.[^@]+$"
      }
    },
    {
      "name": "password",
      "type": "string",
      "required": true,
      "validation": {
        "min": 8,
        "max": 128
      }
    },
    {
      "name": "firstName",
      "type": "string",
      "required": true,
      "validation": {
        "min": 1,
        "max": 50
      }
    },
    {
      "name": "lastName",
      "type": "string",
      "required": true,
      "validation": {
        "min": 1,
        "max": 50
      }
    },
    {
      "name": "dateOfBirth",
      "type": "date",
      "required": false
    },
    {
      "name": "isActive",
      "type": "boolean",
      "required": true,
      "validation": {
        "default": true
      }
    },
    {
      "name": "role",
      "type": "string",
      "required": true,
      "validation": {
        "default": "user"
      }
    }
  ]
}
```

### E-commerce Product Schema

A comprehensive product schema for online stores.

```json
{
  "name": "Product",
  "fields": [
    {
      "name": "sku",
      "type": "string",
      "required": true,
      "unique": true,
      "validation": {
        "regex": "^[A-Z0-9-]+$"
      }
    },
    {
      "name": "name",
      "type": "string",
      "required": true,
      "validation": {
        "min": 1,
        "max": 200
      }
    },
    {
      "name": "description",
      "type": "string",
      "required": false,
      "validation": {
        "max": 2000
      }
    },
    {
      "name": "price",
      "type": "number",
      "required": true,
      "validation": {
        "min": 0
      }
    },
    {
      "name": "compareAtPrice",
      "type": "number",
      "required": false,
      "validation": {
        "min": 0
      }
    },
    {
      "name": "inStock",
      "type": "boolean",
      "required": true,
      "validation": {
        "default": true
      }
    },
    {
      "name": "stockQuantity",
      "type": "number",
      "required": true,
      "validation": {
        "min": 0,
        "default": 0
      }
    },
    {
      "name": "categories",
      "type": "array",
      "arrayType": "string",
      "required": false,
      "validation": {
        "min": 1,
        "max": 5
      }
    },
    {
      "name": "tags",
      "type": "array",
      "arrayType": "string",
      "required": false,
      "validation": {
        "max": 10
      }
    },
    {
      "name": "specifications",
      "type": "object",
      "required": false,
      "objectFields": [
        {
          "name": "weight",
          "type": "number",
          "required": false,
          "validation": {
            "min": 0
          }
        },
        {
          "name": "dimensions",
          "type": "string",
          "required": false
        },
        {
          "name": "color",
          "type": "string",
          "required": false
        },
        {
          "name": "material",
          "type": "string",
          "required": false
        }
      ]
    }
  ]
}
```

## Advanced Examples

### Blog Post with Comments

A complex schema with nested objects and arrays.

```json
{
  "name": "BlogPost",
  "fields": [
    {
      "name": "slug",
      "type": "string",
      "required": true,
      "unique": true,
      "validation": {
        "regex": "^[a-z0-9-]+$"
      }
    },
    {
      "name": "title",
      "type": "string",
      "required": true,
      "validation": {
        "min": 1,
        "max": 200
      }
    },
    {
      "name": "content",
      "type": "string",
      "required": true,
      "validation": {
        "min": 100
      }
    },
    {
      "name": "excerpt",
      "type": "string",
      "required": false,
      "validation": {
        "max": 300
      }
    },
    {
      "name": "authorId",
      "type": "string",
      "required": true
    },
    {
      "name": "publishedAt",
      "type": "date",
      "required": false
    },
    {
      "name": "isPublished",
      "type": "boolean",
      "required": true,
      "validation": {
        "default": false
      }
    },
    {
      "name": "tags",
      "type": "array",
      "arrayType": "string",
      "required": false,
      "validation": {
        "max": 10
      }
    },
    {
      "name": "categories",
      "type": "array",
      "arrayType": "string",
      "required": false,
      "validation": {
        "min": 1,
        "max": 3
      }
    },
    {
      "name": "metadata",
      "type": "object",
      "required": false,
      "objectFields": [
        {
          "name": "views",
          "type": "number",
          "required": false,
          "validation": {
            "min": 0,
            "default": 0
          }
        },
        {
          "name": "likes",
          "type": "number",
          "required": false,
          "validation": {
            "min": 0,
            "default": 0
          }
        },
        {
          "name": "featured",
          "type": "boolean",
          "required": false,
          "validation": {
            "default": false
          }
        },
        {
          "name": "seoTitle",
          "type": "string",
          "required": false,
          "validation": {
            "max": 60
          }
        },
        {
          "name": "seoDescription",
          "type": "string",
          "required": false,
          "validation": {
            "max": 160
          }
        }
      ]
    },
    {
      "name": "comments",
      "type": "array",
      "arrayType": "object",
      "required": false,
      "validation": {
        "max": 100
      }
    }
  ]
}
```

### Order Management System

A comprehensive order schema for e-commerce.

```json
{
  "name": "Order",
  "fields": [
    {
      "name": "orderNumber",
      "type": "string",
      "required": true,
      "unique": true,
      "validation": {
        "regex": "^ORD-[0-9]{8}$"
      }
    },
    {
      "name": "customerId",
      "type": "string",
      "required": true
    },
    {
      "name": "status",
      "type": "string",
      "required": true,
      "validation": {
        "default": "pending"
      }
    },
    {
      "name": "items",
      "type": "array",
      "arrayType": "object",
      "required": true,
      "validation": {
        "min": 1,
        "max": 50
      }
    },
    {
      "name": "subtotal",
      "type": "number",
      "required": true,
      "validation": {
        "min": 0
      }
    },
    {
      "name": "tax",
      "type": "number",
      "required": true,
      "validation": {
        "min": 0
      }
    },
    {
      "name": "shipping",
      "type": "number",
      "required": true,
      "validation": {
        "min": 0
      }
    },
    {
      "name": "total",
      "type": "number",
      "required": true,
      "validation": {
        "min": 0
      }
    },
    {
      "name": "currency",
      "type": "string",
      "required": true,
      "validation": {
        "regex": "^[A-Z]{3}$",
        "default": "USD"
      }
    },
    {
      "name": "shippingAddress",
      "type": "object",
      "required": true,
      "objectFields": [
        {
          "name": "firstName",
          "type": "string",
          "required": true,
          "validation": {
            "min": 1,
            "max": 50
          }
        },
        {
          "name": "lastName",
          "type": "string",
          "required": true,
          "validation": {
            "min": 1,
            "max": 50
          }
        },
        {
          "name": "company",
          "type": "string",
          "required": false,
          "validation": {
            "max": 100
          }
        },
        {
          "name": "address1",
          "type": "string",
          "required": true,
          "validation": {
            "min": 1,
            "max": 100
          }
        },
        {
          "name": "address2",
          "type": "string",
          "required": false,
          "validation": {
            "max": 100
          }
        },
        {
          "name": "city",
          "type": "string",
          "required": true,
          "validation": {
            "min": 1,
            "max": 50
          }
        },
        {
          "name": "state",
          "type": "string",
          "required": true,
          "validation": {
            "min": 2,
            "max": 50
          }
        },
        {
          "name": "zipCode",
          "type": "string",
          "required": true,
          "validation": {
            "regex": "^\\d{5}(-\\d{4})?$"
          }
        },
        {
          "name": "country",
          "type": "string",
          "required": true,
          "validation": {
            "regex": "^[A-Z]{2}$",
            "default": "US"
          }
        }
      ]
    },
    {
      "name": "billingAddress",
      "type": "object",
      "required": false,
      "objectFields": [
        {
          "name": "firstName",
          "type": "string",
          "required": true,
          "validation": {
            "min": 1,
            "max": 50
          }
        },
        {
          "name": "lastName",
          "type": "string",
          "required": true,
          "validation": {
            "min": 1,
            "max": 50
          }
        },
        {
          "name": "company",
          "type": "string",
          "required": false,
          "validation": {
            "max": 100
          }
        },
        {
          "name": "address1",
          "type": "string",
          "required": true,
          "validation": {
            "min": 1,
            "max": 100
          }
        },
        {
          "name": "address2",
          "type": "string",
          "required": false,
          "validation": {
            "max": 100
          }
        },
        {
          "name": "city",
          "type": "string",
          "required": true,
          "validation": {
            "min": 1,
            "max": 50
          }
        },
        {
          "name": "state",
          "type": "string",
          "required": true,
          "validation": {
            "min": 2,
            "max": 50
          }
        },
        {
          "name": "zipCode",
          "type": "string",
          "required": true,
          "validation": {
            "regex": "^\\d{5}(-\\d{4})?$"
          }
        },
        {
          "name": "country",
          "type": "string",
          "required": true,
          "validation": {
            "regex": "^[A-Z]{2}$",
            "default": "US"
          }
        }
      ]
    },
    {
      "name": "paymentMethod",
      "type": "object",
      "required": true,
      "objectFields": [
        {
          "name": "type",
          "type": "string",
          "required": true
        },
        {
          "name": "last4",
          "type": "string",
          "required": false,
          "validation": {
            "regex": "^\\d{4}$"
          }
        },
        {
          "name": "brand",
          "type": "string",
          "required": false
        }
      ]
    },
    {
      "name": "notes",
      "type": "string",
      "required": false,
      "validation": {
        "max": 500
      }
    }
  ]
}
```

## Use Case Examples

### SaaS Application User Schema

For a multi-tenant SaaS application:

```json
{
  "name": "SaasUser",
  "fields": [
    {
      "name": "email",
      "type": "string",
      "required": true,
      "unique": true,
      "validation": {
        "regex": "^[^@]+@[^@]+\\.[^@]+$"
      }
    },
    {
      "name": "organizationId",
      "type": "string",
      "required": true
    },
    {
      "name": "role",
      "type": "string",
      "required": true,
      "validation": {
        "default": "member"
      }
    },
    {
      "name": "permissions",
      "type": "array",
      "arrayType": "string",
      "required": false,
      "validation": {
        "max": 20
      }
    },
    {
      "name": "subscription",
      "type": "object",
      "required": false,
      "objectFields": [
        {
          "name": "plan",
          "type": "string",
          "required": true
        },
        {
          "name": "status",
          "type": "string",
          "required": true
        },
        {
          "name": "expiresAt",
          "type": "date",
          "required": false
        }
      ]
    },
    {
      "name": "preferences",
      "type": "object",
      "required": false,
      "objectFields": [
        {
          "name": "theme",
          "type": "string",
          "required": false,
          "validation": {
            "default": "light"
          }
        },
        {
          "name": "notifications",
          "type": "boolean",
          "required": false,
          "validation": {
            "default": true
          }
        },
        {
          "name": "timezone",
          "type": "string",
          "required": false,
          "validation": {
            "default": "UTC"
          }
        }
      ]
    }
  ]
}
```

### Event Management Schema

For event booking and management:

```json
{
  "name": "Event",
  "fields": [
    {
      "name": "title",
      "type": "string",
      "required": true,
      "validation": {
        "min": 1,
        "max": 200
      }
    },
    {
      "name": "slug",
      "type": "string",
      "required": true,
      "unique": true,
      "validation": {
        "regex": "^[a-z0-9-]+$"
      }
    },
    {
      "name": "description",
      "type": "string",
      "required": true,
      "validation": {
        "min": 10,
        "max": 2000
      }
    },
    {
      "name": "startDate",
      "type": "date",
      "required": true
    },
    {
      "name": "endDate",
      "type": "date",
      "required": true
    },
    {
      "name": "timezone",
      "type": "string",
      "required": true,
      "validation": {
        "default": "UTC"
      }
    },
    {
      "name": "venue",
      "type": "object",
      "required": true,
      "objectFields": [
        {
          "name": "name",
          "type": "string",
          "required": true,
          "validation": {
            "min": 1,
            "max": 100
          }
        },
        {
          "name": "address",
          "type": "string",
          "required": true,
          "validation": {
            "min": 1,
            "max": 200
          }
        },
        {
          "name": "city",
          "type": "string",
          "required": true,
          "validation": {
            "min": 1,
            "max": 50
          }
        },
        {
          "name": "capacity",
          "type": "number",
          "required": true,
          "validation": {
            "min": 1
          }
        }
      ]
    },
    {
      "name": "pricing",
      "type": "object",
      "required": true,
      "objectFields": [
        {
          "name": "currency",
          "type": "string",
          "required": true,
          "validation": {
            "regex": "^[A-Z]{3}$",
            "default": "USD"
          }
        },
        {
          "name": "earlyBird",
          "type": "number",
          "required": false,
          "validation": {
            "min": 0
          }
        },
        {
          "name": "regular",
          "type": "number",
          "required": true,
          "validation": {
            "min": 0
          }
        },
        {
          "name": "vip",
          "type": "number",
          "required": false,
          "validation": {
            "min": 0
          }
        }
      ]
    },
    {
      "name": "categories",
      "type": "array",
      "arrayType": "string",
      "required": false,
      "validation": {
        "min": 1,
        "max": 5
      }
    },
    {
      "name": "speakers",
      "type": "array",
      "arrayType": "object",
      "required": false,
      "validation": {
        "max": 20
      }
    },
    {
      "name": "isPublished",
      "type": "boolean",
      "required": true,
      "validation": {
        "default": false
      }
    },
    {
      "name": "registrationOpen",
      "type": "boolean",
      "required": true,
      "validation": {
        "default": true
      }
    }
  ]
}
```

## Integration Examples

### Next.js API Route

Using generated schemas in a Next.js API route:

```typescript
// pages/api/users.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { UserSchema, User } from '@/generated/schemas';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Validate request body
      const userData = UserSchema.parse(req.body);
      
      // Save to database
      const user = new User(userData);
      await user.save();
      
      res.status(201).json({ success: true, user });
    } catch (error) {
      if (error.name === 'ZodError') {
        res.status(400).json({ error: 'Validation failed', details: error.errors });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

### React Hook Form Integration

Using Zod schemas with React Hook Form:

```typescript
// components/UserForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserSchema, User } from '@/generated/schemas';

export function UserForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<User>({
    resolver: zodResolver(UserSchema)
  });

  const onSubmit = async (data: User) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        console.log('User created successfully');
      }
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('email')}
        type="email"
        placeholder="Email"
      />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input
        {...register('firstName')}
        placeholder="First Name"
      />
      {errors.firstName && <span>{errors.firstName.message}</span>}
      
      <button type="submit">Create User</button>
    </form>
  );
}
```

### Database Seeding

Using generated models for database seeding:

```typescript
// scripts/seed.ts
import { User, Product, Order } from '@/generated/models';

async function seedDatabase() {
  // Create users
  const users = await User.insertMany([
    {
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      isActive: true,
      role: 'admin'
    },
    {
      email: 'jane@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      isActive: true,
      role: 'user'
    }
  ]);

  // Create products
  const products = await Product.insertMany([
    {
      sku: 'LAPTOP-001',
      name: 'Gaming Laptop',
      price: 1299.99,
      inStock: true,
      categories: ['electronics', 'computers'],
      specifications: {
        weight: 2.5,
        color: 'black'
      }
    }
  ]);

  console.log(`Seeded ${users.length} users and ${products.length} products`);
}

seedDatabase().catch(console.error);
```

## Testing Examples

### Unit Tests with Generated Schemas

```typescript
// tests/schemas.test.ts
import { UserSchema, ProductSchema } from '@/generated/schemas';

describe('User Schema Validation', () => {
  test('should validate correct user data', () => {
    const validUser = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      isActive: true,
      role: 'user'
    };

    expect(() => UserSchema.parse(validUser)).not.toThrow();
  });

  test('should reject invalid email', () => {
    const invalidUser = {
      email: 'invalid-email',
      firstName: 'John',
      lastName: 'Doe',
      isActive: true,
      role: 'user'
    };

    expect(() => UserSchema.parse(invalidUser)).toThrow();
  });
});

describe('Product Schema Validation', () => {
  test('should validate product with all fields', () => {
    const validProduct = {
      sku: 'PROD-001',
      name: 'Test Product',
      price: 99.99,
      inStock: true,
      stockQuantity: 10,
      categories: ['test'],
      specifications: {
        weight: 1.5,
        color: 'blue'
      }
    };

    expect(() => ProductSchema.parse(validProduct)).not.toThrow();
  });
});
```

These examples demonstrate the versatility and power of Schema Builder for creating robust, type-safe applications across different domains and use cases.