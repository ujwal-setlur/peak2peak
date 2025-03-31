import { GraphQLClient, gql } from 'graphql-request';

const endpoint = (import.meta.env.PUBLIC_GRAPHQL_API_BASE_URL as string) || '';

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

// Fetch home data
export const fetchHomeData = async () => {
  const query = gql`
    query HomePage {
      homePage {
        Image {
          url
        }
        HeroSection {
          ... on ComponentBlocksHeroSection {
            logo {
              image {
                url
              }
              logText
            }
            ProfileDetails {
              Name
              ProfileTitle
              ProfilePIcture {
                url
              }
            }
            heading
            title
            description
            longDescription
          }
        }
        blogs {
          Name
          icon {
            url
          }
          slug
          postCount
        }
      }
    }
  `;

  return client.request(query);
};

// Fetch posts
export const fetchPosts = async (filters: any, pagination: any, sort: any) => {
  const query = gql`
    query Posts($filters: PostFiltersInput, $pagination: PaginationArg, $sort: [String]) {
      posts(filters: $filters, pagination: $pagination, sort: $sort) {
        documentId
        blog {
          slug
        }
        thumbNail {
          url
        }
        title
      }
    }
  `;

  return client.request(query, { filters, pagination, sort });
};

// Fetch post details
export const fetchPostDetails = async (documentId: string) => {
  const query = gql`
    query Post($documentId: ID!) {
      post(documentId: $documentId) {
        blog {
          Name
          slug
          icon {
            url
          }
        }
        createdAt
        images {
          url
        }
        thumbNail {
          url
        }
        title
        documentId
        comments {
          comment
          createdAt
          email
          user
        }
        description
        allowComments
        commentCount
        likeCounts
      }
    }
  `;

  return client.request(query, { documentId });
};
