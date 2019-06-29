import React, { useEffect } from "react"
import { useApolloClient } from 'react-apollo-hooks'
import { CentralColumn } from "../components/styles"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

import { WIDGET_VOTE_QUERY } from '../queries'

async function saveVote({ widgetId, voteType, ApolloClient }){
    const result = await ApolloClient.mutate({
        mutation: WIDGET_VOTE_QUERY,
        variables: {
            widgetId: widgetId,
            thumbsup: voteType === 'thumbsup',
            thumbsdown: voteType === 'thumbsdown'
        }
    })
    console.log(result)
}

const VotePage = ({ pageContext }) => {
    const ApolloClient = useApolloClient()
    const { widgetId, voteType } = pageContext
    useEffect( () => {
        saveVote({ widgetId, voteType, ApolloClient })

    }, [] ) // Empty second param tels, it runs at component mount
    return (
        <Layout>
            <SEO title='Thank you' />
            <CentralColumn style={{paddingTop: '2em'}}>
            <p>Thank You!</p>
            </CentralColumn>
        </Layout>
    )
}

export default VotePage
