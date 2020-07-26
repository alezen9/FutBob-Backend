"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDBInstance = exports.MongoDB = exports.MongoState = void 0;
const mongodb_1 = require("mongodb");
const Entities_1 = require("./Entities");
const Collections_1 = __importDefault(require("./Collections"));
const helpers_1 = require("../Utils/helpers");
require('dotenv').config();
var MongoState;
(function (MongoState) {
    MongoState[MongoState["Connected"] = 0] = "Connected";
    MongoState[MongoState["Disconnected"] = 1] = "Disconnected";
})(MongoState = exports.MongoState || (exports.MongoState = {}));
class MongoDB {
    constructor(dbUri, dbName) {
        const { dbUri: initDbUri, dbName: initDbName } = this.getMongoInit();
        this.dbUri = dbUri || initDbUri;
        this.dbName = dbName || initDbName;
        this.state = MongoState.Disconnected;
    }
    getMongoInit() {
        return {
            dbUri: process.env.NODE_ENV === 'prod'
                ? process.env.MONGO_DB_URI
                : 'mongodb://localhost:27017/',
            dbName: process.env.NODE_ENV === 'prod'
                ? 'main'
                : 'test'
        };
    }
    startConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield mongodb_1.MongoClient.connect(this.dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
                this.setupCollections(client);
                this.state = MongoState.Connected;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    setupCollections(client) {
        const collection = new Entities_1.CollectionContainer();
        for (const { name, indexes = [] } of Collections_1.default) {
            client.db(this.dbName).createCollection(name);
            if (indexes.length) {
                for (const index of indexes) {
                    client.db(this.dbName).collection(name).createIndex(index);
                }
            }
            collection[helpers_1.lowerCaseFirst(name)] = client.db(this.dbName).collection(name);
        }
        this.client = client;
        this.collection = collection;
    }
    clearDb() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < Collections_1.default.length; i++) {
                const name = helpers_1.lowerCaseFirst(Collections_1.default[i].name);
                if (this.collection && this.collection[name])
                    yield this.collection[name].deleteMany({});
            }
        });
    }
    closeConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.client)
                    this.client.close();
                this.state = MongoState.Disconnected;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
}
exports.MongoDB = MongoDB;
exports.MongoDBInstance = new MongoDB();
//# sourceMappingURL=index.js.map