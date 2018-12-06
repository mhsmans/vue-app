import gql from "graphql-tag";

// Specify amount of content fetched from drupal in 'limit'. 
export const ITEMS_QUERY = gql`
  query {
    nodeQuery(limit: 5, sort: [{field: "created" direction: DESC}]) {
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
          entityOwner {
            name
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
