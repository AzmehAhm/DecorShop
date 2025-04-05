import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  Wallet,
  BarChart3,
  LogOut,
  Settings,
  DollarSign,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className = "" }: SidebarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navigationItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Inventory",
      path: "/inventory",
      icon: <Package className="h-5 w-5" />,
    },
    {
      name: "Sales",
      path: "/sales",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      name: "Purchases",
      path: "/purchases",
      icon: <Truck className="h-5 w-5" />,
    },
    {
      name: "Financial",
      path: "/financial",
      icon: <Wallet className="h-5 w-5" />,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <aside
      className={cn(
        "flex h-screen w-64 flex-col bg-background border-r border-border",
        className,
      )}
    >
      <div className="flex h-16 items-center px-6 border-b border-border">
        <h1 className="text-xl font-bold">Small Business ERP</h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navigationItems.map((item) => (
            <li key={item.path} className="flex">
              <Link
                to={item.path}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  currentPath === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-primary",
                )}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
                {item.name === "Financial" && (
                  <div className="ml-auto flex items-center space-x-1">
                    <span className="text-xs font-medium bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                      $
                    </span>
                    <span className="text-xs font-medium bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                      £
                    </span>
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <Separator />
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between px-3 py-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <DollarSign className="h-4 w-4 mr-2" />
            <span>Dual Currency</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-xs font-medium bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
              USD
            </span>
            <span className="text-xs font-medium bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
              SYP
            </span>
          </div>
        </div>
        <button
          className="w-full flex items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
          onClick={() => console.log("Logout clicked")}
        >
          <LogOut className="h-5 w-5" />
          <span className="ml-3">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
