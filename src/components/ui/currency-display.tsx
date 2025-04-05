import React from "react";
import { useCurrency } from "@/contexts/CurrencyContext";

interface CurrencyDisplayProps {
  amount: number;
  currency: "USD" | "SYP";
  exchangeRate?: number;
  showConversion?: boolean;
  className?: string;
}

export function CurrencyDisplay({
  amount,
  currency,
  exchangeRate,
  showConversion = false,
  className = "",
}: CurrencyDisplayProps) {
  const { getExchangeRate, convertAmount } = useCurrency();
  const rate = getExchangeRate(exchangeRate);

  const formatCurrency = (value: number, curr: "USD" | "SYP") => {
    if (curr === "USD") {
      return `$${value.toFixed(2)}`;
    } else {
      return `£${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    }
  };

  return (
    <div className={className}>
      <span className="font-medium">{formatCurrency(amount, currency)}</span>
      {showConversion && (
        <span className="text-xs text-muted-foreground ml-1">
          {currency === "USD"
            ? `(${formatCurrency(convertAmount(amount, "USD", "SYP", rate), "SYP")})`
            : `(${formatCurrency(convertAmount(amount, "SYP", "USD", rate), "USD")})`}
        </span>
      )}
    </div>
  );
}
