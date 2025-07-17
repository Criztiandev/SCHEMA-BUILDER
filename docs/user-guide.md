# User Guide

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

### Advanced Field Options

#### Validation Settings

Click the settings icon (⚙️) next to any field to access validation options:

**For String Fields:**
- **Min Length**: Minimum number of characters
- **Max Length**: Maximum number of characters
- **Regex Pattern**: Regular expression for format validation
- **Default Value**: Default text if not provided

**For Number Fields:**
- **Min Value**: Minimum allowed number
- **Max Value**: Maximum allowed number
- **Default Value**: Default number if not provided

**For All Fields:**
- **Default Value**: Value used when field is not provided

#### Working with Arrays

When you select "Array" as the field type:

1. **Choose Array Type**: Select what type of items the array contains
2. **Configure Item Validation**: Set validation rules for array items
3. **Set Array Constraints**: Define min/max array length if needed

#### Working with Objects

Object fields allow nested data structures:

1. **Expand Object**: Click the expand arrow to show object fields
2. **Add Object Fields**: Click "Add" to add fields within the object
3. **Configure Sub-fields**: Each object field has its own type and validation
4. **Nested Structure**: Objects can contain other objects for complex data

### Field Management

- **Reorder Fields**: Drag fields to reorder them
- **Delete Fields**: Click the trash icon to remove fields
- **Expand/Collapse**: Use arrows to show/hide field details

## Using the JSON Editor

The JSON Editor provides a code-based approach for defining schemas.

### JSON Schema Format

```json
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
```

### Field Definition

Each field object must include:

- **name**: String identifier for the field
- **type**: One of: "string", "number", "boolean", "date", "array", "object"
- **required**: Boolean indicating if field is mandatory
- **unique**: Boolean indicating if field must be unique (optional)
- **validation**: Object containing validation rules (optional)

### Array Fields

```json
{
  "name": "tags",
  "type": "array",
  "arrayType": "string",
  "required": false,
  "validation": {
    "min": 1,
    "max": 10
  }
}
```

### Object Fields

```json
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
```

## Format Selection

### NoSQL vs SQL

The format selection affects the generated database model:

**NoSQL (MongoDB/Mongoose)**
- Generates Mongoose schema definitions
- Supports nested objects and arrays naturally
- Flexible document structure
- Includes timestamps and middleware

**SQL (PostgreSQL/MySQL)**
- Generates SQL CREATE TABLE statements
- Normalizes complex data to JSONB columns
- Includes indexes and constraints
- Adds created_at/updated_at columns

### Smart Defaults

When enabled, Smart Defaults adds intelligent validation:

- **String fields**: Automatic min length of 1 for required fields
- **Helpful error messages**: User-friendly validation messages
- **Sensible limits**: Default max lengths to prevent abuse

## Generated Code

### TypeScript Interface

Provides type safety for your application:

```typescript
export interface User {
  /** @unique */
  email: string;
  firstName: string;
  age?: number;
  isActive: boolean;
}
```

### Zod Schema

Runtime validation for forms and APIs:

```typescript
export const UserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  age: z.number().min(0).max(120).optional(),
  isActive: z.boolean()
});
```

### Database Model

**Mongoose (NoSQL):**
```typescript
const UserSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  age: { type: Number, min: 0, max: 120 },
  isActive: { type: Boolean, required: true }
});
```

**SQL:**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(255) NOT NULL,
  age INTEGER CHECK (age >= 0 AND age <= 120),
  is_active BOOLEAN NOT NULL
);
```

## Best Practices

### Schema Design

1. **Use Descriptive Names**: Choose clear, meaningful field names
2. **Consider Relationships**: Plan how schemas relate to each other
3. **Validate Appropriately**: Don't over-validate, but ensure data quality
4. **Plan for Growth**: Consider future requirements

### Field Naming

- Use camelCase for consistency
- Be descriptive but concise
- Avoid abbreviations when possible
- Use consistent naming patterns

### Validation Rules

- Set reasonable min/max values
- Use regex patterns for format validation
- Provide default values where appropriate
- Consider user experience in error messages

### Performance Considerations

- Index frequently queried fields (use unique flag)
- Avoid deeply nested objects in SQL schemas
- Consider array size limits
- Plan for data growth

## Tips and Tricks

### Keyboard Shortcuts

- **Tab**: Navigate between fields in Form Builder
- **Ctrl/Cmd + S**: Save (triggers code regeneration)
- **Ctrl/Cmd + Z**: Undo in JSON Editor

### Quick Actions

- **Copy Generated Code**: Click the copy button in output panels
- **Switch Formats**: Toggle between NoSQL and SQL to compare outputs
- **Reset Schema**: Clear all fields to start over

### Common Patterns

**User Schema:**
- email (string, required, unique)
- password (string, required, min length)
- firstName, lastName (string, required)
- createdAt, updatedAt (date, auto-generated)

**Product Schema:**
- name (string, required)
- description (string, optional)
- price (number, required, min 0)
- inStock (boolean, default true)
- categories (array of strings)

**Order Schema:**
- userId (string, required)
- items (array of objects)
- total (number, required)
- status (string, with enum validation)

## Troubleshooting

### Common Issues

**Schema Not Generating:**
- Ensure schema name is provided
- Check that at least one field exists
- Verify all required field properties are set

**Validation Errors:**
- Check field names are valid identifiers
- Ensure types are correctly specified
- Verify validation rules are reasonable

**JSON Syntax Errors:**
- Use proper JSON formatting
- Check for missing commas or brackets
- Validate JSON structure

### Getting Help

If you encounter issues:
1. Check the browser console for errors
2. Verify your schema follows the correct format
3. Try the examples provided in documentation
4. Reset and start with a simple schema