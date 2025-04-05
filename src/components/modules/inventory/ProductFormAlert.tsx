import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

interface ProductFormAlertProps {
  type: "success" | "error";
  title: string;
  message: string;
  onClose?: () => void;
}

const ProductFormAlert = ({
  type,
  title,
  message,
  onClose,
}: ProductFormAlertProps) => {
  React.useEffect(() => {
    if (onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [onClose]);

  return (
    <Alert
      variant={type === "error" ? "destructive" : "default"}
      className={`mb-4 ${type === "success" ? "bg-green-50 border-green-200 text-green-800" : ""}`}
    >
      {type === "success" ? (
        <CheckCircle className="h-4 w-4" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default ProductFormAlert;
