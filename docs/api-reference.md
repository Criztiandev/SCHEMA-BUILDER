# API Reference

This document provides a comprehensive reference for the Schema Builder's internal APIs, types, and utilities.

## Core Types

### Schema Interface

```typescript
interface Schema {
  name: string;
  fields: Field[];
}
```

**Properties:**
- `name`: The schema identifier used for code generation
- `fields`: Array of field definitions

### Field Interface

```typescript
interface Field {
  name: string;
  type: "string" | "number" | "boolean" | "date" | "array" | "object";
  required: boolean;
  unique?: boolean;
  validation?: ValidationOptions;
  arrayType?: "string" | "number" | "boolean" | "date" | "object";
  objectFields?: Field[];
}
```

**Properties:**
- `name`: Field identifier (must be valid JavaScript identifier)
- `type`: Data type of the field
- `required`: Whether the field is mandatory
- `unique`: Whether the field must be unique (optional)
- `validation`: Additional validation rules (optional)
- `arrayType`: Type of array elements (required when type is "array")
- `objectFields`: Nested field definitions (required when type is "object")

### ValidationOptions Interface

```typescript
interface ValidationOptions {
  min?: number;
  max?: number;
  regex?: string;
  default?: string;
}
```

**Properties:**
- `min`: Minimum value/length constraint
- `max`: Maximum value/length constraint
- `regex`: Regular expression pattern (strings only)
- `default`: Default value

### GeneratedCode Interface

```typescript
interface GeneratedCode {
  zod: string;
  typescript: string;
  model: string;
}
```

**Properties:**
- `zod`: Generated Zod validation schema
- `typescript`: Generated TypeScript interface
- `model`: Generated database model (Mongoose or SQL)

## Core Functions

### generateCode

Generates all code types from a schema definition.

```typescript
function generateCode(
  schema: Schema, 
  format: 'nosql' | 'sql', 
  useSmartDefaults?: boolean
): GeneratedCode
```

**Parameters:**
- `schema`: The schema definition
- `format`: Target database format
- `useSmartDefaults`: Enable intelligent validation defaults (optional)

**Returns:** Object containing generated Zod, TypeScript, and model code

**Example:**
```typescript
const schema: Schema = {
  name: "User",
  fields: [
    {
      name: "email",
      type: "string",
      required: true,
      unique: true
    }
  ]
};

const code = generateCode(schema, 'nosql', true);
console.log(code.typescript); // Generated TypeScript interface
```

### parseJsonSchema

Parses and validates a JSON schema string.

```typescript
function parseJsonSchema(jsonString: string): Schema
```

**Parameters:**
- `jsonString`: JSON representation of the schema

**Returns:** Validated Schema object

**Throws:** Error if JSON is invalid or schema format is incorrect

**Example:**
```typescript
const jsonSchema = `{
  "name": "User",
  "fields": [
    {
      "name": "email",
      "type": "string",
      "required": true
    }
  ]
}`;

try {
  const schema = parseJsonSchema(jsonSchema);
  console.log(schema.name); // "User"
} catch (error) {
  console.error('Invalid schema:', error.message);
}
```

### parseTypeScriptInterface

Parses TypeScript interface code into a schema.

```typescript
function parseTypeScriptInterface(tsString: string): Schema
```

**Parameters:**
- `tsString`: TypeScript interface code

**Returns:** Schema object derived from the interface

**Example:**
```typescript
const tsInterface = `
interface User {
  email: string;
  age?: number;
}`;

const schema = parseTypeScriptInterface(tsInterface);
// Returns schema with email (required) and age (optional) fields
```

### parseMongooseModel

Parses Mongoose model code into a schema.

```typescript
function parseMongooseModel(modelString: string): Schema
```

**Parameters:**
- `modelString`: Mongoose schema definition code

**Returns:** Schema object derived from the Mongoose model

## Code Generation Functions

### generateZodSchema

Generates Zod validation schema code.

```typescript
function generateZodSchema(schema: Schema, useSmartDefaults?: boolean): string
```

**Parameters:**
- `schema`: Schema definition
- `useSmartDefaults`: Enable smart validation defaults

**Returns:** Zod schema code as string

### generateTypeScriptInterface

Generates TypeScript interface code.

```typescript
function generateTypeScriptInterface(schema: Schema): string
```

**Parameters:**
- `schema`: Schema definition

**Returns:** TypeScript interface code as string

### generateMongooseModel

Generates Mongoose model code.

```typescript
function generateMongooseModel(schema: Schema): string
```

**Parameters:**
- `schema`: Schema definition

**Returns:** Mongoose model code as string

### generateSQLModel

Generates SQL DDL statements.

```typescript
function generateSQLModel(schema: Schema): string
```

**Parameters:**
- `schema`: Schema definition

**Returns:** SQL CREATE TABLE and related statements

## Component APIs

### FormBuilder Component

```typescript
interface FormBuilderProps {
  onSchemaChange: (schema: Schema | null) => void;
  format: "nosql" | "sql";
  onFormatChange: (format: "nosql" | "sql") => void;
}
```

