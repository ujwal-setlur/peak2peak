import React from 'react';

import LikeIcon from '../assets/like.svg';
import CommentIcon from '../assets/comment.svg';

const PostCard = ({ data, onClick }) => {
  return (
    <div
      data-post-id={data.id}
      class="post-card group relative aspect-square w-full overflow-hidden"
      onClick={() => onClick && onClick(data.id)}
    >
      <img
        src={data.image.url}
        alt="post"
        class="cover aspect-square w-full overflow-hidden duration-300 ease-in group-hover:scale-110 group-hover:transform"
      />
      <div class="absolute inset-0 flex items-end justify-center gap-[60px] px-4 py-3">
        {data.title && (
          <span class="line-clamp-2 text-sm font-medium text-white sm:text-base lg:text-[1.65rem]">
            {data.title}
          </span>
        )}
      </div>
      <div class="absolute inset-0 flex bg-black opacity-0 duration-300 group-hover:cursor-pointer group-hover:opacity-30 group-hover:transition-opacity"></div>
      <div class="absolute inset-0 flex items-center justify-center gap-[30px] opacity-0 duration-300 group-hover:cursor-pointer group-hover:opacity-100 group-hover:transition-opacity sm:gap-[45px] lg:gap-[60px]">
        <div class="flex flex-col items-center justify-center gap-2">
          <img src={LikeIcon.src} alt="like" class="h-6 sm:h-7 lg:h-10" />
          <span class="text-sm font-medium text-white sm:text-base lg:text-md">
            {data.likesCount || 0}
          </span>
        </div>
        <div class="flex flex-col items-center justify-center gap-2">
          <img src={CommentIcon.src} alt="like" class="h-6 sm:h-7 lg:h-10" />
          <span class="text-sm font-medium text-white sm:text-base lg:text-md">
            {data.commentsCount || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
