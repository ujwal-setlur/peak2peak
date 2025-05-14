import React, { useState, useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import { addComment, fetchPostDetails, toggleLike } from '../lib/graphql';
import { formatDate, isValidEmail } from '../lib/utils';
import { getInitials } from '../utils';

import LikeIcon from '../assets/like.svg?react';
import CommentIcon from '../assets/comment.svg?react';
import { YouTubeEmbed } from './YoutubeEmbed';
import RichTextRenderer from './RichTextRenderer';
import SecureImage from './SecureImage';
import SecureVideo from './SecureVideo';

type PostDetails = {
  Category?: {
    Name?: string;
    Slug?: string;
    Icon?: {
      url?: string;
    };
  };
  createdAt?: string;
  Images?: {
    url?: string;
  }[];
  Video?: {
    url?: string;
  }[];
  ThumbNail?: {
    url?: string;
  };
  Title?: string;
  documentId?: string;
  Comments: {
    documentId?: string;
    createdAt?: string;
    Comment?: string;
    User?: string;
    Email?: string;
  }[];
  Description?: any;
  likeCounts?: number;
  commentCount?: number;
  AllowComments?: boolean;
  isLiked?: boolean;
  YoutubeUrl?: string;
  PostedAt?: string;
};

interface PostModalProps {
  isOpen: boolean;
  postId: string;
  onClose: () => void;
}

export const PostModal: React.FC<PostModalProps> = ({ isOpen, postId, onClose }) => {
  const [postDetails, setPostDetails] = useState<PostDetails | null>(null);

  const [loading, setLoading] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isAddCommentLoading, setIsAddCommentLoading] = useState(false);

  // Use ref to track if component is mounted
  const isMounted = useRef(false);

  // Function to fetch posts that doesn't depend on useEffect
  const fetchPostDetailsData = async (postId: string, disableLoading?: boolean) => {
    if (!disableLoading) {
      setLoading(true);
    }
    try {
      const visitorId = (window as any).visitorId || '';
      const sort = ['createdAt:desc'];
      const data: any = await fetchPostDetails(postId, visitorId, sort);

      // Only update state if component is still mounted
      if (isMounted.current) {
        setPostDetails(data?.post || {});
      }
    } catch (error) {
      console.error('Error fetching post details:', error);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  // Initial post details fetch on mount
  useEffect(() => {
    isMounted.current = true;
    fetchPostDetailsData(postId as string);

    return () => {
      isMounted.current = false;
    };
  }, [postId]);

  // Function to handle like button click
  const handleClickLike = async () => {
    setIsLikeLoading(true);
    try {
      const visitorId = (window as any).visitorId || '';
      await toggleLike(postId, visitorId);

      // Only update state if component is still mounted
      if (isMounted.current) {
        fetchPostDetailsData(postId as string, true);
      }
    } catch (error) {
      console.error('Error liking the post:', error);
    } finally {
      if (isMounted.current) {
        setIsLikeLoading(false);
      }
    }
  };

  // Function to handle submit add comment form
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const comment = formData.get('comment') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    if (!comment || !name || !email) {
      toast.error('All fields are required!');
      return;
    }

    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsAddCommentLoading(true);
    try {
      await addComment(postId, email, comment, name);
      fetchPostDetailsData(postId as string, true);
      toast.success('Your comment has been added.');
      form.reset();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment!');
    } finally {
      setIsAddCommentLoading(false);
    }
  };

  const renderCloseButton = () => {
    return (
      <button
        className="group bg-primary absolute top-0 left-0 flex h-16 w-16 items-center justify-center overflow-hidden text-gray-400 hover:text-gray-900 dark:hover:text-white"
        data-modal-close
        data-post-id={postId}
        onClick={onClose}
      >
        <svg className="h-15 w-15" fill="#ffffff" stroke="#ffffff" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
    );
  };

  const renderImageSection = () => {
    const videoUrl = postDetails?.Video?.[0]?.url;
    const youtubeVideoUrl = postDetails?.YoutubeUrl;
    if (videoUrl) {
      return (
        <SecureVideo controls className="h-auto w-full">
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </SecureVideo>
      );
    } else if (youtubeVideoUrl) {
      return (
        <div className="mt-10 flex w-full gap-10">
          <YouTubeEmbed className="h-[320px] w-full md:h-[540px] md:pb-10" url={youtubeVideoUrl} />
        </div>
      );
    } else {
      return (
        <SecureImage
          src={postDetails?.Images?.[0]?.url || ''}
          alt="post"
          className="aspect-square w-full overflow-hidden object-cover"
        />
      );
    }
  };

  const renderTitle = () => {
    return (
      <div className="text-md text-primary w-full leading-tight font-semibold sm:text-lg">
        {postDetails?.Title || ''}
      </div>
    );
  };

  const renderDateAndCategorySection = () => {
    const postedDate = postDetails?.PostedAt || postDetails?.createdAt;
    return (
      <div className="w-full text-base font-thin text-black">
        {postedDate ? formatDate(postedDate) : ''}
        <span className="mx-2 font-thin">|</span>
        {postDetails?.Category?.Name || ''}
      </div>
    );
  };

  const renderLikeAndCommentSection = () => {
    return (
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-4">
          <button
            className="text-teal-600 hover:text-teal-800"
            data-action="like"
            data-post-id={postId}
            disabled={isLikeLoading}
            onClick={handleClickLike}
          >
            <LikeIcon
              className={`h-8 w-8 ${postDetails?.isLiked ? 'fill-[#F44336]' : 'fill-primary'}`}
            />
          </button>
          <span className="text-md font-medium text-black" id={`likes-${postId}`}>
            {postDetails?.likeCounts || 0}
          </span>
        </div>
        <div className="text-md font-thin text-black">|</div>
        <div className="flex items-center gap-4">
          <button
            className="cursor-default text-teal-600 hover:text-teal-800"
            data-action="like"
            data-post-id={postId}
          >
            <CommentIcon className="fill-primary h-8 w-8" />
          </button>
          <span className="text-md font-medium text-black" id={`comments-count-${postId}`}>
            {postDetails?.commentCount || 0}
          </span>
        </div>
      </div>
    );
  };

  const renderDescription = () => {
    return (
      <div className="w-full text-sm font-thin text-black">
        {postDetails?.Description ? <RichTextRenderer content={postDetails?.Description} /> : null}
      </div>
    );
  };

  const renderComments = () => {
    if (postDetails?.AllowComments) {
      return (
        <ul className="mt-8 space-y-3" id={`comments-${postId}`}>
          {postDetails && postDetails?.Comments && postDetails?.Comments?.length
            ? postDetails.Comments.map((comment, index) => {
                const isLastComment =
                  postDetails?.Comments?.length && index === postDetails.Comments.length - 1;
                return (
                  <li key={index} className={`flex gap-3 ${!isLastComment ? 'border-b pb-3' : ''}`}>
                    <div className="bg-primary flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full text-sm font-medium text-white">
                      {comment.User ? getInitials(comment.User) : ''}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-black">{comment.User}</span>
                      <span className="text-xs font-thin text-black">{comment.Comment}</span>
                    </div>
                  </li>
                );
              })
            : null}
        </ul>
      );
    } else {
      return (
        <div className="mt-2">
          <span className="text-[0.9rem] font-thin text-gray-500">
            Comments are disabled for this post
          </span>
        </div>
      );
    }
  };

  const renderAddCommentForm = () => {
    if (postDetails?.AllowComments) {
      return (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3"
          data-comment-form
          data-post-id={postId}
        >
          <div className="mt-3 flex flex-col gap-2">
            <textarea
              name="comment"
              placeholder="Write your comments..."
              className="focus:ring-primary w-full border px-3 py-2 text-xs italic focus:ring-2 focus:outline-hidden"
            ></textarea>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              className="focus:ring-primary w-full border px-3 py-2 text-xs italic focus:ring-2 focus:outline-hidden"
            />
            <input
              type="text"
              name="email"
              placeholder="Email"
              className="focus:ring-primary w-full border px-3 py-2 text-xs italic focus:ring-2 focus:outline-hidden"
            />
          </div>
          <button
            type="submit"
            disabled={isAddCommentLoading}
            className="w-[150px] self-start bg-linear-to-r from-teal-500 to-teal-800 px-1 py-2 text-xs tracking-wider text-white hover:from-teal-800 hover:to-teal-500 hover:font-medium"
          >
            {isAddCommentLoading ? 'Submitting...' : ' SUBMIT'}
          </button>
        </form>
      );
    } else {
      return null;
    }
  };

  if (!isOpen || loading) {
    return null;
  }
  return (
    <div>
      <div
        className="fixed inset-0 z-40 flex items-center justify-center px-3 pt-[100px] pb-[50px] opacity-100 transition-opacity duration-300 md:px-5"
        id={`modal-${postId}`}
      >
        <div className="absolute inset-0 bg-black opacity-50" data-post-id={postId}></div>

        <div className="overscroll-y-hidden border-primary relative z-10 h-full max-h-[85vh] w-full max-w-(--breakpoint-2xl) overflow-x-hidden border bg-white p-4 shadow-lg sm:max-h-[80vh] md:p-5 md:pr-0">
          <div className="flex h-full w-full flex-col gap-5 sm:flex-row sm:gap-2">
            <div className="max-w-auto relative flex aspect-square w-full sm:max-w-[60%]">
              {renderImageSection()}
              {renderCloseButton()}
            </div>

            <div className="max-w-auto w-full space-y-4 sm:max-w-[40%]">
              <div className="bg-opacity-5 flex w-full flex-col gap-3 bg-white px-0 pb-5 sm:px-5">
                {renderTitle()}
                {renderDateAndCategorySection()}
                {renderLikeAndCommentSection()}
                {renderDescription()}
                <div className="mt-5 w-full">
                  <h3 className="text-sm font-semibold text-black">Comments</h3>
                  {renderAddCommentForm()}
                  {renderComments()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};
