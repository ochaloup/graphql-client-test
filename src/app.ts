import { request, gql } from 'graphql-request'

const GRAPHQL_URL = "http://localhost:9988/___graphql?";

interface QueryResult {
  allAsciidoc: {
    edges?: Array<Edge>
  }
}

interface Edge {
  node: Node
}

interface Node {
  id?: string
  // frontmatter?: Frontmatter;  TODO: DELETEME!
  revision?: Revision
  document?: Document
  pageAttributes?: PageAttributes
}

interface Revision {
  date?: string
  number?: string
}

interface Document {
  title?: string
}

interface PageAttributes {
  category?: string
  tags?: Array<string>
}

const query = gql`
{
  allAsciidoc(
    sort: { fields: [revision___date], order: DESC }
    filter: { pageAttributes: { published: { eq: "true" } } }
  ) {
    edges {
      node {
        pageAttributes {
		      category
          tags
        }
      }
    }
  }
}
`

request(GRAPHQL_URL, query).then((data: QueryResult) => {
  data?.allAsciidoc?.edges?.map((e: Edge, i) => e.node.pageAttributes?.tags)
    .flatMap(t => { console.log(`${typeof t}`); return t.flatMap(gg => gg.split(","))})
    .forEach(ii => {console.log(ii)});
  
  // forEach((e: Edge) =>  {
  //   console.log(">>>")
  //   console.log(e.node.pageAttributes?.tags)
  // })
})