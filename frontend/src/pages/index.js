import React from "react"
import { Button } from "rebass"
//import { Link } from "gatsby"

import { CentralColumn } from "../components/styles"

import Layout from "../components/layout"
//import Image from "../components/image"
import SEO from "../components/seo"
import Auth from "../auth"

import WidgetBuilder from "../components/WidgetBuilder"
import WidgetList from "../components/WidgetList"

const auth = new Auth()

// Move to actual component
const Login = () => {
  const { isAuthenticated } = auth

  if (isAuthenticated()) {
    return <Button onClick={auth.logout}>Logout {auth.getUserName()}</Button>
  } else {
    return <Button onClick={auth.login}>Login</Button>
  }
}

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <CentralColumn style={{ paddingTop: "2em" }}>
      <p>Ask if you wanna win in 5 mins...</p>
      <p>Fill out the widget. Insert enywhere</p>
      <Login />
      {auth.isAuthenticated() ? (
        <>
          <WidgetBuilder />
          <WidgetList />
        </>
      ) : null}
    </CentralColumn>
  </Layout>
)

export default IndexPage
