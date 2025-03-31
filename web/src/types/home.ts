// This file defines the types and interfaces related to homepage

// import { Image } from './common';

export type CategoryItem = {
  Name?: string;
  icon?: {
    url?: string;
  };
  slug?: string;
};

export type ProfileDetails = {
  Name?: string;
  ProfileTitle?: string;
  ProfilePIcture?: {
    url?: string;
  };
};

export type HeroSectionData = {
  logo?: {
    image: {
      url?: string;
    };
    logText?: string;
  };
  ProfileDetails?: ProfileDetails;
  heading?: string;
  title?: string;
  description?: string;
  longDescription?: string;
  blogs?: CategoryItem[];
};
