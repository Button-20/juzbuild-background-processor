import type { Db } from "mongodb";
import { MongoClient } from "mongodb";
declare function connectDB(): Promise<{
    client: MongoClient;
    db: Db;
    dbName: string;
}>;
export default connectDB;
//# sourceMappingURL=mongodb.d.ts.map