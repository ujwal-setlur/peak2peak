import React from 'react';

type TabBarItemProps = {
  tab: {
    Name?: string;
    icon?: {
      url?: string;
    };
    slug?: string;
  } | null;
  isActive: boolean;
  onClick: (tabId: string) => void;
};

const TabBarItem: React.FC<TabBarItemProps> = ({ tab, isActive = false, onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick(tab?.slug || '');
  };

  return (
    <div className="flex min-w-[250px] shrink-0 select-none self-start">
      <a
        key={tab?.slug}
        onClick={handleClick}
        className={`group relative flex cursor-pointer flex-col items-center gap-[30px] self-start`}
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
        <div className="flex items-center gap-2">
          <img src={tab?.icon?.url || ''} className="h-[25px]" />
          <span
            className={`uppercase text-black duration-300 ${
              isActive ? 'font-medium' : 'font-thin group-hover:font-medium'
            }`}
          >
            {tab?.Name || ''}
          </span>
        </div>
      </a>
    </div>
  );
};

export default TabBarItem;
