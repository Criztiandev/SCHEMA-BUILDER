"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  parseJsonSchema,
  parseTypeScriptInterface,
  parseMongooseModel,
} from "@/lib/schemaParser";
import { Schema } from "@/app/page";
import {
  ChevronDown,
  Code,
  Database,
  FileText,
  Settings2,
  Sparkles,
  Zap,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import Editor from "@monaco-editor/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface SchemaInputProps {
  onSchemaChange: (schema: Schema | null) => void;
  format: "nosql" | "sql";
  onFormatChange: (format: "nosql" | "sql") => void;
  useSmartDefaults: boolean;
  onSmartDefaultsChange: (enabled: boolean) => void;
}

const templates = {
  typescript: {
    name: "TypeScript Interface",
    icon: Code,
    content: `interface User {
  id: string;
  email: string;
  name: string;
  age?: number;
  isActive: boolean;
  createdAt: Date;
  tags?: string[];
  profile?: {
    bio?: string;
    website?: string;
  };
}`,
  },

  schema: {
    name: "JSON Schema",
    icon: FileText,
    content: `{
  "name": "User",
  "fields": [
    {
      "name": "id",
      "type": "string",
      "required": true,
      "unique": true
    }
  ]
}`,
  },
};

export function SchemaInput({
  onSchemaChange,
  format,
  onFormatChange,
  useSmartDefaults,
  onSmartDefaultsChange,
}: SchemaInputProps) {
  const [codeInput, setCodeInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] =
    useState<keyof typeof templates>("typescript");

  const handleCodeChange = (value: string | undefined) => {
    const code = value || "";
    setCodeInput(code);
    setError(null);

    if (!code.trim()) {
      onSchemaChange(null);
      return;
    }

    try {
      let schema: Schema;

      // Try to detect the input type and parse accordingly
      if (code.includes("interface ") || code.includes("type ")) {
        schema = parseTypeScriptInterface(code);
      } else {
        schema = parseJsonSchema(code);
      }

      onSchemaChange(schema);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid format");
      onSchemaChange(null);
    }
  };

  const handleLoadTemplate = (templateKey: keyof typeof templates) => {
    setSelectedTemplate(templateKey);
    setCodeInput(templates[templateKey].content);
    // Update language based on template
    setTimeout(() => {
      handleCodeChange(templates[templateKey].content);
    }, 100);
  };

  const getEditorLanguage = () => {
    if (selectedTemplate === "typescript") return "typescript";
    if (codeInput.includes("interface ") || codeInput.includes("type "))
      return "typescript";
    return "json";
  };

  useEffect(() => {
    if (!codeInput) {
      handleLoadTemplate("typescript");
    }
  }, []);

  return (
    <div className="relative">
      {/* Floating Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        {/* Settings Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button className="h-8 w-8 p-0 ">
              <Settings2 className="h-4 w-4 " />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-80 bg-card backdrop-blur-sm p-2  "
            align="end"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                  <div>
                    <p className="text-sm font-medium ">Smart Defaults</p>
                    <p className="text-xs text-slate-400">
                      Auto-validation patterns
                    </p>
                  </div>
                </div>
                <Switch
                  checked={useSmartDefaults}
                  onCheckedChange={onSmartDefaultsChange}
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Template Selector */}
        <Popover>
          <PopoverTrigger asChild>
            <Button size="sm" className="h-8 px-3 ">
              <FileText className="h-4 w-4 mr-2 " />
              <span className="capitalize">
                {selectedTemplate === "typescript"
                  ? "TypeScript Interface"
                  : "JSON Schema"}
              </span>
              <ChevronDown className="h-3 w-3 ml-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-56 bg-background/50 backdrop-blur-sm p-2"
            align="end"
          >
            <div className="space-y-2">
              {Object.entries(templates).map(([key, template]) => {
                const Icon = template.icon;
                return (
                  <Button
                    key={key}
                    onClick={() =>
                      handleLoadTemplate(key as keyof typeof templates)
                    }
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start transition-all duration-200 ${
                      selectedTemplate === key
                        ? "bg-card text-white"
                        : "hover:bg-background/50 text-slate-300"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {template.name}
                  </Button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Main Editor */}
      <Card className="bg-card overflow-hidden backdrop-blur-sm">
        <div className="relative">
          <Editor
            height="500px"
            language={getEditorLanguage()}
            value={codeInput}
            onChange={handleCodeChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: "on",
              folding: true,
              lineHeight: 22,
              fontFamily: "JetBrains Mono, Consolas, Monaco, monospace",
              padding: {
                top: 16,
              },
              scrollbar: {
                vertical: "hidden",
                horizontal: "hidden",
              },
              overviewRulerLanes: 0,
              hideCursorInOverviewRuler: true,
              overviewRulerBorder: false,
            }}
          />

          {/* Language indicator */}
          <div className="absolute bottom-4 right-4">
            <div className="px-2 py-1 bg-background/50 backdrop-blur-sm rounded text-xs ">
              {getEditorLanguage() === "typescript" ? "TypeScript" : "JSON"}
            </div>
          </div>
        </div>
      </Card>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-950/20 border border-red-800/30 rounded-lg backdrop-blur-sm">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Floating Help */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="fixed bottom-6 right-6 h-10 w-10 p-0 bg-background/50 backdrop-blur-sm border border-slate-600/50 hover:bg-slate-700/80 rounded-full shadow-lg"
            >
              <Zap className="h-4 w-4 text-yellow-400" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-card border-slate-600 ">
            <div className="text-xs space-y-1">
              <p>• JSON Schema with validation</p>
              <p>• TypeScript interfaces</p>
              <p>• Smart validation patterns</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
