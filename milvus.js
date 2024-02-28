import { MilvusClient,  DataType } from "@zilliz/milvus2-sdk-node";

import { makeData, embedded } from "./textSplitter.mjs"
import dotenv from "dotenv";

dotenv.config();

const milvusClient = new MilvusClient({
    address: process.env.MILVUS_URL,
});

async function insert() {
    const data = await makeData();

    const response = await milvusClient.insert({
        collection_name: 'Korea',
        fields_data: data,
    });

    console.log(response);
}

async function upsert() {
    var text = '한국의 국립 박물관과 유적지는 역사와 문화를 보존하고 있습니다.';
    var vec = await embedded(text);

    const data = {
        id: 34,
        text: text,
        vector: vec,
    }

    const response = await milvusClient.upsert({
        collection_name: 'Korea',
        fields_data: [data],
    });

    console.log(response);
}

async function search(text) {
    const vec = await embedded(text);

    const response = await milvusClient.search({
        collection_name: 'Korea',
        vector: vec,
        limit: 1,
    });

    console.log(response);
}

upsert();