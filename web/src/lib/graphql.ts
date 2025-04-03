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
        images {
          url
        }
        title
        likeCounts
        commentCount
      }
    }
  `;

  return client.request(query, { filters, pagination, sort });
};

// Fetch post details
export const fetchPostDetails = async (documentId: string, visitorId: string) => {
  const query = gql`
    query Post($documentId: ID!, $visitorId: String!) {
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
        video {
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
        isLiked(visitorId: $visitorId)
      }
    }
  `;

  return client.request(query, { documentId, visitorId });
};

// Fetch about page data
export const fetchAboutPageData = async () => {
  const query = gql`
    query AboutUs {
      aboutUs {
        Heading
        HeroImage {
          url
        }
        HeroVideo {
          url
        }
        YouTubeLink
      }
    }
  `;

  return client.request(query);
};

// Fetch contact page data
export const fetchContactPageData = async () => {
  const query = gql`
    query Contact {
      contact {
        Heading
        HeroImage {
          url
        }
        HeroVideo {
          url
        }
      }
    }
  `;

  return client.request(query);
};

// Mutation to toggle like
export const toggleLike = async (blog: string, visitorId: string) => {
  const mutation = gql`
    mutation ToggleLike($blog: ID!, $visitorId: String!) {
      toggleLike(blog: $blog, visitorId: $visitorId) {
        action
      }
    }
  `;

  return client.request(mutation, { blog, visitorId });
};

// Mutation to add a comment
export const addComment = async (blog: string, email: string, comment: string, user: string) => {
  const mutation = gql`
    mutation AddComment($blog: ID!, $email: String!, $comment: String!, $user: String!) {
      addComment(blog: $blog, email: $email, comment: $comment, user: $user) {
        id
        comment
        user
      }
    }
  `;

  return client.request(mutation, { blog, email, comment, user });
};

// Mutation to submit contact us form
export const createForm = async (data: any) => {
  const mutation = gql`
    mutation CreateForm($data: FormInput!) {
      createForm(data: $data) {
        documentId
      }
    }
  `;

  return client.request(mutation, { data });
};
