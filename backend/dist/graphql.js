"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_lambda_1 = require("apollo-server-lambda");
const v4_1 = __importDefault(require("uuid/v4"));
const dynamoDB_1 = require("./dynamoDB");
const typeDefs = apollo_server_lambda_1.gql `
    type Query {
        hello: String
    }

    type Widget{
        name: String!
        widgetId: String!
        thumbsUp: Int
        thumbsDown: Int
    }

    type Mutation{
        saveWidget(name: String!): Widget
    }
`;
const resolvers = {
    Query: {
        hello: () => 'Hello world'
    },
    Mutation: {
        saveWidget: async (_, { name }) => {
            const widgetId = v4_1.default();
            const result = dynamoDB_1.updateItem({
                Key: { widgetId },
                UpdateExpression: "SET widgetId = :widgetId, widgetName = :name",
                ExpressionAttributeValues: {
                    ':widgetId': widgetId,
                    ':name': name
                }
            });
            console.log(result);
            return {
                name,
                widgetId,
                thumbsUp: 0,
                thumbsDown: 0,
            };
        }
    }
};
const server = new apollo_server_lambda_1.ApolloServer({
    typeDefs,
    resolvers
});
exports.handler = server.createHandler();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhcGhxbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9ncmFwaHFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsK0RBQXdEO0FBQ3hELGlEQUE0QjtBQUM1Qix5Q0FBd0M7QUFHeEMsTUFBTSxRQUFRLEdBQUcsMEJBQUcsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7O0NBZW5CLENBQUE7QUFFRCxNQUFNLFNBQVMsR0FBRztJQUNkLEtBQUssRUFBRTtRQUNILEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxhQUFhO0tBQzdCO0lBRUQsUUFBUSxFQUFFO1FBQ04sVUFBVSxFQUFFLEtBQUssRUFBRyxDQUFNLEVBQUUsRUFBRSxJQUFJLEVBQWtCLEVBQUcsRUFBRTtZQUNyRCxNQUFNLFFBQVEsR0FBRyxZQUFNLEVBQUUsQ0FBQTtZQUV6QixNQUFNLE1BQU0sR0FBRyxxQkFBVSxDQUFDO2dCQUN0QixHQUFHLEVBQUUsRUFBRSxRQUFRLEVBQUU7Z0JBQ2pCLGdCQUFnQixFQUNaLDhDQUE4QztnQkFDbEQseUJBQXlCLEVBQUU7b0JBQ3ZCLFdBQVcsRUFBRSxRQUFRO29CQUNyQixPQUFPLEVBQUUsSUFBSTtpQkFDaEI7YUFDSixDQUFDLENBQUE7WUFFRixPQUFPLENBQUMsR0FBRyxDQUFFLE1BQU0sQ0FBRSxDQUFBO1lBRXJCLE9BQU87Z0JBQ0gsSUFBSTtnQkFDSixRQUFRO2dCQUNSLFFBQVEsRUFBRSxDQUFDO2dCQUNYLFVBQVUsRUFBRSxDQUFDO2FBRWhCLENBQUE7UUFDTCxDQUFDO0tBQ0o7Q0FDSixDQUFBO0FBRUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxtQ0FBWSxDQUFDO0lBQzVCLFFBQVE7SUFDUixTQUFTO0NBQ1osQ0FBQyxDQUFBO0FBRVcsUUFBQSxPQUFPLEdBQUcsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFBIn0=