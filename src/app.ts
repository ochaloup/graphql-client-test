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
  tags?: string
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
  const countedTags = data?.allAsciidoc?.edges?.flatMap(
      (e: Edge, i) => e.node.pageAttributes?.tags?.split(",").map(t => t.trim())
    )
    .reduce((map, value, index, array) => {
      if (value === undefined) return map;
      return map.set(value, (map.get(value) || 0) + 1);
    }, new Map<string, number>());
  console.log(">>> ", countedTags);
})
