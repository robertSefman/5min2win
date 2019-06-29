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
        thumbsup: Int
        thumbsdown: Int
    }
    type Query {
        widget(widgetId: String!): Widget
        allWidget: [Widget]
    }
    type Mutation {
        saveWidget(name: String!, widgetId: String): Widget
        widgetVote( widgetId: String!, thumbsup: Boolean, thumbsdown: Boolean ): Widget
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
                UpdateExpression: "SET widgetName = :name, thumbsup = :thumbsup, thumbsdown = :thumbsdown",
                ExpressionAttributeValues: {
                    ":name": name,
                    ":thumbsup": 0,
                    ":thumbsdown": 0,
                }
            });
            console.log(result);
            return {
                name,
                widgetId,
                thumbsup: 0,
                thumbsdown: 0,
            };
        },
        widgetVote: async (_, { widgetId, thumbsup = false, thumbsdown = false }) => {
            const { Attributes } = await dynamoDB_1.updateItem({
                Key: { widgetId },
                UpdateExpression: "SET thumbsup = thumbsup + :thumbsup, thumbsdown = thumbsdown + :thumbsdown",
                ExpressionAttributeValues: {
                    ":thumbsup": thumbsup ? 1 : 0,
                    ":thumbsdown": thumbsdown ? 1 : 0
                },
                ReturnValues: 'ALL_NEW'
            });
            return Object.assign({}, Attributes, { name: Attributes && Attributes.widgetName });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhcGhxbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9ncmFwaHFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsK0RBQXdEO0FBQ3hELGlEQUE0QjtBQUM1Qix5Q0FBNEQ7QUFHNUQsTUFBTSxRQUFRLEdBQUcsMEJBQUcsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7O0NBZW5CLENBQUE7QUFFRCxNQUFNLFNBQVMsR0FBRztJQUNkLEtBQUssRUFBRTtRQUNILE1BQU0sRUFBRSxLQUFLLEVBQUcsQ0FBTSxFQUFFLEVBQUUsUUFBUSxFQUFzQixFQUFFLEVBQUU7WUFDeEQsTUFBTSxNQUFNLEdBQUcsTUFBTSxrQkFBTyxDQUN2QixFQUFFLEdBQUcsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFDLENBQ3hCLENBQUE7WUFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRTtnQkFDZCxPQUFPLEVBQUUsQ0FBQTthQUNaO1lBRUQsTUFBTSxJQUFJLHFCQUNILE1BQU0sQ0FBQyxJQUFJLElBQ2QsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUMvQixDQUFBO1lBRUQsT0FBTyxJQUFJLENBQUE7UUFDZixDQUFDO1FBQ0QsU0FBUyxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ2xCLE1BQU0sTUFBTSxHQUFHLE1BQU0sb0JBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUNsQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRTtnQkFDZixPQUFPLEVBQUUsQ0FBQTthQUNaO1lBQ0QsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUEsRUFBRSxDQUFDLG1CQUFLLE1BQU0sSUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLFVBQVUsSUFBRSxDQUFDLENBQUE7UUFDNUUsQ0FBQztLQUNKO0lBRUQsUUFBUSxFQUFFO1FBQ04sVUFBVSxFQUFFLEtBQUssRUFDWixDQUFNLEVBQ1AsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUF1QyxFQUN6RCxFQUFFO1lBQ0EsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDWCxRQUFRLEdBQUcsWUFBTSxFQUFFLENBQUE7YUFDdEI7WUFFRCxNQUFNLE1BQU0sR0FBRyxNQUFNLHFCQUFVLENBQUM7Z0JBQzVCLEdBQUcsRUFBRSxFQUFFLFFBQVEsRUFBRTtnQkFDakIsZ0JBQWdCLEVBQ1osd0VBQXdFO2dCQUM1RSx5QkFBeUIsRUFBRTtvQkFDdkIsT0FBTyxFQUFFLElBQUk7b0JBQ2IsV0FBVyxFQUFFLENBQUM7b0JBQ2QsYUFBYSxFQUFFLENBQUM7aUJBQ25CO2FBQ0osQ0FBQyxDQUFBO1lBRUYsT0FBTyxDQUFDLEdBQUcsQ0FBRSxNQUFNLENBQUUsQ0FBQTtZQUVyQixPQUFPO2dCQUNILElBQUk7Z0JBQ0osUUFBUTtnQkFDUixRQUFRLEVBQUUsQ0FBQztnQkFDWCxVQUFVLEVBQUUsQ0FBQzthQUVoQixDQUFBO1FBQ0wsQ0FBQztRQUNELFVBQVUsRUFBRSxLQUFLLEVBQ2IsQ0FBTSxFQUNOLEVBQ0ksUUFBUSxFQUNSLFFBQVEsR0FBRyxLQUFLLEVBQ2hCLFVBQVUsR0FBRyxLQUFLLEVBQzJDLEVBQ25FLEVBQUU7WUFFQSxNQUFNLEVBQUUsVUFBVSxFQUFFLEdBQUcsTUFBTSxxQkFBVSxDQUFDO2dCQUNwQyxHQUFHLEVBQUUsRUFBRSxRQUFRLEVBQUU7Z0JBQ2pCLGdCQUFnQixFQUNaLDRFQUE0RTtnQkFDaEYseUJBQXlCLEVBQUU7b0JBQ3ZCLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDN0IsYUFBYSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNwQztnQkFDRCxZQUFZLEVBQUUsU0FBUzthQUUxQixDQUFDLENBQUE7WUFFRix5QkFDTyxVQUFVLElBQ2IsSUFBSSxFQUFFLFVBQVUsSUFBSSxVQUFVLENBQUMsVUFBVSxJQUM1QztRQUNMLENBQUM7S0FDSjtDQUNKLENBQUE7QUFFRCxNQUFNLE1BQU0sR0FBRyxJQUFJLG1DQUFZLENBQUM7SUFDNUIsUUFBUTtJQUNSLFNBQVM7Q0FDWixDQUFDLENBQUE7QUFFVyxRQUFBLE9BQU8sR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDO0lBQ3hDLElBQUksRUFBQztRQUNELE1BQU0sRUFBRSxHQUFHO1FBQ1gsV0FBVyxFQUFFLElBQUk7S0FDcEI7Q0FDSixDQUFDLENBQUEifQ==