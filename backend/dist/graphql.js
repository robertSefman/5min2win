"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_lambda_1 = require("apollo-server-lambda");
const v4_1 = __importDefault(require("uuid/v4"));
const dynamoDB_1 = require("./dynamoDB");
const typeDefs = apollo_server_lambda_1.gql `
    type Widget {
        name: String!
        widgetId: String!
        thumbsUp: Int
        thumbsDown: Int
    }
    type Query {
        widget(widgetId: String!): Widget
        allWidget: [Widget]
    }
    type Mutation {
        saveWidget(name: String!, widgetId: String): Widget
    }
`;
const resolvers = {
    Query: {
        widget: async (_, { widgetId }) => {
            const result = await dynamoDB_1.getItem({ Key: { widgetId } });
            if (!result.Item) {
                return {};
            }
            const item = Object.assign({}, result.Item, { name: result.Item.widgetName });
            return item;
        },
        allWidget: async () => {
            const result = await dynamoDB_1.scanItems({});
            if (!result.Items) {
                return [];
            }
            return result.Items.map(widget => (Object.assign({}, widget, { name: widget.widgetName })));
        }
    },
    Mutation: {
        saveWidget: async (_, { name, widgetId }) => {
            if (!widgetId) {
                widgetId = v4_1.default();
            }
            const result = await dynamoDB_1.updateItem({
                Key: { widgetId },
                UpdateExpression: "SET widgetName = :name, thumbsUp = :thumbsUp, thumbsDown = :thumbsDown",
                ExpressionAttributeValues: {
                    ":name": name,
                    ":thumbsUp": 0,
                    ":thumbsDown": 0,
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
exports.handler = server.createHandler({
    cors: {
        origin: '*',
        credentials: true,
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhcGhxbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9ncmFwaHFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsK0RBQXdEO0FBQ3hELGlEQUE0QjtBQUM1Qix5Q0FBNEQ7QUFHNUQsTUFBTSxRQUFRLEdBQUcsMEJBQUcsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Q0FjbkIsQ0FBQTtBQUVELE1BQU0sU0FBUyxHQUFHO0lBQ2QsS0FBSyxFQUFFO1FBQ0gsTUFBTSxFQUFFLEtBQUssRUFBRyxDQUFNLEVBQUUsRUFBRSxRQUFRLEVBQXNCLEVBQUUsRUFBRTtZQUN4RCxNQUFNLE1BQU0sR0FBRyxNQUFNLGtCQUFPLENBQ3ZCLEVBQUUsR0FBRyxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUMsQ0FDeEIsQ0FBQTtZQUVELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO2dCQUNkLE9BQU8sRUFBRSxDQUFBO2FBQ1o7WUFFRCxNQUFNLElBQUkscUJBQ0gsTUFBTSxDQUFDLElBQUksSUFDZCxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQy9CLENBQUE7WUFFRCxPQUFPLElBQUksQ0FBQTtRQUNmLENBQUM7UUFDRCxTQUFTLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDbEIsTUFBTSxNQUFNLEdBQUcsTUFBTSxvQkFBUyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQ2xDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFO2dCQUNmLE9BQU8sRUFBRSxDQUFBO2FBQ1o7WUFDRCxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQSxFQUFFLENBQUMsbUJBQUssTUFBTSxJQUFFLElBQUksRUFBRSxNQUFNLENBQUMsVUFBVSxJQUFFLENBQUMsQ0FBQTtRQUM1RSxDQUFDO0tBQ0o7SUFFRCxRQUFRLEVBQUU7UUFDTixVQUFVLEVBQUUsS0FBSyxFQUNaLENBQU0sRUFDUCxFQUFFLElBQUksRUFBRSxRQUFRLEVBQXVDLEVBQ3pELEVBQUU7WUFDQSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNYLFFBQVEsR0FBRyxZQUFNLEVBQUUsQ0FBQTthQUN0QjtZQUVELE1BQU0sTUFBTSxHQUFHLE1BQU0scUJBQVUsQ0FBQztnQkFDNUIsR0FBRyxFQUFFLEVBQUUsUUFBUSxFQUFFO2dCQUNqQixnQkFBZ0IsRUFDWix3RUFBd0U7Z0JBQzVFLHlCQUF5QixFQUFFO29CQUN2QixPQUFPLEVBQUUsSUFBSTtvQkFDYixXQUFXLEVBQUUsQ0FBQztvQkFDZCxhQUFhLEVBQUUsQ0FBQztpQkFDbkI7YUFDSixDQUFDLENBQUE7WUFFRixPQUFPLENBQUMsR0FBRyxDQUFFLE1BQU0sQ0FBRSxDQUFBO1lBRXJCLE9BQU87Z0JBQ0gsSUFBSTtnQkFDSixRQUFRO2dCQUNSLFFBQVEsRUFBRSxDQUFDO2dCQUNYLFVBQVUsRUFBRSxDQUFDO2FBRWhCLENBQUE7UUFDTCxDQUFDO0tBQ0o7Q0FDSixDQUFBO0FBRUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxtQ0FBWSxDQUFDO0lBQzVCLFFBQVE7SUFDUixTQUFTO0NBQ1osQ0FBQyxDQUFBO0FBRVcsUUFBQSxPQUFPLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQztJQUN4QyxJQUFJLEVBQUM7UUFDRCxNQUFNLEVBQUUsR0FBRztRQUNYLFdBQVcsRUFBRSxJQUFJO0tBQ3BCO0NBQ0osQ0FBQyxDQUFBIn0=