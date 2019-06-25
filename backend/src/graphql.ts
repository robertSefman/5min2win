import { ApolloServer, gql } from 'apollo-server-lambda'
import uuidv4 from 'uuid/v4'
import { updateItem } from './dynamoDB';


const typeDefs = gql`
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
`

const resolvers = {
    Query: {
        hello: () => 'Hello world'
    },

    Mutation: {
        saveWidget: async ( _: any, { name }: {name: string} ) => {
            const widgetId = uuidv4()

            const result = await updateItem({
                Key: { widgetId },
                UpdateExpression: 
                    "SET widgetId = :widgetId, widgetName = :name",
                ExpressionAttributeValues: {
                    ':widgetId': widgetId,
                    ':name': name
                }
            })

            console.log( result )

            return {
                name,
                widgetId,
                thumbsUp: 0,
                thumbsDown: 0,

            }
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

export const handler = server.createHandler()