# FutBob
## Description
> A platform that helps people manage futsal matches between friends and maybe more.

&nbsp;
&nbsp;
## Tech stack
- Node js + express + Typescript
- MongoDB Atlas
=> Database (currently sandbox with 500mb)
- TypeGraphQL + Apollo + Class validator
=> API, resolvers and validation
- Nodemailer
=> Mailing service (confirm email, reset password)
- Mocha
=> Testsuite

&nbsp;
&nbsp;
## Structure

#### Starting point
[index.ts](./index.ts) is the starting point

1. NodemailerInstance is started (from the Nodemailer/index.ts file)
2. MongoDB instance is started
3. express server gets created
4. isAuth middleware is applied
=> checks and decodes token adding auth info to the request object
5. GraphQl schema is being created
=> Dates are handled as isoDates
6. Apollo server is gets created wrapping the express server
7. Apollo server is started
8. if something goes wrong everything is celaned up and shut down

&nbsp;
&nbsp;
### Modules
| Module | Readme |
| -------- | ------------------- |
| Auth | [Readme.md](./src/MongoDB/User/Readme.md#authentication) |
| User | [Readme.md](./src/MongoDB/User/Readme.md#description) |
| Player | [Readme.md](./src/MongoDB/Player/Readme.md#description) |
| Free agent | [Readme.md](./src/MongoDB/FreeAgent/Readme.md#description) |
| Field | [Readme.md](./src/MongoDB/Field/Readme.md#description) |

&nbsp;
&nbsp;

Modules have very similar structure if not equal and each __Module__ is composed by:
> note: the User module is taken as an example

&nbsp;
&nbsp;

- MongoDB  
-- A __MongoDB{Module}__ instance, that handles server-database interaction for that module  
=> eg: [MongoUser](src/MongoDB/User/index.ts) (index/Entities/helpers)  
=> __index__ the main class with all the functions and interactions with the database, exports an instance  
=> __Entities__ is where the types are
=> The above entities can be used for the GraphQL schema by using TypeGraphQL decorators  
=> __helpers__ every helper function specific to that module


- Graph  
-- A __{Module}Resolver__, basically the apis  
=> eg: [UserResolver](src/Graph/User/index.ts) (index/inputs/Loader/FieldResolver)  
=> __index__ the main class with the actual apis decorated with priviledge and type, exports an instance  
=> __inputs__ similar to the entities in the MongoDB directory, it contains the types of the inputs for the apis  
=> __Loader__ it's optional and it's a data-loader instance specific for that module that caches responses for same requests  
=> __FieldResolver__ a directory that contains the resolvers for specifi fields inside that module  

- SDK  
-- A module in the SDK/Modules folder  
=> eg: [UserServer](src/SDK/Modules/User/index.ts)  
=> it wraps the api in a more usable way  

- Testsuite  
-- A __{Module}.test.ts__ in the Testsuite directory that contains the testsuite for that specific module  
=> eg: [AuthUser.test.ts](src/Testsuite/AuthUser.test.ts)  
-- once the testsuite for the module is done, a step in [setupTestsuite](src/Testsuite/helpers/index.ts) has to be created (for future use) that creates records for that module  
-- mock data can be added as Testsuite/helpers/MockData/{module.ts}  
=> eg: [managers.ts](src/Testsuite/helpers/MockData/managers.ts)




