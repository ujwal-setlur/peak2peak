import { BlocksRenderer, type BlocksContent } from '@strapi/blocks-react-renderer';
import React from 'react';

const RichTextRenderer: React.FC<{ content: BlocksContent }> = ({ content }) => {
  return (
    <BlocksRenderer
      content={content}
      blocks={{
        link: ({ children, url }) => (
          <a href={url} target="_blank" className="text-teal-600 hover:text-teal-800">
            {children}
          </a>
        ),
      }}
    />
  );
};

export default RichTextRenderer;
