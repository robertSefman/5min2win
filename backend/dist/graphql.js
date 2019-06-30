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
    followupQuestions: String
  }
  type Query {
    widget(widgetId: String!): Widget
    allWidget: [Widget]
  }
  type Mutation {
    saveWidget(
      name: String!
      widgetId: String
      followupQuestions: String
    ): Widget
    widgetVote(
      widgetId: String!
      thumbsup: Boolean
      thumbsdown: Boolean
    ): Widget
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
        saveWidget: async (_, { name, widgetId, followupQuestions }) => {
            if (!widgetId) {
                widgetId = v4_1.default();
            }
            const result = await dynamoDB_1.updateItem({
                Key: { widgetId },
                UpdateExpression: 'SET widgetName = :name, thumbsup = :thumbsup, thumbsdown = :thumbsdown, followupQuestions = :followupQuestions',
                ExpressionAttributeValues: {
                    ':name': name,
                    ':followupQuestions': followupQuestions,
                    ':thumbsup': 0,
                    ':thumbsdown': 0
                }
            });
            console.log(result);
            return {
                name,
                followupQuestions,
                widgetId,
                thumbsup: 0,
                thumbsdown: 0
            };
        },
        widgetVote: async (_, { widgetId, thumbsup = false, thumbsdown = false }) => {
            const { Attributes } = await dynamoDB_1.updateItem({
                Key: { widgetId },
                UpdateExpression: 'SET thumbsup = thumbsup + :thumbsup, thumbsdown = thumbsdown + :thumbsdown',
                ExpressionAttributeValues: {
                    ':thumbsup': thumbsup ? 1 : 0,
                    ':thumbsdown': thumbsdown ? 1 : 0
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
        credentials: true
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhcGhxbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9ncmFwaHFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsK0RBQXlEO0FBQ3pELGlEQUE2QjtBQUM3Qix5Q0FBNEQ7QUFFNUQsTUFBTSxRQUFRLEdBQUcsMEJBQUcsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBd0JuQixDQUFDO0FBRUYsTUFBTSxTQUFTLEdBQUc7SUFDaEIsS0FBSyxFQUFFO1FBQ0wsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFNLEVBQUUsRUFBRSxRQUFRLEVBQXdCLEVBQUUsRUFBRTtZQUMzRCxNQUFNLE1BQU0sR0FBRyxNQUFNLGtCQUFPLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFcEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7Z0JBQ2hCLE9BQU8sRUFBRSxDQUFDO2FBQ1g7WUFFRCxNQUFNLElBQUkscUJBQ0wsTUFBTSxDQUFDLElBQUksSUFDZCxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQzdCLENBQUM7WUFFRixPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFDRCxTQUFTLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDcEIsTUFBTSxNQUFNLEdBQUcsTUFBTSxvQkFBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ25DLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFO2dCQUNqQixPQUFPLEVBQUUsQ0FBQzthQUNYO1lBQ0QsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLG1CQUM3QixNQUFNLElBQ1QsSUFBSSxFQUFFLE1BQU0sQ0FBQyxVQUFVLElBQ3ZCLENBQUMsQ0FBQztRQUNOLENBQUM7S0FDRjtJQUVELFFBQVEsRUFBRTtRQUNSLFVBQVUsRUFBRSxLQUFLLEVBQ2YsQ0FBTSxFQUNOLEVBQ0UsSUFBSSxFQUNKLFFBQVEsRUFDUixpQkFBaUIsRUFDK0MsRUFDbEUsRUFBRTtZQUNGLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2IsUUFBUSxHQUFHLFlBQU0sRUFBRSxDQUFDO2FBQ3JCO1lBRUQsTUFBTSxNQUFNLEdBQUcsTUFBTSxxQkFBVSxDQUFDO2dCQUM5QixHQUFHLEVBQUUsRUFBRSxRQUFRLEVBQUU7Z0JBQ2pCLGdCQUFnQixFQUNkLGdIQUFnSDtnQkFDbEgseUJBQXlCLEVBQUU7b0JBQ3pCLE9BQU8sRUFBRSxJQUFJO29CQUNiLG9CQUFvQixFQUFFLGlCQUFpQjtvQkFDdkMsV0FBVyxFQUFFLENBQUM7b0JBQ2QsYUFBYSxFQUFFLENBQUM7aUJBQ2pCO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUVwQixPQUFPO2dCQUNMLElBQUk7Z0JBQ0osaUJBQWlCO2dCQUNqQixRQUFRO2dCQUNSLFFBQVEsRUFBRSxDQUFDO2dCQUNYLFVBQVUsRUFBRSxDQUFDO2FBQ2QsQ0FBQztRQUNKLENBQUM7UUFDRCxVQUFVLEVBQUUsS0FBSyxFQUNmLENBQU0sRUFDTixFQUNFLFFBQVEsRUFDUixRQUFRLEdBQUcsS0FBSyxFQUNoQixVQUFVLEdBQUcsS0FBSyxFQUM2QyxFQUNqRSxFQUFFO1lBQ0YsTUFBTSxFQUFFLFVBQVUsRUFBRSxHQUFHLE1BQU0scUJBQVUsQ0FBQztnQkFDdEMsR0FBRyxFQUFFLEVBQUUsUUFBUSxFQUFFO2dCQUNqQixnQkFBZ0IsRUFDZCw0RUFBNEU7Z0JBQzlFLHlCQUF5QixFQUFFO29CQUN6QixXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzdCLGFBQWEsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDbEM7Z0JBQ0QsWUFBWSxFQUFFLFNBQVM7YUFDeEIsQ0FBQyxDQUFDO1lBRUgseUJBQ0ssVUFBVSxJQUNiLElBQUksRUFBRSxVQUFVLElBQUksVUFBVSxDQUFDLFVBQVUsSUFDekM7UUFDSixDQUFDO0tBQ0Y7Q0FDRixDQUFDO0FBRUYsTUFBTSxNQUFNLEdBQUcsSUFBSSxtQ0FBWSxDQUFDO0lBQzlCLFFBQVE7SUFDUixTQUFTO0NBQ1YsQ0FBQyxDQUFDO0FBRVUsUUFBQSxPQUFPLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQztJQUMxQyxJQUFJLEVBQUU7UUFDSixNQUFNLEVBQUUsR0FBRztRQUNYLFdBQVcsRUFBRSxJQUFJO0tBQ2xCO0NBQ0YsQ0FBQyxDQUFDIn0=