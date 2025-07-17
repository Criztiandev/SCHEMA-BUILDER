"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Copy, Check, Code, FileType, Database } from "lucide-react";
import { GeneratedCode } from "@/app/page";
import Editor from "@monaco-editor/react";
import { cn } from "@/lib/utils";

interface SchemaOutputProps {
  generatedCode: GeneratedCode | null;
}

export function SchemaOutput({ generatedCode }: SchemaOutputProps) {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const copyToClipboard = async (text: string, tabName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTab(tabName);
      setTimeout(() => setCopiedTab(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  if (!generatedCode) {
    return (
      <div className="flex items-center justify-center h-[700px] text-gray-500 border rounded-md bg-card">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-background/50 flex items-center justify-center">
            <Code className="w-8 h-8 text-gray-600" />
          </div>
          <p className="text-xl mb-2 text-gray-400">No schema generated yet</p>
          <p className="text-sm text-gray-500">
            Enter a schema or use the form builder to get started
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: "zod",
      label: "Zod Schema",
      icon: Code,
      language: "typescript",
      content: generatedCode.zod,
    },
    {
      id: "typescript",
      label: "TypeScript",
      icon: FileType,
      language: "typescript",
      content: generatedCode.typescript,
    },
    {
      id: "model",
      label: "Model",
      icon: Database,
      language: "javascript",
      content: generatedCode.model,
    },
  ];

  return (
    <Card className=" backdrop-blur-sm overflow-hidden">
      <Tabs defaultValue="zod" className="w-full">
        <div className="border-b">
          <TabsList className="bg-transparent p-0 h-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="data-[state=active]:bg-background/50 data-[state=active]:text-white transition-all duration-200 flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-slate-400 px-4 py-3"
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="m-0">
            <div className="relative">
              {/* Floating Copy Button */}
              <Button
                onClick={() => copyToClipboard(tab.content, tab.id)}
                size="sm"
                className={cn(
                  "absolute top-4 right-4 z-10 h-8 px-3 ",
                  copiedTab === tab.id
                    ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                    : ""
                )}
              >
                {copiedTab === tab.id ? (
                  <>
                    <Check className="w-3 h-3 mr-2 text-green-400" />
                    <span className="text-green-400 text-xs">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 mr-2" />
                    <span className="text-xs">Copy</span>
                  </>
                )}
              </Button>

              <div className="h-[600px]">
                <Editor
                  height="600px"
                  language={tab.language}
                  value={tab.content}
                  theme="vs-dark"
                  options={{
                    readOnly: true,
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
                      top: 24,
                      bottom: 20,
                      left: 16,
                      right: 16,
                    } as any,
                    scrollbar: {
                      vertical: "hidden",
                      horizontal: "hidden",
                    },
                    overviewRulerLanes: 0,
                    hideCursorInOverviewRuler: true,
                    overviewRulerBorder: false,
                  }}
                />
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
}
