import { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }: { strapi: Core.Strapi }) {
    console.log("🔄 Strapi is registering GraphQL extensions....")
    const extensionService = strapi.plugin('graphql').service('extension');

    extensionService.use({
      typeDefs: `
      type ToggleLikeResponse {
        action: String!
        likeCount: Int!
        like: LikeEntityResponse
      }

      type CommentResponse {
        id: ID!
        Email: String!
        User: String!
        Comment: String!
        createdAt: DateTime!
        Post: PostEntityResponse
      }

      extend type Post {
        likeCounts: Int!
        commentCount: Int!
        isLiked(visitorId: String!): Boolean!
      }
      
      type Mutation {
        toggleLike(blog: ID!, visitorId: String!): ToggleLikeResponse
      }

      type Mutation {
        addComment(blog: ID!, email: String!, user: String!, comment: String!): CommentResponse
      }
      type Category {
        postCount: Int
      }
    `,
    resolvers: {
      Category: {
        postCount: async (parent, args, context) => {
          const blogId = parent.id;
          const posts = await strapi.db.query("api::post.post").findMany({
            where: { Category: blogId },
          });

          return posts.length;
        }
      },
      Post: {
        likeCounts: async (parent, args, context) => {
          return await getLikeCount(parent.documentId, strapi);
        },
        commentCount: async(parent,args,context) => {
          return await getCommentCount(parent.documentId, strapi)
        },
        isLiked: async (parent, args, context) => {
          const { visitorId } = args;
          const postId = parent.id;
          const like = await strapi.db.query("api::like.like").findOne({
            where: {
              post: postId,
              visitorId: visitorId,
            },
          });
          return !!like;
        }
      },
      Mutation: {
        toggleLike: {
          resolve: async (parent, args, context) => {
            const { blog, visitorId } = args;

            if (!blog || !visitorId) {
              throw new Error('Missing blog or visitorId');
            }

            try {
              const post = await strapi.db.query('api::post.post').findMany({
                where: {
                  documentId: blog
                },
                populate: { Likes: true },
              });

              if (!post || post.length === 0) {
                throw new Error("Post not found");
              }

              const postId = post[0].id;
              const likes = post[0].Likes;

              const existingLike = likes.find((like) => like.visitorId === visitorId);

              if (existingLike) {
                await strapi.entityService.delete('api::like.like', existingLike.id);
                return {
                  action: 'UNLIKED',
                  likeCount: await getLikeCount(blog, strapi),
                };
              } else {
                const newLike = await strapi.entityService.create('api::like.like', {
                  data: {
                    visitorId: visitorId,
                    post: {
                      documentId: blog
                    },
                  }
                });
                return {
                  action: 'LIKED',
                  likeCount: await getLikeCount(blog, strapi),
                  like: newLike,
                };
              }
            } catch (error) {
              throw new Error(`Error toggling like: ${error.message}`);
            }
          }
        },
        addComment: {
          resolve: async (parent, args, context) => {
            const { blog, email, user: name, comment } = args;
            
            if (!blog || !email || !name || !comment) {
              throw new Error("Missing required fields");
            }

            try {
              const post = await strapi.db.query("api::post.post").findMany({
                where: {
                  documentId: blog
                }
              });

              if (!post || post.length === 0) {
                throw new Error("Post not found");
              }

              const postId = post[0].id;

              const newComment = await strapi.entityService.create("api::comment.comment", {
                data: {
                  Email: email,
                  User: name,
                  Comment: comment,
                  Post: postId,
                }
              });
              return newComment;
            } catch (error) {
              throw new Error(`Error adding comment: ${error.message}`);
            }
          }
        }
      }
    },
      resolversConfig: {
        'Mutation.toggleLike': {
          auth: false
        },
        'Mutation.addComment': {
          auth: false
        }
      }
    });

  async function getLikeCount(blog: string, strapi: any): Promise<number> {

    const count = await strapi.db.query('api::post.post').findMany({
      where: {
        documentId: blog
      },
      populate: {Likes: true}
    })
    return count[0].Likes.length;
  }

  async function getCommentCount(blog: string, strapi: any): Promise<number> {
    const count =  await strapi.db.query('api::post.post').findMany({
      where: {
        documentId: blog
      },
      populate: {Comments: true}
    })
    return count[0].Comments.length;
  }
  },
  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) { },
};
