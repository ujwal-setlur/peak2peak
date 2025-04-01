import React, { useState, useEffect, useRef } from 'react';
import TabBarItem from './TabBarItem';
import PostCard from './PostCard';
import { fetchPosts } from '../lib/graphql';
import { PostModal } from './PostModal';
import Peak2PeakLogo from '../assets/peak2peak.svg';
import { LoadMore } from './LoadMore';
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
  likeCounts?: number;
  commentCount?: number;
};

interface PostsProps {
  categories: {
    Name?: string;
    icon?: {
      url?: string;
    };
    slug?: string;
    postCount?: number;
  }[];
}

export const Posts: React.FC<PostsProps> = ({ categories }) => {
  const [activeTab, setActiveTab] = useState<string | undefined>(categories?.[0]?.slug || '');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [selectedPostId, setSelectedPostId] = useState<string>('');
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMoreloading, setIsMoreLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(9);

  // Use ref to track if component is mounted
  const isMounted = useRef(false);

  // Function to fetch posts that doesn't depend on useEffect
  const fetchPostsData = async (tabSlug?: string, pageValue?: number) => {
    // if (!tabSlug) return;
    if (tabSlug) {
      setLoading(true);
    }
    if (pageValue) {
      setIsMoreLoading(true);
    }
    try {
      const data: any = await fetchPosts(
        { blog: { slug: { eq: tabSlug || activeTab } } },
        { page: tabSlug ? 1 : pageValue || page, pageSize: pageSize },
        ['createdAt:desc']
      );
      // Only update state if component is still mounted
      if (isMounted.current) {
        if (tabSlug) {
          setPosts(data?.posts || []);
        } else {
          setPosts([...posts, ...(data?.posts || [])]);
        }
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      if (isMounted.current) {
        setLoading(false);
        setIsMoreLoading(false);
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
    if (!loading) {
      setActiveTab(tabId);
      setPage(1);
      // Fetch data immediately when tab changes
      fetchPostsData(tabId);
    }
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

  const handleClickLoadMore = () => {
    if (!isMoreloading) {
      setPage((prevPage) => prevPage + 1);
      fetchPostsData('', page + 1);
    }
  };

  const getActiveTabPostCount = () => {
    if (activeTab && categories?.length) {
      const activeTabData = categories.find((tab) => tab.slug === activeTab);
      return activeTabData?.postCount || 0;
    } else {
      return 0;
    }
  };

  return (
    <section className="flex w-full flex-col overflow-auto">
      <div className="z-10 flex w-full flex-col items-center justify-center bg-white/70 px-5 backdrop-blur-sm">
        <div className="flex w-full max-w-screen-2xl flex-col gap-5">
          {/* Tab Bar */}
          <div className="relative w-full">
            <div className="flex items-center overflow-x-auto">
              {categories.map((tab) => {
                if (tab?.postCount) {
                  return (
                    <TabBarItem
                      key={tab.slug}
                      tab={tab}
                      isActive={activeTab === tab.slug}
                      onClick={handleTabClick}
                    />
                  );
                }
              })}
            </div>
          </div>
          {/* Posts Section */}
          <div className="grid grid-cols-2 gap-5 py-10 md:grid-cols-3 md:gap-10">
            {loading ? (
              <>
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="flex aspect-square h-full w-full animate-pulse items-center justify-center overflow-hidden bg-gray-300 p-12"
                  >
                    <img src={Peak2PeakLogo.src} alt="like" className="opacity-80" />
                  </div>
                ))}
              </>
            ) : posts && posts.length > 0 ? (
              posts.map((post) => {
                return <PostCard key={post.documentId} data={post} onClick={handlePostClick} />;
              })
            ) : null}
          </div>
          <div className="flex w-full items-center justify-center pb-10">
            {posts?.length < getActiveTabPostCount() ? (
              <LoadMore onClick={handleClickLoadMore} />
            ) : null}
          </div>
        </div>
      </div>
      {posts?.map((post) => {
        return (
          <PostModal
            key={post.documentId}
            isOpen={isDetailsModalOpen && post.documentId === selectedPostId}
            postId={selectedPostId || ''}
            onClose={handleCloseDetailsModal}
          />
        );
      })}
    </section>
  );
};
