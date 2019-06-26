import React from "react"
import { Link } from "gatsby"

import { CentralColumn } from "../components/styles"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

import WidgetBuilder from "../components/WidgetBuilder"
import WidgetList from '../components/WidgetList'

const IndexPage = () => (
  <Layout>
    <SEO title='Home' />
    <CentralColumn style={{paddingTop: '2em'}}>
      <p>Ask if you wanna win in 5 mins...</p>
      <p>Fill out the widget. Insert enywhere</p>
      <WidgetBuilder />
      <WidgetList />
    </CentralColumn>
  </Layout>
)

export default IndexPage
