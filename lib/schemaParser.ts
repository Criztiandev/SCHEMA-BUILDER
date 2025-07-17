import { Schema, Field, ValidationOptions } from '@/app/page';

export function parseJsonSchema(jsonString: string): Schema {
  try {
    const parsed = JSON.parse(jsonString);
    
    if (!parsed.name || typeof parsed.name !== 'string') {
      throw new Error('Schema must have a valid name');
    }
    
    if (!parsed.fields || !Array.isArray(parsed.fields)) {
      throw new Error('Schema must have a fields array');
    }
    
    const validatedFields: Field[] = parsed.fields.map((field: any, index: number) => {
      if (!field.name || typeof field.name !== 'string') {
        throw new Error(`Field at index ${index} must have a valid name`);
      }
      
      const validTypes = ['string', 'number', 'boolean', 'date', 'array', 'object'];
      if (!validTypes.includes(field.type)) {
        throw new Error(`Field '${field.name}' has invalid type. Must be one of: ${validTypes.join(', ')}`);
      }
      
      const validatedField: Field = {
        name: field.name,
        type: field.type,
        required: field.required === true,
        unique: field.unique === true,
        validation: field.validation || {}
      };
      
      if (field.type === 'array') {
        const validArrayTypes = ['string', 'number', 'boolean', 'date', 'object'];
        if (!field.arrayType || !validArrayTypes.includes(field.arrayType)) {
          throw new Error(`Array field '${field.name}' must have a valid arrayType`);
        }
        validatedField.arrayType = field.arrayType;
      }
      
      if (field.type === 'object') {
        if (field.objectFields && Array.isArray(field.objectFields)) {
          validatedField.objectFields = field.objectFields.map((objField: any, objIndex: number) => {
            if (!objField.name || typeof objField.name !== 'string') {
              throw new Error(`Object field at index ${objIndex} in '${field.name}' must have a valid name`);
            }
            
            const validObjectTypes = ['string', 'number', 'boolean', 'date'];
            if (!validObjectTypes.includes(objField.type)) {
              throw new Error(`Object field '${objField.name}' has invalid type. Must be one of: ${validObjectTypes.join(', ')}`);
            }
            
            return {
              name: objField.name,
              type: objField.type,
              required: objField.required === true,
              unique: objField.unique === true,
              validation: objField.validation || {}
            };
          });
        }
      }
      
      return validatedField;
    });
    
    return {
      name: parsed.name,
      fields: validatedFields
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON format');
    }
    throw error;
  }
}

export function parseTypeScriptInterface(tsString: string): Schema {
  try {
    // Clean up the input - remove extra whitespace and normalize
    const cleanInput = tsString.trim();
    
    if (!cleanInput) {
      throw new Error('Empty input');
    }
    
    // Extract interface name
    const interfaceMatch = cleanInput.match(/interface\s+(\w+)/);
    if (!interfaceMatch) {
      throw new Error('No interface found in TypeScript code');
    }
    
    const name = interfaceMatch[1];
    
    // Extract fields from interface body
    const bodyMatch = cleanInput.match(/interface\s+\w+\s*\{([^}]*)\}/s);
    if (!bodyMatch) {
      throw new Error('Invalid interface format');
    }
    
    const body = bodyMatch[1];
    
    if (!body.trim()) {
      return { name, fields: [] };
    }
    
    const fieldLines = body.split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('//') && !line.startsWith('*'));
    
    const fields: Field[] = [];
    
    for (const line of fieldLines) {
      if (!line.includes(':')) continue;
      
      // Handle lines that might have semicolons
      const cleanLine = line.replace(/;$/, '');
      const colonIndex = cleanLine.indexOf(':');
      
      if (colonIndex === -1) continue;
      
      const fieldPart = cleanLine.substring(0, colonIndex).trim();
      const typePart = cleanLine.substring(colonIndex + 1).trim();
      
      if (!fieldPart || !typePart) continue;
      
      const isOptional = fieldPart.includes('?');
      const fieldName = fieldPart.replace('?', '').trim();
      const typeString = typePart.trim();
      
      if (!fieldName) continue;
      
      const field: Field = {
        name: fieldName,
        type: mapTypeScriptType(typeString),
        required: !isOptional,
        unique: false,
        validation: {}
      };
      
      if (typeString.includes('[]')) {
        field.type = 'array';
        const baseType = typeString.replace('[]', '').trim();
        field.arrayType = mapTypeScriptType(baseType) as Field['arrayType'];
      } else if (typeString.includes('{') && typeString.includes('}')) {
        field.type = 'object';
        // For now, we'll create empty object fields for nested objects
        field.objectFields = [];
      }
      
      fields.push(field);
    }
    
    return { name, fields };
  } catch (error) {
    throw new Error('Invalid TypeScript interface format');
  }
}

export function parseMongooseModel(modelString: string): Schema {
  try {
    // Extract schema name
    const schemaMatch = modelString.match(/(\w+)Schema\s*=\s*new\s+Schema/);
    if (!schemaMatch) {
      throw new Error('No Mongoose schema found');
    }
    
    const name = schemaMatch[1];
    
    // Extract schema definition
    const schemaBodyMatch = modelString.match(/new\s+Schema\s*\(\s*{([^}]+)}/s);
    if (!schemaBodyMatch) {
      throw new Error('Invalid schema format');
    }
    
    const body = schemaBodyMatch[1];
    const fields: Field[] = [];
    
    // Parse field definitions
    const fieldMatches = body.match(/(\w+):\s*({[^}]+}|\[[^\]]+\]|[^,\n]+)/g);
    
    if (fieldMatches) {
      for (const fieldMatch of fieldMatches) {
        const [fieldName, fieldDef] = fieldMatch.split(':').map(s => s.trim());
        
        const field: Field = {
          name: fieldName,
          type: 'string',
          required: fieldDef.includes('required: true'),
          unique: fieldDef.includes('unique: true'),
          validation: {}
        };
        
        // Determine type
        if (fieldDef.includes('String')) field.type = 'string';
        else if (fieldDef.includes('Number')) field.type = 'number';
        else if (fieldDef.includes('Boolean')) field.type = 'boolean';
        else if (fieldDef.includes('Date')) field.type = 'date';
        else if (fieldDef.startsWith('[')) field.type = 'array';
        else if (fieldDef.startsWith('{')) field.type = 'object';
        
        // Extract validation options
        const minMatch = fieldDef.match(/min(?:length)?:\s*(\d+)/);
        const maxMatch = fieldDef.match(/max(?:length)?:\s*(\d+)/);
        const defaultMatch = fieldDef.match(/default:\s*([^,}]+)/);
        
        if (minMatch) field.validation!.min = parseInt(minMatch[1]);
        if (maxMatch) field.validation!.max = parseInt(maxMatch[1]);
        if (defaultMatch) field.validation!.default = defaultMatch[1].trim();
        
        fields.push(field);
      }
    }
    
    return { name, fields };
  } catch (error) {
    throw new Error('Failed to parse Mongoose model: ' + (error as Error).message);
  }
}

function mapTypeScriptType(tsType: string): Field['type'] {
  const cleanType = tsType.toLowerCase().trim();
  
  if (cleanType === 'string') return 'string';
  if (cleanType === 'number') return 'number';
  if (cleanType === 'boolean') return 'boolean';
  if (cleanType === 'date' || cleanType === 'Date') return 'date';
  if (cleanType.includes('{') || cleanType.includes('record')) return 'object';
  
  return 'string'; // default
}