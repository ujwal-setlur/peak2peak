// This file defines the types and interfaces related to posts

// import { Image } from './common';

export type PostItem = {
  documentId?: string;
  blog?: {
    slug?: string;
  };
  thumbNail?: {
    url?: string;
  };
  title?: string;
  likesCount?: number;
  commentsCount?: number;
};

export type PostDetails = {
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
};
