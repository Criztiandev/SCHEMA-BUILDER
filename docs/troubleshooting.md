# Troubleshooting Guide

This guide helps you resolve common issues when using Schema Builder.

## Installation Issues

### Node.js Version Compatibility

**Problem:** Application fails to start with Node.js version errors.

**Solution:**
```bash
# Check your Node.js version
node --version

# Should be 18.0 or higher
# If not, update Node.js:
# Using nvm (recommended)
nvm install 18
nvm use 18

# Or download from nodejs.org
```

### Package Installation Failures

**Problem:** `npm install` fails with dependency errors.

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install

# If still failing, try with legacy peer deps
npm install --legacy-peer-deps
```

### Port Already in Use

**Problem:** Development server fails to start on port 3000.

**Solution:**
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001

# Or find and kill the process manually
lsof -ti:3000 | xargs kill -9
```

## Schema Validation Issues

### Invalid JSON Format

**Problem:** JSON editor shows syntax errors.

**Common Issues:**
- Missing commas between objects
- Trailing commas (not allowed in JSON)
- Unescaped quotes in strings
- Missing closing brackets

**Solution:**
```json
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
```

### Schema Name Issues

**Problem:** Schema name validation errors.

**Requirements:**
- Must be a valid JavaScript identifier
- Cannot start with numbers
- Cannot contain spaces or special characters
- Should use PascalCase

**Solution:**
```json
// ❌ Invalid names
{
  "name": "user-schema",  // Contains hyphen
  "name": "2User",        // Starts with number
  "name": "User Schema"   // Contains space
}

// ✅ Valid names
{
  "name": "User",
  "name": "UserProfile",
  "name": "BlogPost"
}
```

### Field Name Issues

**Problem:** Field names causing validation errors.

**Requirements:**
- Must be valid JavaScript identifiers
- Should use camelCase
- Cannot be JavaScript reserved words

**Solution:**
```json
// ❌ Invalid field names
{
  "name": "first-name",   // Contains hyphen
  "name": "class",        // Reserved word
  "name": "2ndName"       // Starts with number
}

// ✅ Valid field names
{
  "name": "firstName",
  "name": "className",
  "name": "secondName"
}
```

### Type Validation Errors

**Problem:** Invalid field types or missing required properties.

**Solution:**
```json
// ❌ Invalid field definition
{
  "name": "tags",
  "type": "array"
  // Missing arrayType for array fields
}

// ✅ Valid field definition
{
  "name": "tags",
  "type": "array",
  "arrayType": "string",
  "required": false
}
```

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

**Solution:**
```typescript
// ❌ Problematic generated code
interface User {
  class: string;  // 'class' is reserved
  function: string;  // 'function' is reserved
}

// ✅ Fix by changing field names
interface User {
  className: string;
  functionName: string;
}
```

### Zod Validation Issues

**Problem:** Generated Zod schema fails validation.

**Common Issues:**
- Regex patterns not properly escaped
- Invalid default values
- Conflicting validation rules

**Solution:**
```json
// ❌ Invalid regex pattern
{
  "validation": {
    "regex": "^[a-zA-Z]+$"  // Not escaped for JSON
  }
}

// ✅ Properly escaped regex
{
  "validation": {
    "regex": "^[a-zA-Z]+$"  // Properly escaped
  }
}
```

## Form Builder Issues

### Fields Not Saving

**Problem:** Changes in Form Builder don't persist or generate code.

**Solution:**
1. Ensure schema name is provided
2. Check that field names are valid
3. Verify all required field properties are set
4. Try switching to JSON editor to see the generated schema

### Validation Options Not Working

**Problem:** Validation settings don't appear in generated code.

**Solution:**
1. Click the settings icon (⚙️) to expand validation options
2. Ensure validation values are properly formatted
3. Check that validation rules match the field type

### Object Fields Not Expanding

**Problem:** Cannot add fields to object types.

**Solution:**
1. Click the expand arrow (▶️) next to object fields
2. Use the "Add" button within the object section
3. Ensure object field names are unique within the object

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

### Copy/Paste Not Working

**Problem:** Cannot copy generated code to clipboard.

**Solution:**
1. Manually select and copy the code
2. Check browser permissions for clipboard access
3. Try using keyboard shortcuts (Ctrl+C / Cmd+C)

## Database-Specific Issues

### MongoDB/Mongoose Issues

**Problem:** Generated Mongoose schema doesn't work as expected.

**Common Issues:**
- Missing required imports
- Invalid schema options
- Incorrect field types

**Solution:**
```typescript
// Ensure proper imports
import { Schema, model, Document } from 'mongoose';

// Check field type mappings
const UserSchema = new Schema({
  // ✅ Correct Mongoose types
  email: { type: String, required: true },
  age: { type: Number },  // Not 'number'
  isActive: { type: Boolean }  // Not 'boolean'
});
```

### SQL Issues

**Problem:** Generated SQL doesn't execute properly.

**Common Issues:**
- Database-specific syntax differences
- Missing table constraints
- Invalid column types

**Solution:**
1. Verify SQL syntax for your specific database (PostgreSQL, MySQL, etc.)
2. Adjust column types as needed for your database
3. Add missing constraints manually if required

## Development Issues

### Hot Reload Not Working

**Problem:** Changes don't reflect automatically during development.

**Solution:**
```bash
# Restart the development server
npm run dev

# Clear Next.js cache
rm -rf .next

# If still not working, try:
npm run dev -- --turbo
```

### Build Failures

**Problem:** Production build fails with errors.

**Solution:**
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Check for ESLint errors
npm run lint

# Clear build cache
rm -rf .next

# Try building again
npm run build
```

### Environment Variables

**Problem:** Application behaves differently in production.

**Solution:**
1. Check that all required environment variables are set
2. Verify environment variable names (case-sensitive)
3. Ensure `.env.local` is not committed to version control

## Getting Help

### Debug Information

When reporting issues, include:

1. **Browser and version**
2. **Node.js version**: `node --version`
3. **npm version**: `npm --version`
4. **Error messages** from browser console
5. **Schema definition** that's causing issues
6. **Steps to reproduce** the problem

### Browser Console

Check the browser console for errors:

1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for red error messages
4. Include these in your bug report

### Network Issues

Check network requests:

1. Open Developer Tools (F12)
2. Go to Network tab
3. Look for failed requests (red status codes)
4. Check if API endpoints are accessible

### Common Error Messages

**"Schema must have a valid name"**
- Ensure schema name is provided and valid

**"Field must have a valid name"**
- Check field names are valid JavaScript identifiers

**"Invalid field type"**
- Verify field type is one of: string, number, boolean, date, array, object

**"Array field must have arrayType"**
- Add arrayType property to array fields

**"Object field must have objectFields"**
- Add objectFields array to object fields

### Still Need Help?

If you're still experiencing issues:

1. Check the [Examples](./examples.md) for similar use cases
2. Review the [API Reference](./api-reference.md) for technical details
3. Search existing GitHub issues
4. Create a new issue with detailed information

### Performance Tips

1. **Limit schema complexity**: Keep schemas under 50 fields
2. **Avoid deep nesting**: Limit object nesting to 5 levels
3. **Use appropriate validation**: Don't over-validate fields
4. **Regular cleanup**: Clear browser cache periodically
5. **Monitor memory**: Close unused browser tabs

### Best Practices for Troubleshooting

1. **Start simple**: Begin with basic schemas and add complexity gradually
2. **Test incrementally**: Add one field at a time to isolate issues
3. **Use browser tools**: Leverage developer tools for debugging
4. **Keep backups**: Save working schemas before making changes
5. **Document issues**: Keep notes on problems and solutions