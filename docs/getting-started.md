# Getting Started

This guide will help you set up and run the Schema Builder application on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.0 or higher
- **npm**: Usually comes with Node.js (or yarn as an alternative)
- **Git**: For cloning the repository

### Checking Your Environment

Verify your installations:

```bash
node --version  # Should be 18.0+
npm --version   # Should be 8.0+
git --version   # Any recent version
```

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd schema-builder
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js framework
- React and React DOM
- TypeScript
- Tailwind CSS
- Radix UI components
- Monaco Editor
- Zod validation library

### 3. Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:3000`

### 4. Verify Installation

Open your browser and navigate to `http://localhost:3000`. You should see the Schema Builder interface with:
- A header with format selection (NoSQL/SQL)
- Two tabs: "Code Editor" and "Form Builder"
- An output panel on the right showing generated code

## Development Scripts

The project includes several npm scripts for development:

```bash
# Start development server with hot reload
npm run dev

# Build the application for production
npm run build

# Start production server (after build)
npm start

# Run ESLint for code quality
npm run lint
```

## Project Structure

```
schema-builder/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── FormBuilder.tsx    # Visual schema builder
│   ├── SchemaInput.tsx    # JSON editor component
│   ├── SchemaOutput.tsx   # Code output display
│   ├── layout/           # Layout components
│   └── ui/               # Reusable UI components
├── lib/                   # Utility libraries
│   ├── codeGenerators.ts  # Code generation logic
│   ├── schemaParser.ts    # Schema parsing utilities
│   └── utils.ts          # General utilities
├── docs/                  # Documentation
└── public/               # Static assets
```

## Environment Setup

### Development Environment

The application runs in development mode with:
- Hot module replacement
- TypeScript compilation
- Tailwind CSS processing
- ESLint integration

### IDE Setup

For the best development experience, we recommend:

**VS Code Extensions:**
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter

**Settings:**
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Next Steps

Now that you have the application running:

1. **Explore the Interface**: Try both the Form Builder and JSON Editor
2. **Create a Simple Schema**: Start with a basic user schema
3. **Review Generated Code**: See how your schema translates to code
4. **Read the User Guide**: Learn about advanced features
5. **Check Examples**: See common schema patterns

## Troubleshooting

### Common Issues

**Port Already in Use:**
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use a different port
npm run dev -- -p 3001
```

**Module Not Found Errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript Errors:**
```bash
# Check TypeScript configuration
npx tsc --noEmit
```

### Getting Help

If you encounter issues:
1. Check the [Troubleshooting Guide](./troubleshooting.md)
2. Review the console for error messages
3. Ensure all prerequisites are met
4. Try a fresh installation

## Production Deployment

For production deployment:

```bash
# Build the application
npm run build

# Start production server
npm start
```

The built application will be optimized and ready for deployment to platforms like Vercel, Netlify, or any Node.js hosting service.