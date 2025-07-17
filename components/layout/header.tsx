import { Database } from "lucide-react";
import React from "react";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HeaderProps {
  format: "nosql" | "sql";
  handleFormatChange: (format: "nosql" | "sql") => void;
}

const Header = ({ format, handleFormatChange }: HeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2  rounded-lg">
            <Database className="h-6 w-6 " />
          </div>
          <h1 className="text-2xl font-bold ">Schema Builder</h1>
          <Badge variant="secondary" className="">
            v2.0
          </Badge>
        </div>

        {/* Database Format Selector */}
        <div className="flex items-center gap-3">
          <span className="text-sm ">Database Format:</span>
          <Select value={format} onValueChange={handleFormatChange}>
            <SelectTrigger className="w-24 h-9 bg-card border-none text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card ">
              <SelectItem value="nosql">NoSQL</SelectItem>
              <SelectItem value="sql">SQL</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <p className="text-muted-foreground">
        Generate type-safe schemas with intelligent validation
      </p>
    </div>
  );
};

export default Header;
