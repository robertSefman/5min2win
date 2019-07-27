import React, { useEffect, useState } from "react"
import { useApolloClient } from "react-apollo-hooks"
import { CentralColumn } from "../components/styles"
import { Form, Field } from "react-final-form"
import { Button } from "rebass"

// import Layout from "../components/layout"
// import Image from "../components/image"
import SEO from "../components/seo"

import { WIDGET_VOTE_QUERY, SAVE_WIDGET_FEEDBACK_QUERY } from "../queries"

async function saveVote({ widgetId, voteType, apolloClient }) {
  const result = await apolloClient.mutate({
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
    <div key={id}>
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

// Final submition method
//
// const onSubmit = async ({ widgetId, values, apolloClient }) => {
//   await apolloClient.mutate({
//     mutation: SAVE_WIDGET_FEEDBACK_QUERY,
//     variables: {
//       widgetId,
//       values: JSON.stringify(values),
//     },
//   })
// }

const VotePage = ({ pageContext }) => {
  const apolloClient = useApolloClient()
  const { widgetId, voteType, followupQuestions } = pageContext

  const [fieldIndex, setFieldIndex] = useState(0)

  useEffect(() => {
    saveVote({ widgetId, voteType, apolloClient })
  }, []) // Empty second param tels, it runs at component mount

  function onSubmit(values) {
    if (fieldIndex >= followupQuestions.length - 1) {
      console.log(values)
    } else {
      setFieldIndex(fieldIndex + 1)
    }
  }

  return (
    <>
      <SEO title="Thank you" />
      <CentralColumn style={{ paddingTop: "2em" }}>
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              {renderField(followupQuestions[fieldIndex])}
              {/* <Button type="submit">Give feedback </Button> */}
            </form>
          )}
        ></Form>
      </CentralColumn>
    </>
  )
}

export default VotePage
