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
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const Entities_1 = require("./Entities");
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
            dbUri: process.env.NODE_ENV === 'production'
                ? process.env.MONGO_DB_URI
                : 'mongodb://localhost:27017/',
            dbName: process.env.NODE_ENV === 'production'
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
        // create collections
        client.db(this.dbName).createCollection('User');
        client.db(this.dbName).createCollection('Player');
        client.db(this.dbName).createCollection('Match');
        // create indexes
        client.db(this.dbName).collection('User').createIndex({ 'credentials.username': 1 });
        client.db(this.dbName).collection('User').createIndex({ footballPlayer: 1 });
        client.db(this.dbName).collection('User').createIndex({ futsalPlayer: 1 });
        // populate colletion class
        collection.user = client.db(this.dbName).collection('User');
        collection.player = client.db(this.dbName).collection('Player');
        collection.match = client.db(this.dbName).collection('Match');
        // make collections and client available to class
        this.client = client;
        this.collection = collection;
    }
    clearDb() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.collection.user.deleteMany({});
            yield this.collection.player.deleteMany({});
            yield this.collection.match.deleteMany({});
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