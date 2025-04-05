import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Save, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function CurrencySettings() {
  const { defaultExchangeRate, setDefaultExchangeRate } = useCurrency();
  const [rate, setRate] = useState<string>(defaultExchangeRate.toString());
  const { toast } = useToast();

  const handleSave = () => {
    const newRate = parseFloat(rate);
    if (isNaN(newRate) || newRate <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid exchange rate",
        description: "Please enter a valid positive number",
      });
      return;
    }

    setDefaultExchangeRate(newRate);
    toast({
      title: "Settings updated",
      description: "Default exchange rate has been updated successfully",
    });
  };

  // Simulate fetching the latest exchange rate
  const fetchLatestRate = () => {
    // In a real app, this would call an API
    // For demo purposes, we'll just set a random rate around the current value
    const variation = Math.random() * 100 - 50; // Random value between -50 and 50
    const newRate = Math.max(defaultExchangeRate + variation, 1000).toFixed(2);
    setRate(newRate);

    toast({
      title: "Rate updated",
      description: `Latest exchange rate fetched: ${newRate} SYP to 1 USD`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currency Settings</CardTitle>
        <CardDescription>
          Configure default exchange rates for multi-currency transactions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="exchange-rate">
            Default Exchange Rate (SYP to USD)
          </Label>
          <div className="flex gap-2">
            <Input
              id="exchange-rate"
              type="number"
              min="0"
              step="0.01"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="Enter exchange rate"
            />
            <Button
              variant="outline"
              onClick={fetchLatestRate}
              title="Fetch latest rate"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            This rate will be used as the default when creating transactions in
            SYP
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </CardFooter>
    </Card>
  );
}
