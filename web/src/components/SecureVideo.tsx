import React from 'react';

const SecureVideo: React.FC<React.VideoHTMLAttributes<HTMLVideoElement>> = ({
  children,
  ...props
}) => {
  return (
    <video
      {...props}
      controls
      controlsList="nodownload"
      disablePictureInPicture
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
    </video>
  );
};

export default SecureVideo;
