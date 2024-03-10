import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAI } from 'langchain/llms/openai';
import { loadQAStuffChain } from 'langchain/chains';
import { Document } from 'langchain/document';
import { timeout } from '../config';

export const createPineconeIndex = async (
    client,
    indexName,
    vectorDimension
) => {
    console.log(`Checking "${indexName}"...`);
    
    const existingIndexes = await client.listIndexes();
    console.log('existingIndexes', existingIndexes)
    if (existingIndexes.indexes.length === 0) {
        console.log(`Creating "${indexName}"...`);
        await client.createIndex({
          name: indexName,
          dimension: vectorDimension,
          metric: 'cosine',
          spec: {
            pod: {
              environment: process.env.PINECONE_ENV || '',
              podType: process.env.PINECONE_POD_TYPE || '',
              pods: process.env.PINECONE_PODS || '',
            },
          }
        });
        console.log(`Creating index... please wait for it to finish intializing.`);

        await new Promise((resolve) => setTimeout(resolve, timeout));
    } else {
      console.log(`"${indexName}" already exists.`)
    }
}

export const updatePinecone = async (client, indexName, docs) => {
  const index = client.Index(indexName);

  console.log(`Pinecone index retrieved: ${indexName}`);

  for (const doc of docs) {
    console.log(`Processing document: ${doc.metadata.source}`);
    const txtPath = doc.metadata.source;
    const text = doc.pageContent;

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });

    console.log('Splitting text into chunks...');

    const chunks = await textSplitter.createDocuments([text])

    console.log(`Text split into ${chunks.length} chunks`);
    console.log(`Calling OpenAI's Embedding endpoint documents with ${chunks.length} text chunks...`)

    const embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY });

    const embeddingsArray = await embeddings.embedDocuments(
      chunks.map(chunk => chunk.pageContent.replace(/\n/g, " "))
    );

    const batchSize = 100;
    let batch: any = [];

    for (let i = 0 ; i < chunks.length; i++) {
      const chunk = chunks[i];
      const vector = {
        id: `${txtPath}_${i}`,
        values: embeddingsArray[i],
        metadata: {
          ...chunk.metadata,
          loc: JSON.stringify(chunk.metadata.loc),
          pageContent: chunk.pageContent,
          txtPath: txtPath,
          idBook: txtPath.split('\\')[txtPath.split('\\').length - 2]
        }
      }

      batch = [...batch, vector]

      if (batch.length === batchSize || i === chunks.length - 1) {
        await index.upsert(batch)

        batch = []
      }
    }
  }
} 

export const queryPineconeVectorStoreAndQueryLLM = async (client, indexName, question, idBook) => {
  console.log('Querying Pinecone vector store...');

  const index = client.Index(indexName)

  const embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY });

  const queryEmbedding = await embeddings.embedQuery(question)

  let queryResponse = await index.query({
    topK: 10,
    vector: queryEmbedding,
    includeMetadata: true,
    includeValues: true,
    filter: { idBook: { $eq: idBook } }
  })

  console.log(`Asking question: ${question}...`)

  if (queryResponse.matches.length) {
    const openAI = new OpenAI({});
    const chain = loadQAStuffChain(openAI);

    const concatenatedPageContent = queryResponse.matches.map(match => match.metadata.pageContent).join(" ");

    const result = await chain.call({
      input_documents: [new Document({pageContent: concatenatedPageContent})],
      question: question
    })

    console.log(`Answer: ${result.text}`);
    return result.text;
  } else {
    console.log('No answer');
    return 'No answer'
  }
}
