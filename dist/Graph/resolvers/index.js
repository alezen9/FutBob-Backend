"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("./auth"));
const resolvers = {
    Query: Object.assign({}, auth_1.default.Query),
    Mutation: Object.assign({}, auth_1.default.Mutation
    // ...parkingsResolver.Mutation,
    // ...bookingResolver.Mutation,
    // ...userResolver.Mutation,
    // ...carResolver.Mutation
    )
    // Subscription: {
    //   ...authResolver.Subscription,
    //   ...parkingsResolver.Subscription
    // }
};
exports.default = resolvers;
//# sourceMappingURL=index.js.map