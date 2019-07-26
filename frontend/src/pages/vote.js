import React, { useEffect } from "react"
import { useApolloClient } from "react-apollo-hooks"
import { CentralColumn } from "../components/styles"
import { Form, Field } from "react-final-form"
import { Button } from "rebass"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

import { WIDGET_VOTE_QUERY } from "../queries"

async function saveVote({ widgetId, voteType, ApolloClient }) {
  const result = await ApolloClient.mutate({
    mutation: WIDGET_VOTE_QUERY,
    variables: {
      widgetId: widgetId,
      thumbsup: voteType === "thumbsup",
      thumbsdown: voteType === "thumbsdown",
    },
  })
}

function renderField({ id, label, type }) {
  return (
    <div>
      <label>{label}</label>
      <br />
      <Field
        name={`field_${id}`}
        component="input"
        type="text"
        initialValue=""
        placeholder="aa"
      />
    </div>
  )
}

const onSubmit = async values => {
  window.alert(JSON.stringify(values, 0, 2))
}

const VotePage = ({ pageContext }) => {
  const ApolloClient = useApolloClient()
  const { widgetId, voteType, followupQuestions } = pageContext

  useEffect(() => {
    saveVote({ widgetId, voteType, ApolloClient })
  }, []) // Empty second param tels, it runs at component mount

  return (
    <Layout>
      <SEO title="Thank you" />
      <CentralColumn style={{ paddingTop: "2em" }}>
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              {followupQuestions.map(renderField)}
              <Button type="submit">Give feedback </Button>
            </form>
          )}
        ></Form>
      </CentralColumn>
    </Layout>
  )
}

export default VotePage
