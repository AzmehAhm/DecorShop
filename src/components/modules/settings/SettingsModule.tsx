import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CurrencySettings } from "./CurrencySettings";
import CategoryManager from "./CategoryManager";

export default function SettingsModule() {
  return (
    <div className="w-full p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">System Settings</h1>

      <Tabs defaultValue="currency" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="currency">Currency</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="currency">
          <CurrencySettings />
        </TabsContent>

        <TabsContent value="categories">
          <CategoryManager />
        </TabsContent>

        <TabsContent value="general">
          <div className="text-center py-12 text-muted-foreground">
            General settings will be implemented in a future update.
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="text-center py-12 text-muted-foreground">
            User management will be implemented in a future update.
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="text-center py-12 text-muted-foreground">
            Notification settings will be implemented in a future update.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
