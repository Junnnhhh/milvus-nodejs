import { CharacterTextSplitter } from "langchain/text_splitter";
import { OpenAI } from "openai";

import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function embedded(text) {
    const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
        encoding_format: "float",
    });
    
    return embedding.data[0].embedding;
}

export async function makeData() {
    const returnArr = [];

    const file = fs.readFileSync('./test.txt', "utf-8");

    const splitter = new CharacterTextSplitter({
        separator: '\r\n',
        chunkSize: 20,
        chunkOverlap: 10,
    });

    const output = await splitter.createDocuments([file]);
    var id = 1;
    
    for(var obj of output) {
        var text = obj.pageContent;
        var vector = await embedded(text);

        returnArr.push({id: id++, text: text, vector: vector});
    }

    return returnArr;
}