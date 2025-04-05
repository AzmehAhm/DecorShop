import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Control } from "react-hook-form";

interface CurrencySelectorProps {
  control: Control<any>;
  currencyName: string;
  exchangeRateName: string;
  label?: string;
  exchangeRateLabel?: string;
  className?: string;
}

export function CurrencySelector({
  control,
  currencyName,
  exchangeRateName,
  label = "Currency",
  exchangeRateLabel = "Exchange Rate (SYP to USD)",
  className = "",
}: CurrencySelectorProps) {
  const { defaultExchangeRate } = useCurrency();

  return (
    <div className={`space-y-4 ${className}`}>
      <FormField
        control={control}
        name={currencyName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="SYP">SYP (£)</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={exchangeRateName}
        render={({ field, formState }) => {
          const watchedCurrency = control._formValues[currencyName];
          if (watchedCurrency !== "SYP") return null;

          return (
            <FormItem>
              <FormLabel>{exchangeRateLabel}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder={`Default: ${defaultExchangeRate}`}
                  {...field}
                  onChange={(e) => {
                    const value =
                      e.target.value === ""
                        ? undefined
                        : parseFloat(e.target.value);
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
}
