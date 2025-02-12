"use client";

import { useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useToast } from "@/hooks/use-toast";
import { checkoutCredits } from "@/lib/actions/transaction.action";
import { Button } from "../ui/button";

const Checkout = ({
  plan,
  amount,
  credits,
  buyerId,
}: {
  plan: string;
  amount: number;
  credits: number;
  buyerId: string;
}) => {
  const { toast } = useToast();
  const [isPaying, setIsPaying] = useState(false);

  const handlePaymentSuccess = async (details: any) => {
    setIsPaying(true);

    const transaction = {
      plan,
      amount,
      credits,
      buyerId,
      paypalOrderId: details.id, // Capture PayPal order ID
    };

    try {
      await checkoutCredits(transaction);
      toast({
        title: "Payment Successful!",
        description: `Transaction ID: ${details.id}`,
        duration: 5000,
        className: "success-toast",
      });
    } catch (error) {
      toast({
        title: "Transaction Failed!",
        description: "An error occurred while processing your transaction.",
        duration: 5000,
        className: "error-toast",
      });
    }

    setIsPaying(false);
  };

  return (
    <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID! }}>
      <div className="flex flex-col items-center">
      <PayPalButtons
  style={{ layout: "vertical", color: "blue" }}
  createOrder={(data, actions) => {
    return actions.order.create({
      intent: "CAPTURE", // ✅ Required field
      purchase_units: [
        {
          amount: {
            currency_code: "USD", // ✅ Required field
            value: amount.toFixed(2), // ✅ Ensure value is a string
          },
        },
      ],
    }) as Promise<string>; // ✅ Explicitly cast return type
  }}
  
  onApprove={async (data, actions) => {
    if (!actions?.order) return; // ✅ Fix: Ensure actions.order is not undefined

    try {
      const details = await actions.order.capture();
      handlePaymentSuccess(details);
    } catch (error) {
      toast({
        title: "Payment Failed!",
        description: "An error occurred during payment processing.",
        duration: 5000,
        className: "error-toast",
      });
    }
  }}
  onError={(err) => {
    let errorMessage = "Something went wrong."; 
  
    if (err && typeof err === "object" && "message" in err) {
      errorMessage = String(err.message); 
    }
  
    toast({
      title: "Payment Error!",
      description: errorMessage, 
      duration: 5000,
      className: "error-toast",
    });
  }}
  
/>

        <Button
          disabled={isPaying}
          className="w-full rounded-full bg-purple-gradient bg-cover mt-4"
        >
          {isPaying ? "Processing..." : "Buy Credit"}
        </Button>
      </div>
    </PayPalScriptProvider>
  );
};

export default Checkout;
