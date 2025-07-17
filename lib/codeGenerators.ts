import { Schema, Field, GeneratedCode, ValidationOptions } from '@/app/page';

export function generateCode(schema: Schema, format: 'nosql' | 'sql', useSmartDefaults: boolean = false): GeneratedCode {
  return {
    zod: generateZodSchema(schema, useSmartDefaults),
    typescript: generateTypeScriptInterface(schema),
    model: format === 'nosql' ? generateMongooseModel(schema) : generateSQLModel(schema)
  };
}

function generateZodSchema(schema: Schema, useSmartDefaults: boolean = false): string {
  const imports = "import { z } from 'zod';\n\n";
  
  const fieldSchemas = schema.fields.map(field => {
    const fieldSchema = generateZodFieldSchema(field, useSmartDefaults);
    return `  ${field.name}: ${fieldSchema}`;
  });
  
  const schemaDefinition = `export const ${schema.name}Schema = z.object({
${fieldSchemas.join(',\n')}
});

export type ${schema.name} = z.infer<typeof ${schema.name}Schema>;`;
  
  return imports + schemaDefinition;
}

function generateZodFieldSchema(field: Field, useSmartDefaults: boolean = false): string {
  let baseSchema = '';
  
  switch (field.type) {
    case 'string':
      baseSchema = 'z.string()';
      break;
    case 'number':
      baseSchema = 'z.number()';
      break;
    case 'boolean':
      baseSchema = 'z.boolean()';
      break;
    case 'date':
      baseSchema = 'z.date()';
      break;
    case 'array':
      const arrayType = field.arrayType || 'string';
      const arrayItemSchema = generateZodFieldSchema({ 
        name: '', 
        type: arrayType as Field['type'], 
        required: true,
        validation: {}
      }, useSmartDefaults);
      baseSchema = `z.array(${arrayItemSchema})`;
      break;
    case 'object':
      if (field.objectFields && field.objectFields.length > 0) {
        const objectFields = field.objectFields.map(objField => {
          const objSchema = generateZodFieldSchema(objField, useSmartDefaults);
          return `    ${objField.name}: ${objSchema}`;
        });
        baseSchema = `z.object({
${objectFields.join(',\n')}
  })`;
      } else {
        baseSchema = 'z.object({})';
      }
      break;
  }
  
  // Apply validation options
  if (field.validation) {
    if (field.type === 'string') {
      // Apply smart defaults for string validation
      if (useSmartDefaults && field.required && !field.validation.min && !field.validation.max) {
        baseSchema += `.min(1, "${field.name} is required").max(155, "${field.name} is too long")`;
      } else {
        if (field.validation.min !== undefined) {
          const message = useSmartDefaults ? `, "${field.name} is required"` : '';
          baseSchema += `.min(${field.validation.min}${message})`;
        }
        if (field.validation.max !== undefined) {
          const message = useSmartDefaults ? `, "${field.name} is too long"` : '';
          baseSchema += `.max(${field.validation.max}${message})`;
        }
      }
      if (field.validation.regex) {
        baseSchema += `.regex(/${field.validation.regex}/)`;
      }
    } else {
      // For non-string types, apply validation normally
      if (field.validation.min !== undefined) {
        baseSchema += `.min(${field.validation.min})`;
      }
      if (field.validation.max !== undefined) {
        baseSchema += `.max(${field.validation.max})`;
      }
    }
    
    if (field.validation.default !== undefined) {
      const defaultValue = field.type === 'string' ? `"${field.validation.default}"` : field.validation.default;
      baseSchema += `.default(${defaultValue})`;
    }
  }
  
  return field.required ? baseSchema : `${baseSchema}.optional()`;
}

function generateTypeScriptInterface(schema: Schema): string {
  const fieldTypes = schema.fields.map(field => {
    const fieldType = generateTypeScriptFieldType(field);
    const optional = field.required ? '' : '?';
    const comment = generateFieldComment(field);
    return `${comment}  ${field.name}${optional}: ${fieldType};`;
  });
  
  return `export interface ${schema.name} {
${fieldTypes.join('\n')}
}`;
}

