"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Settings,
} from "lucide-react";
import { Field, Schema, ValidationOptions } from "@/app/page";

interface FormBuilderProps {
  onSchemaChange: (schema: Schema | null) => void;
  format: "nosql" | "sql";
  onFormatChange: (format: "nosql" | "sql") => void;
}

export function FormBuilder({
  onSchemaChange,
  format,
  onFormatChange,
}: FormBuilderProps) {
  const [schemaName, setSchemaName] = useState("");
  const [fields, setFields] = useState<Field[]>([]);
  const [expandedFields, setExpandedFields] = useState<Set<number>>(new Set());
  const [expandedValidation, setExpandedValidation] = useState<Set<number>>(
    new Set()
  );

  const updateSchema = (newFields: Field[], newName: string) => {
    if (newName.trim() && newFields.length > 0) {
      onSchemaChange({
        name: newName,
        fields: newFields,
      });
    } else {
      onSchemaChange(null);
    }
  };

  const addField = () => {
    const newField: Field = {
      name: "",
      type: "string",
      required: true,
      unique: false,
      validation: {},
    };
    const newFields = [...fields, newField];
    setFields(newFields);
    updateSchema(newFields, schemaName);
  };

  const removeField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
    updateSchema(newFields, schemaName);

    // Clean up expanded states
    const newExpandedFields = new Set(expandedFields);
    const newExpandedValidation = new Set(expandedValidation);
    newExpandedFields.delete(index);
    newExpandedValidation.delete(index);
    setExpandedFields(newExpandedFields);
    setExpandedValidation(newExpandedValidation);
  };

  const updateField = (index: number, updates: Partial<Field>) => {
    const newFields = fields.map((field, i) =>
      i === index ? { ...field, ...updates } : field
    );
    setFields(newFields);
    updateSchema(newFields, schemaName);
  };

  const updateValidation = (
    index: number,
    validationUpdates: Partial<ValidationOptions>
  ) => {
    const newFields = fields.map((field, i) =>
      i === index
        ? {
            ...field,
            validation: { ...field.validation, ...validationUpdates },
          }
        : field
    );
    setFields(newFields);
    updateSchema(newFields, schemaName);
  };

  const addObjectField = (parentIndex: number) => {
    const newObjectField: Field = {
      name: "",
      type: "string",
      required: true,
      unique: false,
      validation: {},
    };

    const newFields = fields.map((field, i) => {
      if (i === parentIndex && field.type === "object") {
        return {
          ...field,
          objectFields: [...(field.objectFields || []), newObjectField],
        };
      }
      return field;
    });

    setFields(newFields);
    updateSchema(newFields, schemaName);
  };

  const removeObjectField = (parentIndex: number, objectFieldIndex: number) => {
    const newFields = fields.map((field, i) => {
      if (i === parentIndex && field.type === "object") {
        return {
          ...field,
          objectFields: field.objectFields?.filter(
            (_, j) => j !== objectFieldIndex
          ),
        };
      }
      return field;
    });

    setFields(newFields);
    updateSchema(newFields, schemaName);
  };

  const updateObjectField = (
    parentIndex: number,
    objectFieldIndex: number,
    updates: Partial<Field>
  ) => {
    const newFields = fields.map((field, i) => {
      if (i === parentIndex && field.type === "object") {
        return {
          ...field,
          objectFields: field.objectFields?.map((objField, j) =>
            j === objectFieldIndex ? { ...objField, ...updates } : objField
          ),
        };
      }
      return field;
    });

    setFields(newFields);
    updateSchema(newFields, schemaName);
  };

  const toggleFieldExpansion = (index: number) => {
    const newExpanded = new Set(expandedFields);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedFields(newExpanded);
  };

  const toggleValidationExpansion = (index: number) => {
    const newExpanded = new Set(expandedValidation);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedValidation(newExpanded);
  };

  const handleSchemaNameChange = (name: string) => {
    setSchemaName(name);
    updateSchema(fields, name);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label
          htmlFor="schema-name"
          className="text-sm font-medium text-gray-300"
        >
          Schema Name
        </Label>
        <Input
          id="schema-name"
          placeholder="e.g., User, Product, Order"
          value={schemaName}
          onChange={(e) => handleSchemaNameChange(e.target.value)}
          className="bg-card"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-gray-300">Fields</Label>
          <Button onClick={addField} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Field
          </Button>
        </div>

        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {fields.map((field, index) => (
            <Card
              key={index}
              className="border p-2 mb-0 flex flex-col justify-between"
            >
              <div className="">
                {/* Main field configuration */}
                <div className="flex gap-4 items-center justify-between">
                  <div className="">
                    <Input
                      placeholder="Field name"
                      value={field.name}
                      onChange={(e) =>
                        updateField(index, { name: e.target.value })
                      }
                      className="bg-background/20"
                    />
                  </div>

                  <div className="">
                    <Select
                      value={field.type}
                      onValueChange={(value) =>
                        updateField(index, {
                          type: value as Field["type"],
                          arrayType: value === "array" ? "string" : undefined,
                          objectFields: value === "object" ? [] : undefined,
                        })
                      }
                    >
                      <SelectTrigger className="bg-background/20 w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="string">String</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="boolean">Boolean</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="array">Array</SelectItem>
                        <SelectItem value="object">Object</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {field.type === "array" && (
                    <div className="">
                      <Select
                        value={field.arrayType || "string"}
                        onValueChange={(value) =>
                          updateField(index, {
                            arrayType: value as Field["arrayType"],
                          })
                        }
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          <SelectItem value="string">String</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="boolean">Boolean</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="object">Object</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="flex gap-4 flex-col">
                    <div className="flex items-center space-x-3 mt-1">
                      <div className="flex items-center space-x-1">
                        <Checkbox
                          id={`required-${index}`}
                          checked={field.required}
                          onCheckedChange={(checked) =>
                            updateField(index, { required: !!checked })
                          }
                        />
                        <Label
                          htmlFor={`required-${index}`}
                          className="text-xs text-gray-300"
                        >
                          Required
                        </Label>
                      </div>
                    </div>

                    <div className=" flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Checkbox
                          id={`unique-${index}`}
                          checked={field.unique || false}
                          onCheckedChange={(checked) =>
                            updateField(index, { unique: !!checked })
                          }
                        />
                        <Label
                          htmlFor={`unique-${index}`}
                          className="text-xs text-gray-300"
                        >
                          Unique
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className=" flex items-center space-x-1 flex-col">
                    <Button
                      onClick={() => toggleValidationExpansion(index)}
                      variant="ghost"
                      size="sm"
                      className="p-1 h-8 w-8 text-gray-400 hover:text-gray-200"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    {field.type === "object" && (
                      <Button
                        onClick={() => toggleFieldExpansion(index)}
                        variant="ghost"
                        size="sm"
                        className="p-1 h-8 w-8 text-gray-400 hover:text-gray-200"
                      >
                        {expandedFields.has(index) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                    <Button
                      onClick={() => removeField(index)}
                      variant="ghost"
                      size="sm"
                      className="p-1 h-8 w-8 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Validation options */}
                <Collapsible open={expandedValidation.has(index)}>
                  <CollapsibleContent className="space-y-3">
                    <div className="pl-4 border-l-2 border-gray-700 space-y-3">
                      <Label className="text-sm font-medium text-gray-400">
                        Validation Options
                      </Label>

                      <div className="grid grid-cols-2 gap-3">
                        {(field.type === "string" ||
                          field.type === "number") && (
                          <>
                            <div>
                              <Label className="text-xs text-gray-400">
                                Min{" "}
                                {field.type === "string" ? "Length" : "Value"}
                              </Label>
                              <Input
                                type="number"
                                placeholder="0"
                                value={field.validation?.min || ""}
                                onChange={(e) =>
                                  updateValidation(index, {
                                    min: e.target.value
                                      ? parseInt(e.target.value)
                                      : undefined,
                                  })
                                }
                                className="bg-gray-800 border-gray-700 text-white text-sm"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-gray-400">
                                Max{" "}
                                {field.type === "string" ? "Length" : "Value"}
                              </Label>
                              <Input
                                type="number"
                                placeholder="100"
                                value={field.validation?.max || ""}
                                onChange={(e) =>
                                  updateValidation(index, {
                                    max: e.target.value
                                      ? parseInt(e.target.value)
                                      : undefined,
                                  })
                                }
                                className="bg-gray-800 border-gray-700 text-white text-sm"
                              />
                            </div>
                          </>
                        )}

                        {field.type === "string" && (
                          <div className="">
                            <Label className="text-xs text-gray-400">
                              Regex Pattern
                            </Label>
                            <Input
                              placeholder="^[a-zA-Z0-9]+$"
                              value={field.validation?.regex || ""}
                              onChange={(e) =>
                                updateValidation(index, {
                                  regex: e.target.value || undefined,
                                })
                              }
                              className="bg-gray-800 border-gray-700 text-white text-sm font-mono"
                            />
                          </div>
                        )}

                        <div className="">
                          <Label className="text-xs text-gray-400">
                            Default Value
                          </Label>
                          <Input
                            placeholder={
                              field.type === "boolean"
                                ? "true/false"
                                : "Default value"
                            }
                            value={field.validation?.default || ""}
                            onChange={(e) =>
                              updateValidation(index, {
                                default: e.target.value || undefined,
                              })
                            }
                            className="bg-gray-800 border-gray-700 text-white text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Object fields */}
                {field.type === "object" && expandedFields.has(index) && (
                  <div className="pl-4 border-l-2 border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-sm font-medium text-gray-400">
                        Object Fields
                      </Label>
                      <Button
                        onClick={() => addObjectField(index)}
                        size="sm"
                        variant="outline"
                        className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {field.objectFields?.map((objField, objIndex) => (
                        <div
                          key={objIndex}
                          className="grid grid-cols-12 gap-2 items-center"
                        >
                          <div className="col-span-4">
                            <Input
                              placeholder="Field name"
                              value={objField.name}
                              onChange={(e) =>
                                updateObjectField(index, objIndex, {
                                  name: e.target.value,
                                })
                              }
                              className="bg-gray-800 border-gray-700 text-white text-sm"
                            />
                          </div>

                          <div className="">
                            <Select
                              value={objField.type}
                              onValueChange={(value) =>
                                updateObjectField(index, objIndex, {
                                  type: value as Field["type"],
                                })
                              }
                            >
                              <SelectTrigger className="bg-gray-800 border-gray-700 text-white text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-900 border-gray-700">
                                <SelectItem value="string">String</SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                                <SelectItem value="boolean">Boolean</SelectItem>
                                <SelectItem value="date">Date</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="col-span-2 flex items-center space-x-2">
                            <Checkbox
                              id={`obj-required-${index}-${objIndex}`}
                              checked={objField.required}
                              onCheckedChange={(checked) =>
                                updateObjectField(index, objIndex, {
                                  required: !!checked,
                                })
                              }
                            />
                            <Label
                              htmlFor={`obj-required-${index}-${objIndex}`}
                              className="text-xs text-gray-300"
                            >
                              Required
                            </Label>
                          </div>

                          <div className="col-span-2 flex items-center space-x-2">
                            <Checkbox
                              id={`obj-unique-${index}-${objIndex}`}
                              checked={objField.unique || false}
                              onCheckedChange={(checked) =>
                                updateObjectField(index, objIndex, {
                                  unique: !!checked,
                                })
                              }
                            />
                            <Label
                              htmlFor={`obj-unique-${index}-${objIndex}`}
                              className="text-xs text-gray-300"
                            >
                              Unique
                            </Label>
                          </div>

                          <div className="col-span-1">
                            <Button
                              onClick={() => removeObjectField(index, objIndex)}
                              variant="ghost"
                              size="sm"
                              className="p-1 h-8 w-8 text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {fields.length === 0 && (
          <div className="text-center py-12 ">
            <p className="text-lg mb-2">No fields added yet</p>
            <p className="text-sm text-muted-foreground">
              Click "Add Field" to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
