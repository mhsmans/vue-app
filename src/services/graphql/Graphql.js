import gql from "graphql-tag";

export const ITEMS_QUERY = gql`
  query {
    nodeQuery(sort: [{field: "created" direction: DESC}]) {
      entities {
        ... on NodeTest {
          title
          nid
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

export const CATEGORIES_QUERY = gql`
  query {
    taxonomyTermQuery {
      entities {
        ... on TaxonomyTermCategory {
          name
          tid
        }
      }
    }
  }
`;
