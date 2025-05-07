import { GraphQLClient, gql } from 'graphql-request';

type ContactFormData = {
  Name: string;
  Email: string;
  Message: string;
};

const endpoint =
  (import.meta.env.PUBLIC_GRAPHQL_API_BASE_URL as string) ||
  'https://steadfast-advice-fa34b24fc0.strapiapp.com/graphql';

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
        Header {
          Logo {
            url
          }
          Social {
            Icon {
              url
            }
            Url
            Text
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
          LogoSection {
            Logo {
              url
            }
            TagLine
          }
          Title
          SubTitle
          ShortDescription
          LongDescription
          ProfileDetails {
            Name
            ProfileTitle
            ProfilePicture {
              url
            }
          }
        }
        Categories {
          Icon {
            url
          }
          Name
          Slug
          postCount
        }
      }
    }
  `;

  return client.request(query);
};

// Fetch posts
export const fetchPosts = async (filters: any, pagination: any, sort?: string[]) => {
  const query = gql`
    query Posts($filters: PostFiltersInput, $pagination: PaginationArg, $sort: [String]) {
      posts(filters: $filters, pagination: $pagination, sort: $sort) {
        documentId
        Category {
          Name
          Slug
        }
        ThumbNail {
          url
        }
        Title
        Images {
          url
        }
        likeCounts
        commentCount
      }
    }
  `;

  return client.request(query, { filters, pagination, sort });
};

// Fetch post details
export const fetchPostDetails = async (documentId: string, visitorId: string, sort?: string[]) => {
  const query = gql`
    query Post($documentId: ID!, $visitorId: String!, $sort: [String]) {
      post(documentId: $documentId) {
        documentId
        AllowComments
        Category {
          Name
          Slug
          Icon {
            url
          }
        }
        Comments(sort: $sort) {
          documentId
          createdAt
          Comment
          User
          Email
        }
        Description
        Images {
          url
        }
        ThumbNail {
          url
        }
        Title
        Video {
          url
        }
        commentCount
        likeCounts
        createdAt
        isLiked(visitorId: $visitorId)
        YoutubeUrl
      }
    }
  `;

  return client.request(query, { documentId, visitorId, sort });
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
        Comment
        User
        Email
      }
    }
  `;

  return client.request(mutation, { blog, email, comment, user });
};

// Mutation to submit contact us form
export const submitContactForm = async (data: ContactFormData) => {
  const mutation = gql`
    mutation CreateForm($data: FormInput!) {
      createForm(data: $data) {
        documentId
      }
    }
  `;

  return client.request(mutation, { data });
};
