import React from 'react';

import LikeIcon from '../assets/like.svg?react';
import CommentIcon from '../assets/comment.svg?react';

type PostCardProps = {
  data: {
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
  } | null;
  onClick: (postId: string) => void;
};

const PostCard: React.FC<PostCardProps> = ({ data, onClick }) => {
  return (
    <div
      data-post-id={data?.documentId}
      className="post-card group relative aspect-square w-full overflow-hidden"
      onClick={() => onClick && onClick(data?.documentId || '')}
    >
      <img
        src={data?.ThumbNail?.url || data?.Images?.[0]?.url || undefined}
        alt={data?.Title || ''}
        className="cover aspect-square w-full overflow-hidden duration-300 ease-in group-hover:scale-110 group-hover:transform"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      <div className="absolute inset-0 flex items-end justify-start gap-[60px] px-4 py-3">
        {data?.Title && (
          <span className="line-clamp-2 text-sm font-medium text-white sm:text-base lg:text-[1.65rem]">
            {data?.Title}
          </span>
        )}
      </div>
      <div className="absolute inset-0 flex bg-black opacity-0 duration-300 group-hover:cursor-pointer group-hover:opacity-30 group-hover:transition-opacity"></div>
      <div className="absolute inset-0 flex items-center justify-center gap-[30px] opacity-0 duration-300 group-hover:cursor-pointer group-hover:opacity-100 group-hover:transition-opacity sm:gap-[45px] lg:gap-[60px]">
        <div className="flex flex-col items-center justify-center gap-2">
          <LikeIcon className="h-6 sm:h-7 lg:h-10" />
          <span className="text-sm font-medium text-white sm:text-base lg:text-md">
            {data?.likeCounts || 0}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <CommentIcon className="h-6 sm:h-7 lg:h-10" />
          <span className="text-sm font-medium text-white sm:text-base lg:text-md">
            {data?.commentCount || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
