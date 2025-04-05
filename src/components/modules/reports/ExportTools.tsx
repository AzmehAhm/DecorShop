import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileDown, FileText, FileSpreadsheet, Printer } from "lucide-react";

interface ExportToolsProps {
  onExport?: (format: "pdf" | "csv" | "excel" | "print") => void;
  disabledFormats?: Array<"pdf" | "csv" | "excel" | "print">;
  className?: string;
}

const ExportTools = ({
  onExport = () => {},
  disabledFormats = [],
  className = "",
}: ExportToolsProps) => {
  const handleExport = (format: "pdf" | "csv" | "excel" | "print") => {
    onExport(format);
  };

  return (
    <Card className={`p-4 bg-white ${className}`}>
      <div className="flex flex-col space-y-3">
        <h3 className="text-sm font-medium">Export Options</h3>
        <div className="flex flex-wrap gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => handleExport("pdf")}
                  disabled={disabledFormats.includes("pdf")}
                >
                  <FileText className="h-4 w-4" />
                  PDF
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export as PDF document</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => handleExport("csv")}
                  disabled={disabledFormats.includes("csv")}
                >
                  <FileDown className="h-4 w-4" />
                  CSV
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export as CSV file</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => handleExport("excel")}
                  disabled={disabledFormats.includes("excel")}
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Excel
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export as Excel spreadsheet</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => handleExport("print")}
                  disabled={disabledFormats.includes("print")}
                >
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Print report</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </Card>
  );
};

export default ExportTools;