function generateFieldComment(field: Field): string {
  const comments: string[] = [];
  
  if (field.unique) comments.push('@unique');
  if (field.validation?.min !== undefined) {
    comments.push(`@min ${field.validation.min}`);
  }
  if (field.validation?.max !== undefined) {
    comments.push(`@max ${field.validation.max}`);
  }
  if (field.validation?.regex) {
    comments.push(`@pattern ${field.validation.regex}`);
  }
  if (field.validation?.default !== undefined) {
    comments.push(`@default ${field.validation.default}`);
  }
  
  return comments.length > 0 ? `  /** ${comments.join(' ')} */\n` : '';
}

function generateTypeScriptFieldType(field: Field): string {
  switch (field.type) {
    case 'string':
      return 'string';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'date':
      return 'Date';
    case 'array':
      const arrayType = field.arrayType || 'string';
      const arrayItemType = generateTypeScriptFieldType({ 
        name: '', 
        type: arrayType as Field['type'], 
        required: true,
        validation: {}
      });
      return `${arrayItemType}[]`;
    case 'object':
      if (field.objectFields && field.objectFields.length > 0) {
        const objectFields = field.objectFields.map(objField => {
          const objType = generateTypeScriptFieldType(objField);
          const optional = objField.required ? '' : '?';
          return `    ${objField.name}${optional}: ${objType};`;
        });
        return `{
${objectFields.join('\n')}
  }`;
      } else {
        return 'Record<string, any>';
      }
    default:
      return 'any';
  }
}

function generateMongooseModel(schema: Schema): string {
  const imports = `import { Schema, model, Document } from 'mongoose';

`;
  
  const interfaceDefinition = `export interface ${schema.name}Document extends Document {
${schema.fields.map(field => {
  const fieldType = generateMongooseFieldType(field);
  const optional = field.required ? '' : '?';
  return `  ${field.name}${optional}: ${fieldType};`;
}).join('\n')}
}

`;
  
  const schemaFields = schema.fields.map(field => {
    const fieldDefinition = generateMongooseFieldDefinition(field);
    return `  ${field.name}: ${fieldDefinition}`;
  });
  
  const schemaDefinition = `const ${schema.name}Schema = new Schema<${schema.name}Document>({
${schemaFields.join(',\n')}
}, {
  timestamps: true
});

export const ${schema.name} = model<${schema.name}Document>('${schema.name}', ${schema.name}Schema);`;
  
  return imports + interfaceDefinition + schemaDefinition;
}

function generateMongooseFieldType(field: Field): string {
  switch (field.type) {
    case 'string':
      return 'string';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'date':
      return 'Date';
    case 'array':
      const arrayType = field.arrayType || 'string';
      const arrayItemType = generateMongooseFieldType({ 
        name: '', 
        type: arrayType as Field['type'], 
        required: true,
        validation: {}
      });
      return `${arrayItemType}[]`;
    case 'object':
      if (field.objectFields && field.objectFields.length > 0) {
        const objectFields = field.objectFields.map(objField => {
          const objType = generateMongooseFieldType(objField);
          const optional = objField.required ? '' : '?';
          return `    ${objField.name}${optional}: ${objType};`;
        });
        return `{
${objectFields.join('\n')}
  }`;
      } else {
        return 'Record<string, any>';
      }
    default:
      return 'any';
  }
}

