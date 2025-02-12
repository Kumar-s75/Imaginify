/* eslint-disable camelcase */
import { createTransaction } from "@/lib/actions/transaction.action";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json(); // PayPal sends JSON, so parse it directly

  // PayPal webhook event type
  const eventType = body.event_type;

  // Handle successful payment capture
  if (eventType === "CHECKOUT.ORDER.APPROVED" || eventType === "PAYMENT.CAPTURE.COMPLETED") {
    const { id, purchase_units } = body.resource;

    const transaction = {
      paypalId: id,
      amount: purchase_units[0]?.amount?.value ? Number(purchase_units[0].amount.value) : 0,
      plan: purchase_units[0]?.custom_id || "",
      credits: Number(purchase_units[0]?.reference_id) || 0,
      buyerId: purchase_units[0]?.payee?.merchant_id || "",
      createdAt: new Date(),
    };

    const newTransaction = await createTransaction(transaction);

    return NextResponse.json({ message: "OK", transaction: newTransaction });
  }

  return new Response("", { status: 200 });
}
