"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import {
  Book,
  PlayCircle,
  User,
  FileText,
  Code,
  Terminal,
  HelpCircle,
  Lightbulb,
  ChevronRight,
  Home,
} from "lucide-react";

const documentationSections = [
  {
    id: "overview",
    title: "Overview",
    icon: Home,
    content: `# Schema Builder Documentation

Welcome to the Schema Builder documentation! This guide will help you understand and effectively use the Schema Builder application.

## What is Schema Builder?

Schema Builder is a modern web application that helps developers create database schemas visually and generate corresponding code automatically. It supports both NoSQL (MongoDB) and SQL database formats, making it versatile for different project needs.

### Key Benefits

- **Visual Design**: Build schemas without writing code
- **Type Safety**: Generate TypeScript interfaces automatically
- **Validation**: Create Zod schemas with smart defaults
- **Multi-Database**: Support for both NoSQL and SQL databases
- **Real-time**: See generated code instantly as you build

## Quick Start

1. **Install dependencies**: \`npm install\`
2. **Start development server**: \`npm run dev\`
3. **Open browser**: Navigate to \`http://localhost:3000\`
4. **Create your first schema**: Use either the Form Builder or JSON Editor
5. **Generate code**: View the automatically generated TypeScript, Zod, and database models

## Documentation Sections

- **Getting Started** - Installation and setup
- **User Guide** - How to use the application
- **Schema Format** - Understanding schema structure
- **Code Generation** - Generated code examples
- **API Reference** - Technical reference
- **Examples** - Common use cases and examples
- **Troubleshooting** - Common issues and solutions

## Need Help?

- Check the Troubleshooting Guide for common issues
- Review Examples for inspiration
- Open an issue on GitHub for bugs or feature requests`,
  },
  {
    id: "user-guide",
    title: "User Guide",
    icon: User,
    content: `# User Guide

This comprehensive guide covers all features and functionality of the Schema Builder application.

## Overview

Schema Builder provides two main ways to create database schemas:
1. **Form Builder**: Visual interface for building schemas
2. **JSON Editor**: Code-based schema definition

Both methods generate the same output: TypeScript interfaces, Zod validation schemas, and database models.

## Interface Layout

The application consists of three main sections:

- **Header**: Format selection (NoSQL/SQL) and settings
- **Input Panel**: Form Builder or JSON Editor tabs
- **Output Panel**: Generated code display with syntax highlighting

## Using the Form Builder

The Form Builder provides a visual interface for creating schemas without writing code.

### Creating a New Schema

1. **Select Form Builder Tab**: Click the "Form Builder" tab
2. **Enter Schema Name**: Type a descriptive name (e.g., "User", "Product", "Order")
3. **Add Fields**: Click "Add Field" to start building your schema

### Field Configuration

Each field has several configuration options:

#### Basic Properties

- **Field Name**: The identifier for the field (e.g., "email", "firstName")
- **Type**: Select from available data types
- **Required**: Toggle whether the field is mandatory
- **Unique**: Toggle whether the field must be unique across records

#### Field Types

**String**
- Text data with optional validation
- Supports min/max length, regex patterns
- Common for names, emails, descriptions

**Number**
- Numeric data (integers or decimals)
- Supports min/max value constraints
- Used for ages, prices, quantities

**Boolean**
- True/false values
- Simple toggle fields
- Used for flags, preferences

**Date**
- Date and timestamp fields
- Automatically handled by database
- Used for creation dates, birthdays

**Array**
- Collections of items
- Specify the type of array elements
- Used for tags, categories, lists

**Object**
- Nested data structures
- Define sub-fields within objects
- Used for addresses, preferences

## Using the JSON Editor

The JSON Editor provides a code-based approach for defining schemas.

### JSON Schema Format

\`\`\`json
{
  "name": "SchemaName",
  "fields": [
    {
      "name": "fieldName",
      "type": "string",
      "required": true,
      "unique": false,
      "validation": {
        "min": 1,
        "max": 100,
        "regex": "^[a-zA-Z]+$",
        "default": "defaultValue"
      }
    }
  ]
}
\`\`\`

## Generated Code

### TypeScript Interface

Provides type safety for your application:

\`\`\`typescript
export interface User {
  /** @unique */
  email: string;
  firstName: string;
  age?: number;
  isActive: boolean;
}
\`\`\`

### Zod Schema

Runtime validation for forms and APIs:

\`\`\`typescript
export const UserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  age: z.number().min(0).max(120).optional(),
  isActive: z.boolean()
});
\`\`\``,
  },
  {
    id: "schema-format",
    title: "Schema Format",
    icon: FileText,
    content: `# Schema Format Reference

This document provides a comprehensive reference for the schema format used in Schema Builder.

## Schema Structure

A schema consists of a name and an array of field definitions:

\`\`\`json
{
  "name": "SchemaName",
  "fields": [
    // Field definitions
  ]
}
\`\`\`

### Schema Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| \`name\` | string | Yes | The name of the schema (used for generated types and models) |
| \`fields\` | Field[] | Yes | Array of field definitions |

## Field Definition

Each field in the schema has the following structure:

\`\`\`json
{
  "name": "fieldName",
  "type": "string",
  "required": true,
  "unique": false,
  "validation": {
    // Validation options
  }
}
\`\`\`

### Field Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| \`name\` | string | Yes | Field identifier (must be valid JavaScript identifier) |
| \`type\` | FieldType | Yes | Data type of the field |
| \`required\` | boolean | Yes | Whether the field is mandatory |
| \`unique\` | boolean | No | Whether the field must be unique (default: false) |
| \`validation\` | ValidationOptions | No | Additional validation rules |
| \`arrayType\` | FieldType | No | Type of array elements (required when type is "array") |
| \`objectFields\` | Field[] | No | Nested fields (required when type is "object") |

## Field Types

### Primitive Types

#### String
\`\`\`json
{
  "name": "email",
  "type": "string",
  "required": true,
  "unique": true,
  "validation": {
    "min": 5,
    "max": 100,
    "regex": "^[^@]+@[^@]+\\\\.[^@]+$",
    "default": ""
  }
}
\`\`\`

#### Number
\`\`\`json
{
  "name": "age",
  "type": "number",
  "required": false,
  "validation": {
    "min": 0,
    "max": 120,
    "default": 18
  }
}
\`\`\`

#### Boolean
\`\`\`json
{
  "name": "isActive",
  "type": "boolean",
  "required": true,
  "validation": {
    "default": true
  }
}
\`\`\`

### Complex Types

#### Array
\`\`\`json
{
  "name": "tags",
  "type": "array",
  "arrayType": "string",
  "required": false,
  "validation": {
    "min": 1,
    "max": 10,
    "default": []
  }
}
\`\`\`

#### Object
\`\`\`json
{
  "name": "address",
  "type": "object",
  "required": true,
  "objectFields": [
    {
      "name": "street",
      "type": "string",
      "required": true
    },
    {
      "name": "city",
      "type": "string",
      "required": true
    }
  ]
}
\`\`\``,
  },
  {
    id: "code-generation",
    title: "Code Generation",
    icon: Code,
    content: `# Code Generation Reference

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
\`\`\`json
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
\`\`\`

**Generated TypeScript:**
\`\`\`typescript
export interface User {
  /** @unique */
  email: string;
  age?: number;
}
\`\`\`

## Zod Schema Generation

Zod schemas provide runtime validation for forms, APIs, and data processing.

### Basic Example

**Generated Zod Schema:**
\`\`\`typescript
import { z } from 'zod';

export const UserSchema = z.object({
  email: z.string(),
  age: z.number().optional()
});

export type User = z.infer<typeof UserSchema>;
\`\`\`

### Validation Rules

**String Validation:**
\`\`\`typescript
export const UserSchema = z.object({
  email: z.string()
    .min(5, "Email is too short")
    .max(100, "Email is too long")
    .regex(/^[^@]+@[^@]+\\.[^@]+$/, "Invalid email format"),
  
  firstName: z.string()
    .min(1, "First name is required")
    .max(50, "First name is too long")
});
\`\`\`

## Database Model Generation

### NoSQL (Mongoose) Models

**Basic Mongoose Schema:**
\`\`\`typescript
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
\`\`\`

### SQL Models

**Basic SQL Schema:**
\`\`\`sql
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
\`\`\``,
  },
  {
    id: "api-reference",
    title: "API Reference",
    icon: Terminal,
    content: `# API Reference

This document provides a comprehensive reference for the Schema Builder's internal APIs, types, and utilities.

## Core Types

### Schema Interface

\`\`\`typescript
interface Schema {
  name: string;
  fields: Field[];
}
\`\`\`

**Properties:**
- \`name\`: The schema identifier used for code generation
- \`fields\`: Array of field definitions

### Field Interface

\`\`\`typescript
interface Field {
  name: string;
  type: "string" | "number" | "boolean" | "date" | "array" | "object";
  required: boolean;
  unique?: boolean;
  validation?: ValidationOptions;
  arrayType?: "string" | "number" | "boolean" | "date" | "object";
  objectFields?: Field[];
}
\`\`\`

### ValidationOptions Interface

\`\`\`typescript
interface ValidationOptions {
  min?: number;
  max?: number;
  regex?: string;
  default?: string;
}
\`\`\`

## Core Functions

### generateCode

Generates all code types from a schema definition.

\`\`\`typescript
function generateCode(
  schema: Schema, 
  format: 'nosql' | 'sql', 
  useSmartDefaults?: boolean
): GeneratedCode
\`\`\`

**Parameters:**
- \`schema\`: The schema definition
- \`format\`: Target database format
- \`useSmartDefaults\`: Enable intelligent validation defaults (optional)

**Returns:** Object containing generated Zod, TypeScript, and model code

### parseJsonSchema

Parses and validates a JSON schema string.

\`\`\`typescript
function parseJsonSchema(jsonString: string): Schema
\`\`\`

**Parameters:**
- \`jsonString\`: JSON representation of the schema

**Returns:** Validated Schema object

**Throws:** Error if JSON is invalid or schema format is incorrect

## Component APIs

### FormBuilder Component

\`\`\`typescript
interface FormBuilderProps {
  onSchemaChange: (schema: Schema | null) => void;
  format: "nosql" | "sql";
  onFormatChange: (format: "nosql" | "sql") => void;
}
\`\`\`

### SchemaInput Component

\`\`\`typescript
interface SchemaInputProps {
  onSchemaChange: (schema: Schema | null) => void;
  format: "nosql" | "sql";
  onFormatChange: (format: "nosql" | "sql") => void;
  useSmartDefaults: boolean;
  onSmartDefaultsChange: (enabled: boolean) => void;
}
\`\`\``,
  },
  {
    id: "examples",
    title: "Examples",
    icon: Lightbulb,
    content: `# Examples

This document provides practical examples of using Schema Builder for common use cases and scenarios.

## Basic Examples

### User Management Schema

A typical user schema for authentication and profile management.

\`\`\`json
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
        "regex": "^[^@]+@[^@]+\\\\.[^@]+$"
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
      "name": "isActive",
      "type": "boolean",
      "required": true,
      "validation": {
        "default": true
      }
    }
  ]
}
\`\`\`

### E-commerce Product Schema

A comprehensive product schema for online stores.

\`\`\`json
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
      "name": "price",
      "type": "number",
      "required": true,
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
          "name": "color",
          "type": "string",
          "required": false
        }
      ]
    }
  ]
}
\`\`\`

## Integration Examples

### Next.js API Route

Using generated schemas in a Next.js API route:

\`\`\`typescript
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
  }
}
\`\`\`

### React Hook Form Integration

Using Zod schemas with React Hook Form:

\`\`\`typescript
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
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} type="email" placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input {...register('firstName')} placeholder="First Name" />
      {errors.firstName && <span>{errors.firstName.message}</span>}
      
      <button type="submit">Create User</button>
    </form>
  );
}
\`\`\``,
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    icon: HelpCircle,
    content: `# Troubleshooting Guide

This guide helps you resolve common issues when using Schema Builder.

## Installation Issues

### Node.js Version Compatibility

**Problem:** Application fails to start with Node.js version errors.

**Solution:**
\`\`\`bash
# Check your Node.js version
node --version

# Should be 18.0 or higher
# If not, update Node.js:
# Using nvm (recommended)
nvm install 18
nvm use 18
\`\`\`

### Package Installation Failures

**Problem:** \`npm install\` fails with dependency errors.

**Solution:**
\`\`\`bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
\`\`\`

### Port Already in Use

**Problem:** Development server fails to start on port 3000.

**Solution:**
\`\`\`bash
# Kill process on port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
\`\`\`

## Schema Validation Issues

### Invalid JSON Format

**Problem:** JSON editor shows syntax errors.

**Common Issues:**
- Missing commas between objects
- Trailing commas (not allowed in JSON)
- Unescaped quotes in strings
- Missing closing brackets

**Solution:**
\`\`\`json
// ❌ Invalid JSON
{
  "name": "User",
  "fields": [
    {
      "name": "email",
      "type": "string",
      "required": true,
    }  // Trailing comma
  ]
}

// ✅ Valid JSON
{
  "name": "User",
  "fields": [
    {
      "name": "email",
      "type": "string",
      "required": true
    }
  ]
}
\`\`\`

### Schema Name Issues

**Problem:** Schema name validation errors.

**Requirements:**
- Must be a valid JavaScript identifier
- Cannot start with numbers
- Cannot contain spaces or special characters
- Should use PascalCase

### Field Name Issues

**Problem:** Field names causing validation errors.

**Requirements:**
- Must be valid JavaScript identifiers
- Should use camelCase
- Cannot be JavaScript reserved words

## Code Generation Issues

### No Code Generated

**Problem:** Output panel remains empty despite valid schema.

**Possible Causes:**
1. Schema name is missing
2. No fields defined
3. JavaScript errors in browser console

**Solution:**
1. Ensure schema has a name and at least one field
2. Check browser console for errors
3. Try refreshing the page

### TypeScript Compilation Errors

**Problem:** Generated TypeScript code has compilation errors.

**Common Issues:**
- Reserved keywords as field names
- Invalid type combinations
- Circular references in objects

## Browser and Performance Issues

### Slow Performance

**Problem:** Application becomes slow with large schemas.

**Solution:**
1. Limit the number of fields (recommended: < 50 per schema)
2. Avoid deeply nested objects (recommended: < 5 levels)
3. Clear browser cache and refresh
4. Close other browser tabs to free memory

### Monaco Editor Issues

**Problem:** Code editor not loading or functioning properly.

**Solution:**
1. Ensure JavaScript is enabled
2. Try a different browser (Chrome, Firefox, Safari)
3. Disable browser extensions that might interfere
4. Clear browser cache and cookies

## Getting Help

### Debug Information

When reporting issues, include:

1. **Browser and version**
2. **Node.js version**: \`node --version\`
3. **npm version**: \`npm --version\`
4. **Error messages** from browser console
5. **Schema definition** that's causing issues
6. **Steps to reproduce** the problem

### Common Error Messages

**"Schema must have a valid name"**
- Ensure schema name is provided and valid

**"Field must have a valid name"**
- Check field names are valid JavaScript identifiers

**"Invalid field type"**
- Verify field type is one of: string, number, boolean, date, array, object`,
  },
];

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState("overview");

  const currentSection = documentationSections.find(
    (section) => section.id === activeSection
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Documentation</h1>
          <p className="text-lg text-muted-foreground">
            Complete guide to using Schema Builder
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="p-4 sticky top-8">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Book className="w-5 h-5" />
                Contents
              </h2>
              <nav className="space-y-2">
                {documentationSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <Button
                      key={section.id}
                      variant={
                        activeSection === section.id ? "default" : "ghost"
                      }
                      className="w-full justify-start text-left"
                      onClick={() => setActiveSection(section.id)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {section.title}
                      {activeSection === section.id && (
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      )}
                    </Button>
                  );
                })}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="p-8">
              <ScrollArea className="h-[calc(100vh-200px)]">
                {currentSection && (
                  <MarkdownRenderer content={currentSection.content} />
                )}
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
