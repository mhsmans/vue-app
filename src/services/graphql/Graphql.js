import gql from "graphql-tag";

export const ITEMS_QUERY = gql`
  query {
    nodeQuery {
      entities {
        ... on NodeTest {
          title
          body {
            value
          }
          img {
            title
            url
          }
          file {
            entity {
              filename
              url
            }
          }
          category {
            entity {
              name
            }
          }
        }
      }
    }
  }
`;
