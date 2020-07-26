"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInput = exports.SignupInput = exports.SigninInput = void 0;
exports.SigninInput = `input SigninInput {
    username: String!,
    password: String!
  }`;
exports.SignupInput = `input SignupInput {
    name: String!,
    surname: String!,
    dateOfBirth: String!,
    phone: String!,
    email: String,
    sex: Int!,
    username: String!,
    password: String!
  }`;
exports.UserInput = `input UserInput {
    name: String,
    surname: String,
    dateOfBirth: String,
    phone: String,
    email: String,
    sex: Int,
}`;
//# sourceMappingURL=inputs.js.map