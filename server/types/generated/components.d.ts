import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_blocks_hero_sections';
  info: {
    description: '';
    displayName: 'Hero Section';
  };
  attributes: {
    LogoSection: Schema.Attribute.Component<'elements.logo', false>;
    LongDescription: Schema.Attribute.Blocks;
    MainHeading: Schema.Attribute.String;
    ProfileDetails: Schema.Attribute.Component<'profile-info.profile', false>;
    ShortDescription: Schema.Attribute.Text;
    SubTitle: Schema.Attribute.String;
  };
}

export interface ElementsLogo extends Struct.ComponentSchema {
  collectionName: 'components_elements_logos';
  info: {
    description: '';
    displayName: 'Logo';
  };
  attributes: {
    Logo: Schema.Attribute.Media<'images'>;
    TagLine: Schema.Attribute.String;
  };
}

export interface LayoutHeader extends Struct.ComponentSchema {
  collectionName: 'components_layout_headers';
  info: {
    description: '';
    displayName: 'Header';
  };
  attributes: {
    Logo: Schema.Attribute.Media<'images'>;
    Social: Schema.Attribute.Component<'social.social-links', true>;
  };
}

export interface ProfileInfoProfile extends Struct.ComponentSchema {
  collectionName: 'components_profile_info_profiles';
  info: {
    description: '';
    displayName: 'profile';
  };
  attributes: {
    Name: Schema.Attribute.String;
    ProfilePicture: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    ProfileTitle: Schema.Attribute.String;
  };
}

export interface SocialSocialLinks extends Struct.ComponentSchema {
  collectionName: 'components_social_social_links';
  info: {
    description: '';
    displayName: 'Social Links';
  };
  attributes: {
    Icon: Schema.Attribute.Media<'images'>;
    IsExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Text: Schema.Attribute.String;
    Url: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blocks.hero-section': BlocksHeroSection;
      'elements.logo': ElementsLogo;
      'layout.header': LayoutHeader;
      'profile-info.profile': ProfileInfoProfile;
      'social.social-links': SocialSocialLinks;
    }
  }
}
