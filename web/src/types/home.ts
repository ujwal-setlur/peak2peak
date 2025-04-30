// This file defines the types and interfaces related to homepage

// import { Image } from './common';

export type CategoryItem = {
  Icon?: {
    url?: string;
  };
  Name?: string;
  Slug?: string;
  postCount?: number;
};

export type ProfileDetails = {
  Name?: string;
  ProfileTitle?: string;
  ProfilePicture?: {
    url?: string;
  };
};

export type HeroSectionData = {
  LogoSection?: {
    Logo?: {
      url?: string;
    };
    TagLine?: string;
  };
  Title?: string;
  SubTitle?: string;
  ShortDescription?: string;
  LongDescription?: any;
  ProfileDetails?: ProfileDetails;
  Categories?: CategoryItem[];
};
