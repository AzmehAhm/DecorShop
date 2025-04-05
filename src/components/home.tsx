import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardContent from "./dashboard/DashboardContent";
// Since the modules don't exist yet, we'll create placeholder components
// that will be implemented later
const InventoryModule = () => (
  <div className="p-6 bg-white">
    <h2 className="text-2xl font-bold mb-4">Inventory Management</h2>
    <p>Inventory module placeholder - to be implemented</p>
  </div>
);

const SalesModule = () => (
  <div className="p-6 bg-white">
    <h2 className="text-2xl font-bold mb-4">Sales Management</h2>
    <p>Sales module placeholder - to be implemented</p>
  </div>
);

const PurchasesModule = () => (
  <div className="p-6 bg-white">
    <h2 className="text-2xl font-bold mb-4">Purchases Management</h2>
    <p>Purchases module placeholder - to be implemented</p>
  </div>
);

const FinancialModule = () => (
  <div className="p-6 bg-white">
    <h2 className="text-2xl font-bold mb-4">Financial Management</h2>
    <p>Financial module placeholder - to be implemented</p>
  </div>
);

const ReportsModule = () => (
  <div className="p-6 bg-white">
    <h2 className="text-2xl font-bold mb-4">Reports</h2>
    <p>Reports module placeholder - to be implemented</p>
  </div>
);

import {
  Home as HomeIcon,
  Package,
  ShoppingCart,
  FileText,
  DollarSign,
  BarChart2,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HomeProps {
  defaultTab?: string;
}

const Home: React.FC<HomeProps> = ({ defaultTab = "dashboard" }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white border-r border-gray-200 transition-all duration-300 ${sidebarCollapsed ? "w-16" : "w-64"}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!sidebarCollapsed && (
            <h1 className="text-xl font-bold">ERP System</h1>
          )}
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            <li>
              <Button
                variant={activeTab === "dashboard" ? "secondary" : "ghost"}
                className={`w-full justify-${sidebarCollapsed ? "center" : "start"} mb-1`}
                onClick={() => setActiveTab("dashboard")}
              >
                <HomeIcon className="h-5 w-5 mr-2" />
                {!sidebarCollapsed && <span>Dashboard</span>}
              </Button>
            </li>
            <li>
              <Button
                variant={activeTab === "inventory" ? "secondary" : "ghost"}
                className={`w-full justify-${sidebarCollapsed ? "center" : "start"} mb-1`}
                onClick={() => setActiveTab("inventory")}
              >
                <Package className="h-5 w-5 mr-2" />
                {!sidebarCollapsed && <span>Inventory</span>}
              </Button>
            </li>
            <li>
              <Button
                variant={activeTab === "sales" ? "secondary" : "ghost"}
                className={`w-full justify-${sidebarCollapsed ? "center" : "start"} mb-1`}
                onClick={() => setActiveTab("sales")}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {!sidebarCollapsed && <span>Sales</span>}
              </Button>
            </li>
            <li>
              <Button
                variant={activeTab === "purchases" ? "secondary" : "ghost"}
                className={`w-full justify-${sidebarCollapsed ? "center" : "start"} mb-1`}
                onClick={() => setActiveTab("purchases")}
              >
                <FileText className="h-5 w-5 mr-2" />
                {!sidebarCollapsed && <span>Purchases</span>}
              </Button>
            </li>
            <li>
              <Button
                variant={activeTab === "financial" ? "secondary" : "ghost"}
                className={`w-full justify-${sidebarCollapsed ? "center" : "start"} mb-1`}
                onClick={() => setActiveTab("financial")}
              >
                <DollarSign className="h-5 w-5 mr-2" />
                {!sidebarCollapsed && <span>Financial</span>}
              </Button>
            </li>
            <li>
              <Button
                variant={activeTab === "reports" ? "secondary" : "ghost"}
                className={`w-full justify-${sidebarCollapsed ? "center" : "start"} mb-1`}
                onClick={() => setActiveTab("reports")}
              >
                <BarChart2 className="h-5 w-5 mr-2" />
                {!sidebarCollapsed && <span>Reports</span>}
              </Button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="dashboard" className="m-0">
            <DashboardContent />
          </TabsContent>
          <TabsContent value="inventory" className="m-0">
            <InventoryModule />
          </TabsContent>
          <TabsContent value="sales" className="m-0">
            <SalesModule />
          </TabsContent>
          <TabsContent value="purchases" className="m-0">
            <PurchasesModule />
          </TabsContent>
          <TabsContent value="financial" className="m-0">
            <FinancialModule />
          </TabsContent>
          <TabsContent value="reports" className="m-0">
            <ReportsModule />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Home;
