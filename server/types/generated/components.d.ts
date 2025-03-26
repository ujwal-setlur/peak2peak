import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_blocks_hero_sections';
  info: {
    description: '';
    displayName: 'Hero Section';
  };
  attributes: {
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    logo: Schema.Attribute.Component<'elements.logo', false>;
    longDescription: Schema.Attribute.RichText;
    ProfileDetails: Schema.Attribute.Component<'profile-info.profile', false>;
    title: Schema.Attribute.Text;
  };
}

export interface ElementsLink extends Struct.ComponentSchema {
  collectionName: 'components_elements_links';
  info: {
    description: '';
    displayName: 'Link';
  };
  attributes: {
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    text: Schema.Attribute.String;
  };
}

export interface ElementsLogo extends Struct.ComponentSchema {
  collectionName: 'components_elements_logos';
  info: {
    displayName: 'Logo';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    logText: Schema.Attribute.String;
  };
}

export interface LayoutHeader extends Struct.ComponentSchema {
  collectionName: 'components_layout_headers';
  info: {
    description: '';
    displayName: 'Header';
  };
  attributes: {
    logo: Schema.Attribute.Media<'images'>;
    social: Schema.Attribute.Component<'social.social-links', true>;
  };
}

export interface ProfileInfoProfile extends Struct.ComponentSchema {
  collectionName: 'components_profile_info_profiles';
  info: {
    displayName: 'profile';
  };
  attributes: {
    Name: Schema.Attribute.String;
    ProfilePIcture: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    ProfileTitle: Schema.Attribute.String;
  };
}

export interface SocialSocialLinks extends Struct.ComponentSchema {
  collectionName: 'components_social_social_links';
  info: {
    displayName: 'Social Links';
  };
  attributes: {
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    text: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blocks.hero-section': BlocksHeroSection;
      'elements.link': ElementsLink;
      'elements.logo': ElementsLogo;
      'layout.header': LayoutHeader;
      'profile-info.profile': ProfileInfoProfile;
      'social.social-links': SocialSocialLinks;
    }
  }
}
