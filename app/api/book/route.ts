import { NextResponse } from "next/server";
import BookModel from "@/models/Book.model";
import { connectDB } from "@/config/database";
import mongoose from "mongoose";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";

export async function GET(id: string) {
  await connectDB();

  const books = await BookModel.findOne({_id: new mongoose.Types.ObjectId(id)});

  const loader = new DirectoryLoader(`./documents/${books.idBook}`, {
    ".txt": (path) => new TextLoader(path),
    ".md": (path) => new TextLoader(path),
    ".pdf": (path) => new PDFLoader(path)
  })
  const docs = await loader.load();

  return NextResponse.json({
    data: {information: books, content: docs[0].pageContent},
  });
}



