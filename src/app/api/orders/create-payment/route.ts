import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "placeholder_secret",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, customerName, customerPhone, customerAddress, totalPrice } = body;

    if (!items?.length || !customerName || !customerPhone || !customerAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Amount in paise (smallest INR unit)
    const amountInPaise = Math.round(totalPrice * 100);

    // Create a Razorpay Order
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // Save pending order in DB
    const order = await prisma.order.create({
      data: {
        customerName,
        customerPhone,
        customerAddress,
        totalPrice,
        paymentMethod: "ONLINE",
        paymentStatus: "PENDING",
        razorpayOrderId: razorpayOrder.id,
        items: {
          create: items.map((item: any) => ({
            productId: item.product.id,
            productName: item.product.name,
            priceAtTime: item.product.price,
            quantity: item.quantity || 1,
            selectedSize: item.selectedSize || null,
            selectedLength: item.selectedLength || null,
          })),
        },
      },
    });

    return NextResponse.json({
      razorpayOrderId: razorpayOrder.id,
      orderId: order.id,
      amount: amountInPaise,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
    });
  } catch (error: any) {
    console.error("Create payment error:", error);
    return NextResponse.json({ error: error.message || "Failed to create payment" }, { status: 500 });
  }
}
