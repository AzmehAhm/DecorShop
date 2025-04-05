import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, RefreshCcw, Plus } from "lucide-react";
import InvoiceList from "./InvoiceList";
import InvoiceForm from "./InvoiceForm";
import ReturnProcessor from "./ReturnProcessor";

interface SalesModuleProps {
  activeTab?: string;
}

const SalesModule: React.FC<SalesModuleProps> = ({
  activeTab = "invoices",
}) => {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null,
  );
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [isEditingInvoice, setIsEditingInvoice] = useState(false);
  const [isProcessingReturn, setIsProcessingReturn] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleCreateInvoice = () => {
    setIsCreatingInvoice(true);
    setSelectedInvoiceId(null);
    setIsEditingInvoice(false);
    setSelectedInvoice(null);
  };

  const handleEditInvoice = (id: string) => {
    setSelectedInvoiceId(id);
    setIsEditingInvoice(true);
    setIsCreatingInvoice(true);
  };

  const handleViewInvoice = (id: string) => {
    setSelectedInvoiceId(id);
    // In a real app, this would fetch the invoice details
    console.log(`Viewing invoice ${id}`);
  };

  const handleProcessReturn = (id: string) => {
    setSelectedInvoiceId(id);
    setIsProcessingReturn(true);
  };

  const handleDeleteInvoice = (id: string) => {
    // In a real app, this would delete the invoice
    console.log(`Deleting invoice ${id}`);
  };

  const handleInvoiceFormSubmit = (data: any) => {
    // In a real app, this would save the invoice
    console.log("Invoice form submitted:", data);
    setIsCreatingInvoice(false);
    setIsEditingInvoice(false);
  };

  const handleReturnComplete = (data: any) => {
    // In a real app, this would process the return
    console.log("Return processed:", data);
    setIsProcessingReturn(false);
  };

  return (
    <div className="w-full h-full p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sales Management</h1>
        <div className="flex gap-2">
          {!isCreatingInvoice && !isProcessingReturn && (
            <Button onClick={handleCreateInvoice}>
              <Plus className="mr-2 h-4 w-4" />
              New Invoice
            </Button>
          )}
          {isCreatingInvoice && (
            <Button
              variant="outline"
              onClick={() => setIsCreatingInvoice(false)}
            >
              Back to Invoices
            </Button>
          )}
          {isProcessingReturn && (
            <Button
              variant="outline"
              onClick={() => setIsProcessingReturn(false)}
            >
              Back to Invoices
            </Button>
          )}
        </div>
      </div>

      {!isCreatingInvoice && !isProcessingReturn ? (
        <Tabs
          value={currentTab}
          onValueChange={setCurrentTab}
          className="w-full"
        >
          <TabsList className="mb-6">
            <TabsTrigger value="invoices" className="px-6">
              <FileText className="mr-2 h-4 w-4" />
              Invoices
            </TabsTrigger>
            <TabsTrigger value="returns" className="px-6">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Returns
            </TabsTrigger>
          </TabsList>

          <TabsContent value="invoices" className="space-y-6">
            <Card>
              <CardContent className="p-0">
                <InvoiceList
                  onEdit={handleEditInvoice}
                  onDelete={handleDeleteInvoice}
                  onView={handleViewInvoice}
                  onProcessReturn={handleProcessReturn}
                  onSelectInvoice={(invoice) => {
                    setSelectedInvoice(invoice);
                    if (invoice) {
                      handleEditInvoice(invoice.id);
                    } else {
                      handleCreateInvoice();
                    }
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="returns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Returns</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  View and manage recent product returns and refunds.
                </p>
                <Button onClick={() => setIsProcessingReturn(true)}>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Process New Return
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : isCreatingInvoice ? (
        <InvoiceForm
          onSubmit={handleInvoiceFormSubmit}
          isEditing={isEditingInvoice}
          initialData={selectedInvoice}
        />
      ) : (
        <ReturnProcessor
          onComplete={handleReturnComplete}
          onCancel={() => setIsProcessingReturn(false)}
          initialInvoiceId={selectedInvoiceId || ""}
        />
      )}
    </div>
  );
};

export default SalesModule;
