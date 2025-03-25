import React, { useState } from 'react';

import GearIcon from '../assets/gear.png';
import InjuryIcon from '../assets/injury.png';
import NutritionIcon from '../assets/nutrition.png';
import PastIcon from '../assets/past.svg';
import UpcomingIcon from '../assets/upcoming.svg';
import WorkoutIcon from '../assets/workout.png';
import TabBarItem from './TabBarItem';

// Get the tabs configuration
const tabs = [
  {
    id: 'past-trips',
    label: 'PAST TRIPS',
    href: '/past-trips',
    icon: PastIcon,
  },
  {
    id: 'upcoming-trips',
    label: 'UPCOMING TRIPS',
    href: '/upcoming-trips',
    icon: UpcomingIcon,
  },
  {
    id: 'gear-reviews',
    label: 'GEAR REVIEWS',
    href: '/gear-reviews',
    icon: GearIcon,
  },
  {
    id: 'workouts',
    label: 'WORKOUTS',
    href: '/workouts',
    icon: WorkoutIcon,
  },
  {
    id: 'nutrition',
    label: 'NUTRITION',
    href: '/nutrition',
    icon: NutritionIcon,
  },
  {
    id: 'injury-prevention',
    label: 'INJURY PREVENTION',
    href: '/injury-prevention',
    icon: InjuryIcon,
  },
];

const TabBar = ({ initialActiveTab = 'past-trips' }) => {
  const [activeTab, setActiveTab] = useState(initialActiveTab);

  // Handle tab click
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div class="relative w-full">
      <div class="flex w-full flex-1 items-center justify-between overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return <TabBarItem key={tab.id} tab={tab} isActive={isActive} onClick={handleTabClick} />;
        })}
      </div>
    </div>
  );
};

export default TabBar;
