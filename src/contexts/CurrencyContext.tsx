import React, { createContext, useContext, useState, useEffect } from "react";

type Currency = "USD" | "SYP";

interface CurrencyContextType {
  defaultExchangeRate: number;
  setDefaultExchangeRate: (rate: number) => void;
  getExchangeRate: (providedRate?: number | null) => number;
  convertAmount: (
    amount: number,
    fromCurrency: Currency,
    toCurrency: Currency,
    customRate?: number,
  ) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined,
);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [defaultExchangeRate, setDefaultExchangeRate] = useState<number>(3500); // Default SYP to USD rate

  // Load saved exchange rate from localStorage on initial load
  useEffect(() => {
    const savedRate = localStorage.getItem("defaultExchangeRate");
    if (savedRate) {
      setDefaultExchangeRate(parseFloat(savedRate));
    }
  }, []);

  // Save exchange rate to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("defaultExchangeRate", defaultExchangeRate.toString());
  }, [defaultExchangeRate]);

  // Get exchange rate (use provided rate or fall back to default)
  const getExchangeRate = (providedRate?: number | null): number => {
    return providedRate && providedRate > 0
      ? providedRate
      : defaultExchangeRate;
  };

  // Convert amount between currencies
  const convertAmount = (
    amount: number,
    fromCurrency: Currency,
    toCurrency: Currency,
    customRate?: number,
  ): number => {
    if (fromCurrency === toCurrency) return amount;

    const rate = customRate || defaultExchangeRate;

    if (fromCurrency === "USD" && toCurrency === "SYP") {
      return amount * rate;
    } else if (fromCurrency === "SYP" && toCurrency === "USD") {
      return amount / rate;
    }

    return amount; // Fallback
  };

  return (
    <CurrencyContext.Provider
      value={{
        defaultExchangeRate,
        setDefaultExchangeRate,
        getExchangeRate,
        convertAmount,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
