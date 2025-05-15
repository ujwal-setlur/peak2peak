import React from 'react';

import LoadMoreIcon from '../assets/past.svg?react';

type LoadMoreProps = {
  onClick: () => void;
};

export const LoadMore: React.FC<LoadMoreProps> = ({ onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick();
  };

  return (
    <div className="flex min-w-[160px] shrink-0 self-start select-none">
      <a
        onClick={handleClick}
        className={`group relative flex cursor-pointer flex-col items-center gap-[30px] self-start`}
      >
        <div className="flex w-full items-start">
          <div
            className={`transition-width h-[16px] bg-[#bbbbbb] duration-300 ease-in-out group-hover:w-full group-hover:bg-teal-600 marker:w-[6px]`}
          />
        </div>
        <div className="flex items-center gap-2">
          <LoadMoreIcon className="h-[25px]" />
          <span className={`font-thin text-black uppercase duration-300 group-hover:font-medium`}>
            LOAD MORE
          </span>
        </div>
      </a>
    </div>
  );
};
