import React from 'react';

interface SecureImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

const SecureImage: React.FC<SecureImageProps> = ({ src, alt, ...props }) => {
  return (
    <img
      {...props}
      src={src}
      alt={alt}
      draggable={false}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
};

export default SecureImage;
