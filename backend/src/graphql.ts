import { ApolloServer, gql } from 'apollo-server-lambda'
import uuidv4 from 'uuid/v4'
import { updateItem, getItem, scanItems } from './dynamoDB';


const typeDefs = gql`
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
        widgetVote(
            widgetId: String!
            thumbsUp: Boolean
            thumbsDown: Boolean
        ): Widget
    }
`

const resolvers = {
    Query: {
        widget: async ( _: any, { widgetId }: {widgetId: string}) => {
            const result = await getItem(
                 { Key: { widgetId }} 
            )

            if( !result.Item ){
                return {}
            }

            const item = {
                ...result.Item,
                name: result.Item.widgetName
            }

            return item
        },
        allWidget: async () => {
            const result = await scanItems({})
            if( !result.Items ){
                return []
            }
            return result.Items.map(widget=> ({...widget, name: widget.widgetName}))
        }
    },

    Mutation: {
        saveWidget: async (
             _: any,
            { name, widgetId }: { name: string, widgetId?: string } 
        ) => {
            if( !widgetId ){
                widgetId = uuidv4()
            }

            const result = await updateItem({
                Key: { widgetId },
                UpdateExpression: 
                    "SET widgetName = :name, thumbsUp = :thumbsUp, thumbsDown = :thumbsDown",
                ExpressionAttributeValues: {
                    ":name": name,
                    ":thumbsUp": 0,
                    ":thumbsDown": 0,
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