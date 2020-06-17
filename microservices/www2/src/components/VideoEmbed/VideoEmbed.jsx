import React, { useContext } from 'react';
import LanguageContext from '../../contexts/LanguageContext';
import './VideoEmbed.scss';

const VideoEmbed = ({ primary }) => {
  const [language] = useContext(LanguageContext);
  const video = primary.video;
  const videoId = video.embed_url.split('?v=')[1];
  const parameters = `&modestbranding=1&rel=0&hl=${language}`;
  const newSrc = `${video.provider_url}/embed/${videoId}?${parameters}`;
  const aspectRatio = `${(100 * video.height) / video.width}%`;

  return (
    <div className="video-embed container--desktop">
      <div
        className="video-embed__wrapper"
        style={{ paddingBottom: aspectRatio }}
      >
        <iframe
          title={video.title}
          width={video.width}
          height={video.height}
          src={newSrc}
          /* eslint-disable react/no-unknown-property */
          frameborder="0"
          allowfullscreen
          /* eslint-enable react/no-unknown-property */
        />
      </div>
    </div>
  );
};

export default VideoEmbed;
