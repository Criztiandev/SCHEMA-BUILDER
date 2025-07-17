# Schema Format Reference

This document provides a comprehensive reference for the schema format used in Schema Builder.

## Schema Structure

A schema consists of a name and an array of field definitions:

```json
{
  "name": "SchemaName",
  "fields": [
    // Field definitions
  ]
}
```

### Schema Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | Yes | The name of the schema (used for generated types and models) |
| `fields` | Field[] | Yes | Array of field definitions |

## Field Definition

Each field in the schema has the following structure:

```json
{
  "name": "fieldName",
  "type": "string",
  "required": true,
  "unique": false,
  "validation": {
    // Validation options
  }
}
```

### Field Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | Yes | Field identifier (must be valid JavaScript identifier) |
| `type` | FieldType | Yes | Data type of the field |
| `required` | boolean | Yes | Whether the field is mandatory |
| `unique` | boolean | No | Whether the field must be unique (default: false) |
| `validation` | ValidationOptions | No | Additional validation rules |
| `arrayType` | FieldType | No | Type of array elements (required when type is "array") |
| `objectFields` | Field[] | No | Nested fields (required when type is "object") |

## Field Types

### Primitive Types

#### String
```json
{
  "name": "email",
  "type": "string",
  "required": true,
  "unique": true,
  "validation": {
    "min": 5,
    "max": 100,
    "regex": "^[^@]+@[^@]+\\.[^@]+$",
    "default": ""
  }
}
```

**Use Cases:**
- Names, emails, descriptions
- Text content, URLs
- Identifiers, codes

**Validation Options:**
- `min`: Minimum string length
- `max`: Maximum string length
- `regex`: Regular expression pattern
- `default`: Default value

#### Number
```json
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
```

**Use Cases:**
- Ages, quantities, prices
- Scores, ratings, percentages
- Measurements, coordinates

**Validation Options:**
- `min`: Minimum numeric value
- `max`: Maximum numeric value
- `default`: Default value

#### Boolean
```json
{
  "name": "isActive",
  "type": "boolean",
  "required": true,
  "validation": {
    "default": true
  }
}
```

**Use Cases:**
- Flags, toggles, preferences
- Status indicators
- Permission settings

**Validation Options:**
- `default`: Default value (true/false)

#### Date
```json
{
  "name": "birthDate",
  "type": "date",
  "required": false,
  "validation": {
    "default": "2000-01-01"
  }
}
```

**Use Cases:**
- Timestamps, birthdays
- Deadlines, schedules
- Creation/modification dates

**Validation Options:**
- `default`: Default date value

### Complex Types

#### Array
```json
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
```

**Array Types:**
- `"string"`: Array of strings
- `"number"`: Array of numbers
- `"boolean"`: Array of booleans
- `"date"`: Array of dates
- `"object"`: Array of objects

**Use Cases:**
- Tags, categories, labels
- Lists of items, collections
- Multiple selections

**Validation Options:**
- `min`: Minimum array length
- `max`: Maximum array length
- `default`: Default array value

#### Object
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
    },
    {
      "name": "zipCode",
      "type": "string",
      "required": false,
      "validation": {
        "regex": "^\\d{5}(-\\d{4})?$"
      }
    }
  ]
}
```

**Use Cases:**
- Addresses, contact information
- Nested configurations
- Complex data structures

**Object Fields:**
- Each object field follows the same Field definition format
- Nested objects are supported
- Object fields can be any primitive type

## Validation Options

### String Validation

```json
{
  "validation": {
    "min": 1,           // Minimum length
    "max": 255,         // Maximum length
    "regex": "^[a-zA-Z]+$",  // Pattern matching
    "default": "N/A"    // Default value
  }
}
```

**Common Regex Patterns:**
- Email: `^[^@]+@[^@]+\\.[^@]+$`
- Phone: `^\\+?[1-9]\\d{1,14}$`
- URL: `^https?:\\/\\/.+`
- Alphanumeric: `^[a-zA-Z0-9]+$`

### Number Validation

```json
{
  "validation": {
    "min": 0,           // Minimum value
    "max": 100,         // Maximum value
    "default": 50       // Default value
  }
}
```

### Array Validation

```json
{
  "validation": {
    "min": 1,           // Minimum array length
    "max": 10,          // Maximum array length
    "default": []       // Default array
  }
}
```

## Complete Examples

### User Schema
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
      "name": "age",
      "type": "number",
      "required": false,
      "validation": {
        "min": 13,
        "max": 120
      }
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
      "name": "tags",
      "type": "array",
      "arrayType": "string",
      "required": false,
      "validation": {
        "max": 10
      }
    },
    {
      "name": "profile",
      "type": "object",
      "required": false,
      "objectFields": [
        {
          "name": "bio",
          "type": "string",
          "required": false,
          "validation": {
            "max": 500
          }
        },
        {
          "name": "website",
          "type": "string",
          "required": false,
          "validation": {
            "regex": "^https?:\\/\\/.+"
          }
        }
      ]
    }
  ]
}
```

### Product Schema
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
        "max": 1000
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
          "name": "dimensions",
          "type": "string",
          "required": false
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
```

## Validation Rules

### Field Names
- Must be valid JavaScript identifiers
- Cannot start with numbers
- Cannot contain spaces or special characters (except underscore)
- Should use camelCase convention

### Type Constraints
- Array fields must specify `arrayType`
- Object fields must include `objectFields` array
- Validation options must match field type

### Best Practices
- Use descriptive field names
- Set reasonable validation limits
- Provide default values where appropriate
- Consider database constraints when setting unique flags
- Use regex patterns for format validation
- Keep object nesting reasonable for performance