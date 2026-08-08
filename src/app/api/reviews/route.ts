import { NextResponse } from "next/server";
import { reviews, overallRating, totalReviews, ratingBreakdown } from "@/data/reviews";

export async function GET() {
  return NextResponse.json({
    reviews,
    overallRating,
    totalReviews,
    ratingBreakdown,
  });
}
