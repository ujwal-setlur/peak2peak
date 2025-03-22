import React from 'react';

import LikeIcon from '../assets/like.svg';
import CommentIcon from '../assets/comment.svg';

const PostCard = ({ data, onClick = () => {} }) => {
  return (
    <div class="group relative aspect-square w-full overflow-hidden">
      <img
        src={data.image.url}
        alt="post"
        class="cover aspect-square w-full overflow-hidden duration-300 ease-in group-hover:scale-110 group-hover:transform"
      />
      <div class="absolute inset-0 flex bg-black opacity-0 duration-300 group-hover:cursor-pointer group-hover:opacity-30 group-hover:transition-opacity"></div>
      <div class="absolute inset-0 flex items-center justify-center gap-[60px] opacity-0 duration-300 group-hover:cursor-pointer group-hover:opacity-100 group-hover:transition-opacity">
        <div class="flex flex-col items-center justify-center gap-2">
          <img src={LikeIcon.src} alt="like" class="h-10" />
          <span class="text-md font-medium text-white">{data.likes || 0}</span>
        </div>
        <div class="flex flex-col items-center justify-center gap-2">
          <img src={CommentIcon.src} alt="like" class="h-10" />
          <span class="text-md font-medium text-white">{data.comments || 0}</span>
        </div>
      </div>
      <div class="absolute inset-0 flex items-end justify-center gap-[60px] px-4 py-3 opacity-0 duration-300 group-hover:cursor-pointer group-hover:opacity-100 group-hover:transition-opacity">
        {data.title && (
          <span class="line-clamp-3 text-base font-medium text-white">{data.title}</span>
        )}
      </div>
    </div>
  );
};

export default PostCard;
