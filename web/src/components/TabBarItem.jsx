import React from 'react';

const TabBarItem = ({ tab, isActive = false, onClick = () => {} }) => {
  return (
    <div className="flex flex-1 select-none">
      <a
        key={tab.id}
        href={tab.href}
        onClick={(e) => {
          e.preventDefault();
          onClick(tab.id);
        }}
        class={`group relative flex min-w-fit flex-col items-center gap-[30px]`}
      >
        <div className="flex w-full items-start">
          <div
            className={`h-[16px] transition-width duration-300 ease-in-out ${
              isActive
                ? 'w-full bg-teal-600'
                : 'w-[6px] bg-[#bbbbbb] group-hover:w-full group-hover:bg-teal-600'
            }`}
          />
        </div>
        <div class="flex items-center gap-2">
          <img src={tab.icon.src} className="h-[25px]" />
          <span
            className={`text-black ${
              isActive ? 'font-medium' : 'font-thin group-hover:font-medium'
            }`}
          >
            {tab.label}
          </span>
        </div>
      </a>
    </div>
  );
};

export default TabBarItem;
