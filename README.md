# Schema Builder

A powerful, modern web application for creating and managing database schemas with automatic code generation. Build schemas visually or through JSON, and instantly generate TypeScript interfaces, Zod validation schemas, and database models.

## Features

- **Visual Schema Builder**: Intuitive drag-and-drop interface for creating database schemas
- **JSON Editor**: Monaco-powered code editor for direct schema definition
- **Multi-Format Support**: Generate code for both NoSQL (MongoDB/Mongoose) and SQL databases
- **Type Safety**: Automatic TypeScript interface generation with proper typing
- **Validation**: Zod schema generation with smart defaults and custom validation rules
- **Real-time Preview**: Instant code generation as you build your schema
- **Field Types**: Support for strings, numbers, booleans, dates, arrays, and nested objects
- **Advanced Validation**: Min/max values, regex patterns, unique constraints, and default values
- **Modern UI**: Built with Tailwind CSS and Radix UI components

## Tech Stack

- **Framework**: Next.js 13.5.1 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Code Editor**: Monaco Editor
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd schema-builder
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Production Build

```bash
npm run build
npm start
```

## Usage

### Visual Form Builder

1. Click the "Form Builder" tab
2. Enter a schema name (e.g., "User", "Product")
3. Add fields using the "Add Field" button
4. Configure each field:
   - **Name**: Field identifier
   - **Type**: string, number, boolean, date, array, or object
   - **Required**: Whether the field is mandatory
   - **Unique**: Whether the field must be unique
   - **Validation**: Min/max values, regex patterns, default values

### JSON Editor

1. Click the "Code Editor" tab
2. Write your schema in JSON format:
```json
{
  "name": "User",
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
      "name": "age",
      "type": "number",
      "required": false,
      "validation": {
        "min": 0,
        "max": 120
      }
    }
  ]
}
```

### Generated Code

The application automatically generates:

- **Zod Schema**: For runtime validation
- **TypeScript Interface**: For type safety
- **Database Model**: MongoDB/Mongoose or SQL schema

## Schema Format

### Field Types

- `string`: Text data with optional regex validation
- `number`: Numeric data with min/max constraints
- `boolean`: True/false values
- `date`: Date/timestamp fields
- `array`: Arrays with typed elements
- `object`: Nested object structures

### Validation Options

- `min`: Minimum value/length
- `max`: Maximum value/length  
- `regex`: Regular expression pattern (strings only)
- `default`: Default value
- `required`: Whether field is mandatory
- `unique`: Whether field must be unique

## API Reference

### Core Types

```typescript
interface Schema {
  name: string;
  fields: Field[];
}

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

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue on GitHub.