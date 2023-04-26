import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import Game from "../components/Game"

const IndexPage: React.FC<PageProps> = () => {
  return (
    <Game />
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>
