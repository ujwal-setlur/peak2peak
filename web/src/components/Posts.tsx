import React, { useState, useEffect, useRef } from 'react';
import TabBarItem from './TabBarItem';
import PostCard from './PostCard';
import { fetchPosts } from '../lib/graphql';
import { PostModall } from './PostModal';
// import { CategoryItem } from "../types/home";
// import { PostItem } from "../types/posts";

type PostItem = {
  documentId?: string;
  blog?: {
    slug?: string;
  };
  thumbNail?: {
    url?: string;
  };
  title?: string;
  likesCount?: number;
  commentsCount?: number;
};

interface PostssProps {
  categories: {
    Name?: string;
    icon?: {
      url?: string;
    };
    slug?: string;
  }[];
}

export const Postss: React.FC<PostssProps> = ({ categories }) => {
  const [activeTab, setActiveTab] = useState<string | undefined>(categories?.[0]?.slug || '');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [selectedPostId, setSelectedPostId] = useState<string>('');
  const [posts, setPosts] = useState<PostItem[] | null>([]);
  const [loading, setLoading] = useState(false);

  // Use ref to track if component is mounted
  const isMounted = useRef(false);

  // Function to fetch posts that doesn't depend on useEffect
  const fetchPostsData = async (tabSlug: string) => {
    console.log('tabSlug', tabSlug);
    if (!tabSlug) return;

    setLoading(true);
    try {
      const data: any = await fetchPosts({ blog: { slug: { eq: tabSlug } } });
      // Only update state if component is still mounted
      if (isMounted.current) {
        setPosts(data?.posts || []);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    isMounted.current = true;

    // Initial data fetch
    fetchPostsData(activeTab as string);

    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    // Fetch data immediately when tab changes
    fetchPostsData(tabId);
  };

  const handlePostClick = (postId: string) => {
    setSelectedPostId(postId);
    setTimeout(() => {
      setIsDetailsModalOpen(true);
    }, 10);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedPostId('');
  };

  return (
    <section className="flex w-full flex-col overflow-auto">
      <div className="z-10 flex w-full flex-col items-center justify-center bg-white/70 px-5 backdrop-blur-sm">
        <div className="flex w-full max-w-screen-2xl flex-col gap-5">
          {/* Tab Bar */}
          <div className="relative w-full">
            <div className="flex items-center overflow-x-auto">
              {categories.map((tab) => (
                <TabBarItem
                  key={tab.slug}
                  tab={tab}
                  isActive={activeTab === tab.slug}
                  onClick={handleTabClick}
                />
              ))}
            </div>
          </div>
          {/* Posts Section */}
          <div className="grid grid-cols-2 gap-5 py-10 md:grid-cols-3 md:gap-10">
            {loading ? (
              <>
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square h-full w-full animate-pulse overflow-hidden rounded-lg bg-gray-300"
                  ></div>
                ))}
              </>
            ) : posts && posts.length > 0 ? (
              posts.map((post) => {
                return <PostCard key={post.documentId} data={post} onClick={handlePostClick} />;
              })
            ) : (
              <p>No posts found for this category.</p>
            )}
          </div>
        </div>
      </div>
      {posts?.map((post) => {
        return (
          <PostModall
            isOpen={isDetailsModalOpen && post.documentId === selectedPostId}
            postId={selectedPostId || ''}
            onClose={handleCloseDetailsModal}
          />
        );
      })}
    </section>
  );
};
