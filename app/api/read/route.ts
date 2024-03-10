import { NextRequest, NextResponse } from "next/server";
import { Pinecone } from '@pinecone-database/pinecone';
import { queryPineconeVectorStoreAndQueryLLM } from "@/pinecone/untils";
import { indexName } from "@/config";

export async function POST(req: NextRequest, idBook: string) {
    const body = await req.json();
  console.log(body)
    const client = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY || '',
    });

    const text = await queryPineconeVectorStoreAndQueryLLM(client, indexName, body.query, body.idBook);

    return NextResponse.json({
        data: text,
    })
}