function generateMongooseFieldDefinition(field: Field): string {
  let baseDefinition = '';
  
  switch (field.type) {
    case 'string':
      baseDefinition = '{ type: String';
      break;
    case 'number':
      baseDefinition = '{ type: Number';
      break;
    case 'boolean':
      baseDefinition = '{ type: Boolean';
      break;
    case 'date':
      baseDefinition = '{ type: Date';
      break;
    case 'array':
      const arrayType = field.arrayType || 'string';
      const arrayItemDefinition = generateMongooseFieldDefinition({ 
        name: '', 
        type: arrayType as Field['type'], 
        required: true,
        validation: {}
      });
      return `[${arrayItemDefinition}]`;
    case 'object':
      if (field.objectFields && field.objectFields.length > 0) {
        const objectFields = field.objectFields.map(objField => {
          const objDefinition = generateMongooseFieldDefinition(objField);
          return `    ${objField.name}: ${objDefinition}`;
        });
        return `{
${objectFields.join(',\n')}
  }`;
      } else {
        baseDefinition = '{ type: Schema.Types.Mixed';
      }
      break;
  }
  
  const options: string[] = [];
  
  if (field.required) options.push('required: true');
  if (field.unique) options.push('unique: true');
  
  if (field.validation) {
    if (field.validation.min !== undefined) {
      const minKey = field.type === 'string' ? 'minlength' : 'min';
      options.push(`${minKey}: ${field.validation.min}`);
    }
    if (field.validation.max !== undefined) {
      const maxKey = field.type === 'string' ? 'maxlength' : 'max';
      options.push(`${maxKey}: ${field.validation.max}`);
    }
    if (field.validation.default !== undefined) {
      const defaultValue = field.type === 'string' ? `'${field.validation.default}'` : field.validation.default;
      options.push(`default: ${defaultValue}`);
    }
  }
  
  const optionsString = options.length > 0 ? `, ${options.join(', ')}` : '';
  return `${baseDefinition}${optionsString} }`;
}

function generateSQLModel(schema: Schema): string {
  const tableName = schema.name.toLowerCase() + 's';
  
  const createTable = `-- Create ${schema.name} table
CREATE TABLE ${tableName} (
  id SERIAL PRIMARY KEY,
${schema.fields.map(field => {
  const fieldDefinition = generateSQLFieldDefinition(field);
  return `  ${field.name} ${fieldDefinition}`;
}).join(',\n')},
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for unique fields
${schema.fields
  .filter(field => field.unique)
  .map(field => `CREATE UNIQUE INDEX idx_${tableName}_${field.name} ON ${tableName}(${field.name});`)
  .join('\n')}

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_${tableName}_updated_at
  BEFORE UPDATE ON ${tableName}
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();`;
  
  return createTable;
}

function generateSQLFieldDefinition(field: Field): string {
  let baseType = '';
  
  switch (field.type) {
    case 'string':
      if (field.validation?.max) {
        baseType = `VARCHAR(${field.validation.max})`;
      } else {
        baseType = 'VARCHAR(255)';
      }
      break;
    case 'number':
      baseType = 'DECIMAL(10,2)';
      break;
    case 'boolean':
      baseType = 'BOOLEAN';
      break;
    case 'date':
      baseType = 'TIMESTAMP';
      break;
    case 'array':
      baseType = 'JSONB';
      break;
    case 'object':
      baseType = 'JSONB';
      break;
    default:
      baseType = 'TEXT';
  }
  
  const constraints: string[] = [];
  
  if (field.required) constraints.push('NOT NULL');
  if (field.unique) constraints.push('UNIQUE');
  
  if (field.validation?.default !== undefined) {
    const defaultValue = field.type === 'string' ? `'${field.validation.default}'` : field.validation.default;
    constraints.push(`DEFAULT ${defaultValue}`);
  }
  
  if (field.type === 'number' && field.validation) {
    if (field.validation.min !== undefined) {
      constraints.push(`CHECK (${field.name} >= ${field.validation.min})`);
    }
    if (field.validation.max !== undefined) {
      constraints.push(`CHECK (${field.name} <= ${field.validation.max})`);
    }
  }
  
  return `${baseType}${constraints.length > 0 ? ' ' + constraints.join(' ') : ''}`;
}