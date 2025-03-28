import { GraphQLClient, gql } from 'graphql-request';

const endpoint = (import.meta.env.GRAPHQL_API_BASE_URL as string) || '';

const client = new GraphQLClient(endpoint, {
  headers: {
    // Add any required headers, e.g., authorization
    // 'Authorization': `Bearer ${import.meta.env.GRAPHQL_API_TOKEN}`,
  },
});

// Fetch header data
export const fetchHeaderData = async () => {
  const query = gql`
    query Global {
      global {
        header {
          logo {
            url
          }
          social {
            id
            isExternal
            text
            url
            icon {
              url
            }
          }
        }
      }
    }
  `;

  return client.request(query);
};
