"use client";

import { useState } from "react";
import { SchemaInput } from "@/components/SchemaInput";
import { SchemaOutput } from "@/components/SchemaOutput";
import { FormBuilder } from "@/components/FormBuilder";
import { generateCode } from "@/lib/codeGenerators";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/layout/header";

export interface ValidationOptions {
  min?: number;
  max?: number;
  regex?: string;
  default?: string;
}

export interface Field {
  name: string;
  type: "string" | "number" | "boolean" | "date" | "array" | "object";
  required: boolean;
  unique?: boolean;
  validation?: ValidationOptions;
  arrayType?: "string" | "number" | "boolean" | "date" | "object";
  objectFields?: Field[];
}

export interface Schema {
  name: string;
  fields: Field[];
}

export interface GeneratedCode {
  zod: string;
  typescript: string;
  model: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"json" | "builder">("json");
  const [schema, setSchema] = useState<Schema | null>(null);
  const [format, setFormat] = useState<"nosql" | "sql">("nosql");
  const [useSmartDefaults, setUseSmartDefaults] = useState<boolean>(true);
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const handleSchemaChange = (newSchema: Schema | null) => {
    setSchema(newSchema);
    setError(null);

    if (newSchema) {
      try {
        const code = generateCode(newSchema, format, useSmartDefaults);
        setGeneratedCode(code);
      } catch (err) {
        setError("Failed to generate code. Please check your schema format.");
        setGeneratedCode(null);
      }
    } else {
      setGeneratedCode(null);
    }
  };

  const handleFormatChange = (newFormat: "nosql" | "sql") => {
    setFormat(newFormat);
    if (schema) {
      try {
        const code = generateCode(schema, newFormat, useSmartDefaults);
        setGeneratedCode(code);
      } catch (err) {
        setError("Failed to generate code. Please check your schema format.");
        setGeneratedCode(null);
      }
    }
  };

  const handleSmartDefaultsChange = (enabled: boolean) => {
    setUseSmartDefaults(enabled);
    if (schema) {
      try {
        const code = generateCode(schema, format, enabled);
        setGeneratedCode(code);
      } catch (err) {
        setError("Failed to generate code. Please check your schema format.");
        setGeneratedCode(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <Header format={format} handleFormatChange={handleFormatChange} />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <Card className=" p-8 shadow-2xl bg-card/50">
            <Tabs
              value={activeTab}
              onValueChange={(value) =>
                setActiveTab(value as "json" | "builder")
              }
            >
              <TabsList className="grid w-full grid-cols-2  mb-8 p-1">
                <TabsTrigger
                  value="json"
                  className="data-[state=active]:bg-background/60  transition-all duration-200"
                >
                  Code Editor
                </TabsTrigger>
                <TabsTrigger
                  value="builder"
                  className="data-[state=active]:bg-background/60  transition-all duration-200"
                >
                  Form Builder
                </TabsTrigger>
              </TabsList>

              <TabsContent value="json" className="space-y-6">
                <SchemaInput
                  onSchemaChange={handleSchemaChange}
                  format={format}
                  onFormatChange={handleFormatChange}
                  useSmartDefaults={useSmartDefaults}
                  onSmartDefaultsChange={handleSmartDefaultsChange}
                />
              </TabsContent>

              <TabsContent value="builder" className="space-y-6">
                <FormBuilder
                  onSchemaChange={handleSchemaChange}
                  format={format}
                  onFormatChange={handleFormatChange}
                />
              </TabsContent>
            </Tabs>

            {error && (
              <div className="mt-6 p-4 bg-red-950/30 border border-red-800/50 rounded-lg">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}
          </Card>

          {/* Output Panel */}
          <Card className="bg-background border-none">
            <SchemaOutput generatedCode={generatedCode} />
          </Card>
        </div>
      </div>
    </div>
  );
}