**Props:**
- `onSchemaChange`: Callback when schema is modified
- `format`: Current database format
- `onFormatChange`: Callback when format changes

### SchemaInput Component

```typescript
interface SchemaInputProps {
  onSchemaChange: (schema: Schema | null) => void;
  format: "nosql" | "sql";
  onFormatChange: (format: "nosql" | "sql") => void;
  useSmartDefaults: boolean;
  onSmartDefaultsChange: (enabled: boolean) => void;
}
```

**Props:**
- `onSchemaChange`: Callback when schema is modified
- `format`: Current database format
- `onFormatChange`: Callback when format changes
- `useSmartDefaults`: Smart defaults toggle state
- `onSmartDefaultsChange`: Callback when smart defaults toggle changes

### SchemaOutput Component

```typescript
interface SchemaOutputProps {
  generatedCode: GeneratedCode | null;
}
```

**Props:**
- `generatedCode`: Generated code object to display

## Utility Functions

### Field Validation

```typescript
function validateFieldName(name: string): boolean
```

Validates that a field name is a valid JavaScript identifier.

```typescript
function validateFieldType(type: string): boolean
```

Validates that a field type is supported.

### Type Mapping

```typescript
function mapTypeScriptType(tsType: string): Field['type']
```

Maps TypeScript types to schema field types.

```typescript
function generateTypeScriptFieldType(field: Field): string
```

Generates TypeScript type string for a field.

## Error Handling

### Common Errors

**Schema Validation Errors:**
```typescript
// Invalid schema name
throw new Error('Schema must have a valid name');

// Invalid field array
throw new Error('Schema must have a fields array');

// Invalid field type
throw new Error(`Field '${fieldName}' has invalid type`);
```

**JSON Parsing Errors:**
```typescript
// Syntax errors
throw new Error('Invalid JSON format');

// Missing required properties
throw new Error('Field must have a valid name');
```

**TypeScript Parsing Errors:**
```typescript
// No interface found
throw new Error('No interface found in TypeScript code');

// Invalid format
throw new Error('Invalid interface format');
```

### Error Handling Patterns

```typescript
// Validation with error handling
function safeParseSchema(input: string): { success: boolean; data?: Schema; error?: string } {
  try {
    const schema = parseJsonSchema(input);
    return { success: true, data: schema };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Code generation with error handling
function safeGenerateCode(schema: Schema): { success: boolean; code?: GeneratedCode; error?: string } {
  try {
    const code = generateCode(schema, 'nosql');
    return { success: true, code };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

## Constants and Enums

### Field Types

```typescript
const FIELD_TYPES = [
  'string',
  'number', 
  'boolean',
  'date',
  'array',
  'object'
] as const;

type FieldType = typeof FIELD_TYPES[number];
```

### Database Formats

```typescript
const DATABASE_FORMATS = ['nosql', 'sql'] as const;
type DatabaseFormat = typeof DATABASE_FORMATS[number];
```

### Validation Patterns

```typescript
const VALIDATION_PATTERNS = {
  EMAIL: '^[^@]+@[^@]+\\.[^@]+$',
  PHONE: '^\\+?[1-9]\\d{1,14}$',
  URL: '^https?:\\/\\/.+',
  ALPHANUMERIC: '^[a-zA-Z0-9]+$'
} as const;
```

## Usage Examples

### Custom Schema Builder

```typescript
import { Schema, Field, generateCode } from '@/lib/schemaBuilder';

class CustomSchemaBuilder {
  private schema: Schema;

  constructor(name: string) {
    this.schema = { name, fields: [] };
  }

  addField(field: Field): this {
    this.schema.fields.push(field);
    return this;
  }

  addStringField(name: string, required = true, validation?: ValidationOptions): this {
    return this.addField({
      name,
      type: 'string',
      required,
      validation
    });
  }

  addNumberField(name: string, required = true, min?: number, max?: number): this {
    return this.addField({
      name,
      type: 'number',
      required,
      validation: { min, max }
    });
  }

  generate(format: 'nosql' | 'sql' = 'nosql') {
    return generateCode(this.schema, format);
  }
}

// Usage
const userSchema = new CustomSchemaBuilder('User')
  .addStringField('email', true, { regex: VALIDATION_PATTERNS.EMAIL })
  .addStringField('firstName', true, { min: 1, max: 50 })
  .addNumberField('age', false, 0, 120)
  .generate('nosql');
```

### Schema Validation Middleware

```typescript
import { parseJsonSchema } from '@/lib/schemaParser';

export function validateSchemaMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const schema = parseJsonSchema(req.body.schema);
    req.validatedSchema = schema;
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
```

### Dynamic Code Generation

```typescript
import { generateCode } from '@/lib/codeGenerators';

export async function generateSchemaCode(req: Request, res: Response) {
  try {
    const { schema, format, useSmartDefaults } = req.body;
    
    const generatedCode = generateCode(schema, format, useSmartDefaults);
    
    res.json({
      success: true,
      code: generatedCode
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
```