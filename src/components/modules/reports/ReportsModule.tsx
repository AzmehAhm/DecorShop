import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, Settings, HelpCircle } from "lucide-react";
import ReportGenerator from "./ReportGenerator";
import ExportTools from "./ExportTools";

interface ReportsModuleProps {
  className?: string;
}

const ReportsModule = ({ className = "" }: ReportsModuleProps) => {
  const [activeReport, setActiveReport] = useState("sales");
  const [exportFormat, setExportFormat] = useState<
    "pdf" | "csv" | "excel" | "print"
  >("pdf");

  const handleExport = (format: "pdf" | "csv" | "excel" | "print") => {
    setExportFormat(format);
    // In a real implementation, this would trigger the export process
    console.log(`Exporting ${activeReport} report as ${format}`);
  };

  const handleReportExport = (type: string, format: string) => {
    // In a real implementation, this would trigger the export process from the report generator
    console.log(`Exporting ${type} report as ${format}`);
  };

  return (
    <div className={`w-full h-full bg-gray-50 p-4 md:p-6 ${className}`}>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">
              Generate and analyze business reports
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              Help
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Report Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <Button
                    variant={activeReport === "sales" ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => setActiveReport("sales")}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Sales Report
                  </Button>
                  <Button
                    variant={activeReport === "inventory" ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => setActiveReport("inventory")}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Inventory Report
                  </Button>
                  <Button
                    variant={activeReport === "financial" ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => setActiveReport("financial")}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Financial Report
                  </Button>
                  <Button
                    variant={activeReport === "customer" ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => setActiveReport("customer")}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Customer Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
              <ExportTools onExport={handleExport} />
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Saved Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <Button variant="ghost" className="justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Monthly Sales Summary
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Quarterly Inventory
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Annual Financial Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-3">
            <Tabs defaultValue="generator" className="w-full">
              <TabsList className="grid w-full md:w-[400px] grid-cols-2">
                <TabsTrigger value="generator">Report Generator</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="generator" className="mt-6">
                <ReportGenerator onExport={handleReportExport} />
              </TabsContent>

              <TabsContent value="scheduled" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col space-y-4">
                      <div className="text-center py-12">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium">
                          No Scheduled Reports
                        </h3>
                        <p className="text-muted-foreground mt-2">
                          You haven't set up any scheduled reports yet.
                        </p>
                        <Button className="mt-4">
                          Create Scheduled Report
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsModule;
