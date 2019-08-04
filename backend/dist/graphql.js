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

  type Feedback {
    widgetId: String!
    voteId: String!
    voteType: String!
    answers: String!
    createdAt: String
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
    saveFeedback(
      widgetId: String!
      voteId: String!
      voteType: String!
      answers: String!
      createdAt: String
    ): Feedback
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
        },
        saveFeedback: async (_, { widgetId, voteId, voteType, answers, createdAt }) => {
            const { Attributes } = await dynamoDB_1.updateItem({
                TableName: process.env.FEEDBACKS_TABLE,
                Key: { widgetId, voteId },
                UpdateExpression: 'SET voteType = :voteType, answers = :answers, createdAt = :createdAt',
                ExpressionAttributeValues: {
                    ':voteType': voteType,
                    ':answers': answers,
                    ':createdAt': createdAt
                },
                ReturnValues: 'ALL_NEW'
            });
            return Attributes;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhcGhxbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9ncmFwaHFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsK0RBQXlEO0FBQ3pELGlEQUE2QjtBQUM3Qix5Q0FBNEQ7QUFFNUQsTUFBTSxRQUFRLEdBQUcsMEJBQUcsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0F5Q25CLENBQUM7QUFFRixNQUFNLFNBQVMsR0FBRztJQUNoQixLQUFLLEVBQUU7UUFDTCxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQU0sRUFBRSxFQUFFLFFBQVEsRUFBd0IsRUFBRSxFQUFFO1lBQzNELE1BQU0sTUFBTSxHQUFHLE1BQU0sa0JBQU8sQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUVwRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRTtnQkFDaEIsT0FBTyxFQUFFLENBQUM7YUFDWDtZQUVELE1BQU0sSUFBSSxxQkFDTCxNQUFNLENBQUMsSUFBSSxJQUNkLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FDN0IsQ0FBQztZQUVGLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUNELFNBQVMsRUFBRSxLQUFLLElBQUksRUFBRTtZQUNwQixNQUFNLE1BQU0sR0FBRyxNQUFNLG9CQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDbkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUU7Z0JBQ2pCLE9BQU8sRUFBRSxDQUFDO2FBQ1g7WUFDRCxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsbUJBQzdCLE1BQU0sSUFDVCxJQUFJLEVBQUUsTUFBTSxDQUFDLFVBQVUsSUFDdkIsQ0FBQyxDQUFDO1FBQ04sQ0FBQztLQUNGO0lBRUQsUUFBUSxFQUFFO1FBQ1IsVUFBVSxFQUFFLEtB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