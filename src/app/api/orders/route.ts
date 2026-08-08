import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, customerName, customerPhone, customerAddress } = body;

    if (!items || !items.length || !customerName || !customerPhone || !customerAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const totalPrice = items.reduce((acc: number, item: any) => {
      const qty = item.quantity || 1;
      const length = item.selectedLength || 1;
      return acc + (item.product.price * qty * (item.product.isCutPiece ? length : 1));
    }, 0);

    const order = await prisma.order.create({
      data: {
        customerName,
        customerPhone,
        customerAddress,
        totalPrice,
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
      include: {
        items: true,
      }
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: "Order placed successfully",
    }, { status: 201 });
  } catch (error) {
    console.error("Order error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
