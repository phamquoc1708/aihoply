import { NextResponse, NextRequest } from "next/server";
import BookModel from "@/models/Book.model";
import { connectDB } from "@/config/database";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";

export async function GET(req: NextRequest) {
  await connectDB();
  const books = await BookModel.findOne({ _id: req.url });

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



