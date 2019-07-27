import React, { useEffect, useState } from "react"
import { useApolloClient } from "react-apollo-hooks"
// import { CentralColumn } from "../components/styles"
import { Form, Field } from "react-final-form"
import { Button, Heading, Text, Box } from "rebass"
import styled from "styled-components"
import { fontSize, lineHeight, fontFamily } from "styled-system"

// import Layout from "../components/layout"
// import Image from "../components/image"
import SEO from "../components/seo"

import { WIDGET_VOTE_QUERY, SAVE_WIDGET_FEEDBACK_QUERY } from "../queries"

const FullScreen = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  align-items: center;
  min-height: 100vh;
  text-align: center;
`

const InputBox = styled(Box)`
  height: 60px;
`

const Input = styled("input")(
  {
    padding: "0.5rem 1rem",
    width: "80%",
    marginBottom: "14px",
  },
  fontSize,
  lineHeight,
  fontFamily
)

const ExplainerText = styled(Text)`
  width: 80%;
  text-align: left;
  display: inline-block;
  position: ralative;
  top: -14px;
`
const BulletText = styled(Text)`
  display: inline;
`

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

const InputComponent = props => (
  <InputBox>
    <BulletText>{props.index + 1}. 👉</BulletText>
    <Input
      fontSize={[3, 4, 5]}
      placeholder="Listen to your gut :)"
      autoComplete="off"
      {...props.input}
    />
    {props.meta.active ? (
      <ExplainerText
        fontSize={[0.5, 1, 1]}
        style={{ textAlign: "left", color: "gray" }}
      >
        <strong>Enter</strong> to submit
      </ExplainerText>
    ) : null}
  </InputBox>
)

function renderField({ index, id, label, type }) {
  return (
    <div key={id}>
      <Heading fontSize={[3, 4, 5]}>
        <label>{label}</label>
      </Heading>
      <br />
      <Box>
        <Field
          name={`field_${id}`}
          component={InputComponent}
          type="text"
          initialValue=""
          index={index}
        />
      </Box>
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
    <FullScreen>
      <SEO title="Thank you" />
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            {renderField({
              index: fieldIndex,
              ...followupQuestions[fieldIndex],
            })}
            {/* <Button type="submit">Give feedback </Button> */}
          </form>
        )}
      ></Form>
    </FullScreen>
  )
}

export default VotePage
