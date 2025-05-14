import React, { useState, useEffect, useRef } from 'react';
import TabBarItem from './TabBarItem';
import PostCard from './PostCard';
import { fetchPosts } from '../lib/graphql';
import { PostModal } from './PostModal';
import Peak2PeakLogo from '../assets/peak2peak.svg?react';
import { LoadMore } from './LoadMore';

type PostItem = {
  documentId?: string;
  Category?: {
    Name?: string;
    Slug?: string;
  };
  ThumbNail?: {
    url?: string;
  };
  Title?: string;
  Images?: {
    url?: string;
  }[];
  likeCounts?: number;
  commentCount?: number;
};

interface PostsProps {
  Categories: {
    Name?: string;
    Icon?: {
      url?: string;
    };
    Slug?: string;
    postCount?: number;
  }[];
}

export const Posts: React.FC<PostsProps> = ({ Categories }) => {
  const [activeTab, setActiveTab] = useState<string | undefined>(
    Categories?.find((category) => category.postCount && category.postCount > 0)?.Slug || ''
  );
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
        { Category: { Slug: { eq: tabSlug || activeTab } } },
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
    if (activeTab && Categories?.length) {
      const activeTabData = Categories.find((tab) => tab.Slug === activeTab);
      return activeTabData?.postCount || 0;
    } else {
      return 0;
    }
  };

  return (
    <section className="flex w-full flex-col overflow-auto">
      <div className="z-10 flex w-full flex-col items-center justify-center bg-white/70 px-5 backdrop-blur-xs">
        <div className="flex w-full max-w-(--breakpoint-2xl) flex-col gap-5">
          {/* Tab Bar */}
          <div className="relative w-full">
            <div className="flex items-center overflow-x-auto">
              {Categories?.map((tab) => {
                if (tab?.postCount) {
                  return (
                    <TabBarItem
                      key={tab.Slug}
                      tab={tab}
                      isActive={activeTab === tab.Slug}
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
                    <Peak2PeakLogo className="opacity-80" />
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
