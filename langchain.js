import { Milvus } from "@langchain/community/vectorstores/milvus";
import { OpenAIEmbeddings } from "@langchain/openai";
import split from "./textSplitter.mjs";

import dotenv from "dotenv";

dotenv.config();

async function store() {
    const docs = await split();
    const idObj = [];
    const docList = [];

    var i = 1;

    for(var doc of docs) {
        docList.push(doc.pageContent);
        idObj.push({id:i++});
    }

    await Milvus.fromTexts(
        docList, idObj, new OpenAIEmbeddings(), {collectionName: "Korea",}
    );
}

async function query() {
    const vectorStore = await Milvus.fromExistingCollection(
        new OpenAIEmbeddings(),
        {
          collectionName: "Korea",
        }
    );
      
    const response = await vectorStore.similaritySearch("kpop은 뭐야?", 1);

    console.log(response);
}

query();