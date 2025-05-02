// This file defines the common types and interfaces

export type Image = {
  url?: string;
};

export type SocialLink = {
  Name: string;
  Url: string;
  Icon: {
    url?: string;
  };
};

export type ContactFormData = {
  Name: string;
  Email: string;
  Message: string;
};
