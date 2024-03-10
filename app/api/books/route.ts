import { NextResponse } from "next/server";
import BookModel from "@/models/Book.model";
import { connectDB } from "@/config/database";

export async function GET() {
  await connectDB();

  const books = await BookModel.find({})

  return NextResponse.json({
    data: books,
  });
}
