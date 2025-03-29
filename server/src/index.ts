import { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register( { strapi }: { strapi: Core.Strapi }) {
    console.log("🔄 Strapi is registering GraphQL extensions....")
  const extensionService = strapi.plugin('graphql').service('extension');

  extensionService.use({
    typeDefs: `
      type ToggleLikeResponse {
        action: String!
        likeCount: Int!
        like: LikeEntityResponse
      }
      
      type Mutation {
        toggleLike(blog: ID!, visitorId: String!): ToggleLikeResponse
      }
    `,
    resolvers: {
      Mutation: {
        toggleLike: {
          resolve: async (parent, args, context) => {
            const { blog, visitorId } = args;
     
            if (!blog || !visitorId) {
              throw new Error('Missing blog or visitorId');
            }

            try {
              // const post = await strapi.documents("api::post.post").findMany();
              const post = await strapi.db.query('api::post.post').findMany({
                where: {
                  documentId: blog
                },
                populate: {likes: true}
              });
              console.log("post", post.map((like)=> like.likes));

              if (!post || post.length === 0) {
                throw new Error("Post not found");
              }

              const postId = post[0].id;
              const like = post[0].likes;
              console.log("like", like)


              const existingLike = like.find((like) => like.visitorId === visitorId);

              if (existingLike) {
                await strapi.entityService.delete('api::like.like', existingLike.id);
                return {
                  action: 'unliked',
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
                  action: 'liked',
                  likeCount: await getLikeCount(blog, strapi),
                  like: newLike,
                };
              }
            } catch (error) {
              throw new Error(`Error toggling like: ${error.message}`);
            }
          }
        }
      }
    },
    resolversConfig: {
      'Mutation.toggleLike': {
        auth: false // Make this endpoint public
      }
    }
  });

  async function getLikeCount(blogId: string, strapi: any): Promise<number> {
    return await strapi.entityService.count('api::like.like', {
      filters: {
        post: { id: blogId }
      }
    });
  }
},
  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
};
