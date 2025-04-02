import React, { useState, useEffect, useRef } from 'react';
import { addComment, fetchPostDetails, toggleLike } from '../lib/graphql';

import LikeIcon from '../assets/like-primary.svg';
import LikedIcon from '../assets/liked.svg';
import CommentIcon from '../assets/comment-primary.svg';
import { formatDate, strapiRichTextToHtml } from '../lib/utils';
import { getInitials } from '../utils';

type PostDetails = {
  blog?: {
    Name?: string;
    slug?: string;
    icon?: {
      url?: string;
    };
  };
  createdAt?: string;
  images?: {
    url?: string;
  }[];
  video?: {
    url?: string;
  }[];
  thumbNail?: {
    url?: string;
  };
  title?: string;
  documentId?: string;
  comments: {
    user?: string;
    comment?: string;
    createdAt?: string;
    email?: string;
  }[];
  description?: any;
  likeCounts?: number;
  commentCount?: number;
  allowComments?: boolean;
  isLiked?: boolean;
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

  // Use ref to track if component is mounted
  const isMounted = useRef(false);

  // Function to fetch posts that doesn't depend on useEffect
  const fetchPostDetailsData = async (postId: string, disableLoading?: boolean) => {
    if (!disableLoading) {
      setLoading(true);
    }
    try {
      const visitorId = (window as any).visitorId || '';
      const data: any = await fetchPostDetails(postId, visitorId);

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
      alert('All fields are required!');
      return;
    }

    try {
      await addComment(postId, email, comment, name);
      fetchPostDetailsData(postId as string, true);
      form.reset();
    } catch (error) {
      console.log('error', error);
      console.error('Error adding comment:', error);
      alert('Failed to add comment.');
    }
  };

  const renderCloseButton = () => {
    return (
      <button
        className="group absolute left-0 top-0 flex h-16 w-16 items-center justify-center overflow-hidden bg-primary text-gray-400 hover:text-gray-900 dark:hover:text-white"
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
    const videoUrl = postDetails?.video?.[0]?.url;
    if (videoUrl) {
      return (
        <video controls className="h-auto w-full">
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return (
        <img
          src={postDetails?.images?.[0]?.url || ''}
          alt="post"
          className="aspect-square w-full overflow-hidden object-cover"
        />
      );
    }
  };

  const renderTitle = () => {
    return (
      <div className="w-full text-lg font-semibold leading-tight text-primary">
        {postDetails?.title || ''}
      </div>
    );
  };

  const renderDateAndCategorySection = () => {
    return (
      <div className="w-full text-base font-thin text-black">
        {postDetails?.createdAt ? formatDate(postDetails?.createdAt) : ''}
        <span className="mx-2 font-thin">|</span>
        {postDetails?.blog?.Name || ''}
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
            <img
              src={postDetails?.isLiked ? LikedIcon.src : LikeIcon.src}
              alt="like"
              className="h-8 w-8 fill-primary"
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
            <img src={CommentIcon.src} alt="comment" className="h-8 w-8 fill-primary" />
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
      <div
        className="w-full text-sm font-thin text-black"
        dangerouslySetInnerHTML={{
          __html: postDetails?.description ? strapiRichTextToHtml(postDetails?.description) : '',
        }}
      />
    );
  };

  const renderComments = () => {
    return (
      <ul className="mt-8 max-h-[500px] space-y-3 overflow-y-auto" id={`comments-${postId}`}>
        {postDetails && postDetails?.comments && postDetails?.comments?.length
          ? postDetails.comments.map((comment, index) => {
              const isLastComment =
                postDetails?.comments?.length && index === postDetails.comments.length - 1;
              return (
                <li
                  key={index}
                  className={`flex gap-3 ${!isLastComment ? 'border-b-[1px] pb-3' : ''}`}
                >
                  <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-white">
                    {comment.user ? getInitials(comment.user) : ''}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-black">{comment.user}</span>
                    <span className="text-xs font-thin text-black">{comment.comment}</span>
                  </div>
                </li>
              );
            })
          : null}
      </ul>
    );
  };

  const renderAddCommentForm = () => {
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
            className="w-full border px-3 py-2 text-xs italic focus:outline-none focus:ring-2 focus:ring-primary"
          ></textarea>
          <input
            type="text"
            name="name"
            placeholder="Your name"
            className="w-full border px-3 py-2 text-xs italic focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            name="email"
            placeholder="Email"
            className="w-full border px-3 py-2 text-xs italic focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          type="submit"
          className="w-[150px] self-start bg-gradient-to-r from-teal-500 to-teal-800 px-1 py-2 text-xs tracking-wider text-white hover:from-teal-800 hover:to-teal-500 hover:font-medium"
        >
          SUBMIT
        </button>
      </form>
    );
  };

  if (!isOpen || loading) {
    return null;
  }
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center px-3 pb-[50px] pt-[100px] opacity-100 transition-opacity duration-300 md:px-5"
      id={`modal-${postId}`}
    >
      <div className="absolute inset-0 bg-black opacity-50" data-post-id={postId}></div>

      <div className="overscroll-y-hidden relative z-10 h-full max-h-[80vh] w-full max-w-screen-2xl overflow-x-hidden border-[1px] border-primary bg-white p-3 shadow-lg md:p-5 md:pr-0">
        <div className="flex h-full w-full gap-2">
          <div className="relative flex aspect-square w-full max-w-[60%]">
            {renderImageSection()}
            {renderCloseButton()}
          </div>

          <div className="w-full max-w-[40%] space-y-4 overflow-y-auto">
            <div className="flex w-full flex-col gap-3 bg-white bg-opacity-5 px-5 pb-5">
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
  );
};
