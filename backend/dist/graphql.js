"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_lambda_1 = require("apollo-server-lambda");
const typeDefs = apollo_server_lambda_1.gql `
    type Query {
        hello: String
    }
`;
const resolvers = {
    Query: () => 'Hello world'
};
const server = new apollo_server_lambda_1.ApolloServer({
    typeDefs,
    resolvers
});
exports.handler = server.createHandler();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhcGhxbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9ncmFwaHFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0RBQXdEO0FBRXhELE1BQU0sUUFBUSxHQUFHLDBCQUFHLENBQUE7Ozs7Q0FJbkIsQ0FBQTtBQUVELE1BQU0sU0FBUyxHQUFHO0lBQ2QsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLGFBQWE7Q0FDN0IsQ0FBQTtBQUVELE1BQU0sTUFBTSxHQUFHLElBQUksbUNBQVksQ0FBQztJQUM1QixRQUFRO0lBQ1IsU0FBUztDQUNaLENBQUMsQ0FBQTtBQUVXLFFBQUEsT0FBTyxHQUFHLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQSJ9