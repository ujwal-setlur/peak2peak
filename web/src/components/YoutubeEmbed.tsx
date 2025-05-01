import React from 'react';

type YouTubeEmbedProps = {
  url: string;
  className?: string;
};

export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ url, className }) => {
  const videoId = url.split('v=')[1];
  if (!videoId) {
    return null;
  }
  return (
    <div className="w-full">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="About Me"
        frameBorder="0"
        allowFullScreen
        className={className ? className : 'h-[320px] w-full md:h-[540px]'}
      ></iframe>
    </div>
  );
};
