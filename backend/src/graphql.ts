import { ApolloServer, gql } from 'apollo-server-lambda'

const typeDefs = gql`
    type Query {
        hello: String
    }
`

const resolvers = {
    Query: () => 'Hello world'
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

export const handler = server.createHandler()