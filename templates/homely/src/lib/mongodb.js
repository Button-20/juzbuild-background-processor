"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/real-estate";
if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}
let cachedClient = null;
let cachedDb = null;
let cachedDbName = null;
async function connectDB() {
    if (cachedClient && cachedDb && cachedDbName) {
        return {
            client: cachedClient,
            db: cachedDb,
            dbName: cachedDbName,
        };
    }
    const client = new mongodb_1.MongoClient(MONGODB_URI);
    await client.connect();
    const dbName = MONGODB_URI.split("/").pop() || "real-estate";
    const db = client.db(dbName);
    cachedClient = client;
    cachedDb = db;
    cachedDbName = dbName;
    return { client, db, dbName };
}
exports.default = connectDB;
//# sourceMappingURL=mongodb.js.map