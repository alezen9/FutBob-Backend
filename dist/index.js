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
const MongoDB_1 = require("./MongoDB");
const schema_1 = __importDefault(require("./Graph/schema"));
const resolvers_1 = __importDefault(require("./Graph/resolvers"));
const isAuth_1 = __importDefault(require("./Middleware/isAuth"));
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const shell = require('shelljs');
require('dotenv').config();
const { ApolloServer, PubSub } = require('apollo-server-express');
const app = express_1.default();
// app.use(cors())
app.use(isAuth_1.default);
const pubsub = new PubSub();
const server = new ApolloServer({
    typeDefs: schema_1.default,
    resolvers: resolvers_1.default,
    introspection: true,
    context: ({ req, res }) => ({ req, res, pubsub }),
    playground: {
        settings: {
            'editor.theme': 'dark'
        }
    }
});
server.applyMiddleware({ app });
const httpServer = http_1.default.createServer(app);
server.installSubscriptionHandlers(httpServer);
const port = process.env.PORT || 7000;
const setupAndStartServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield MongoDB_1.MongoDBInstance.startConnection();
        httpServer.listen(port);
        console.log(`connected to DB, listening on port ${port}`);
    }
    catch (error) {
        console.log(error);
        yield MongoDB_1.MongoDBInstance.closeConnection();
    }
});
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('\nGracefully shutting down and cleaning mess...');
    if (process.env.NODE_ENV !== 'production') {
        yield MongoDB_1.MongoDBInstance.closeConnection();
        shell.exec('lsof -ti tcp:27017 | xargs kill');
    }
    process.exit();
}));
setupAndStartServer();
//# sourceMappingURL=index.js.map