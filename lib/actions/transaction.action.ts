"use server";

import { redirect } from "next/navigation";
import { handleError } from "../utils";
import { connectToDatabase } from "../database/mongoose";
import Transaction from "../database/models/transaction.model";
import { updateCredits } from "./user.actions";

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET!;
const PAYPAL_API_URL = "https://api-m.paypal.com"; // Use sandbox URL for testing: "https://api-m.sandbox.paypal.com"

/**
 * Generates a PayPal access token
 */
async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");

  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
}

/**
 * Creates a PayPal order
 */
export async function checkoutCredits(transaction: CheckoutTransactionParams) {
  try {
    const accessToken = await getPayPalAccessToken();

    const orderResponse = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: transaction.amount.toFixed(2),
            },
            description: transaction.plan,
          },
        ],
        application_context: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile?success=true`,
          cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/?canceled=true`,
        },
      }),
    });

    const orderData = await orderResponse.json();

    if (!orderData.id) throw new Error("Failed to create PayPal order");

    redirect(orderData.links.find((link: any) => link.rel === "approve").href);
  } catch (error) {
    handleError(error);
  }
}

/**
 * Stores the transaction in the database and updates user credits
 */
export async function createTransaction(transaction: CreateTransactionParams) {
  try {
    await connectToDatabase();

    const newTransaction = await Transaction.create({
      ...transaction,
      buyer: transaction.buyerId,
    });

    await updateCredits(transaction.buyerId, transaction.credits);

    return JSON.parse(JSON.stringify(newTransaction));
  } catch (error) {
    handleError(error);
  }
}
