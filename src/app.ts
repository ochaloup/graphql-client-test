import { request, gql } from 'graphql-request'

const GRAPHQL_URL = "http://localhost:9988/___graphql?";

const query = gql`
{
  allAsciidoc(
    sort: { fields: [revision___date], order: DESC }
    filter: { pageAttributes: { published: { eq: "true" } } }
  ) {
    edges {
      node {
        id
        document {
          title
        }
        revision {
          date
        }
      }
    }
  }
}
`

request(GRAPHQL_URL, query).then((data) => console.log(data))