import React from 'react';
import EmailIcon from 'react-share/lib/EmailIcon';
import EmailShareButton from 'react-share/lib/EmailShareButton';
import FacebookIcon from 'react-share/lib/FacebookIcon';
import FacebookShareButton from 'react-share/lib/FacebookShareButton';
import LinkedinIcon from 'react-share/lib/LinkedinIcon';
import LinkedinShareButton from 'react-share/lib/LinkedinShareButton';
import WhatsappIcon from 'react-share/lib/WhatsappIcon';
import WhatsappShareButton from 'react-share/lib/WhatsappShareButton';
import './PageShare.scss';

const PageShare = ({ title }) => {
  const url = window.location.href;
  const iconColor = '#2e7eff';
  const bgStyle = {
    fill: 'transparent',
  };
  return (
    <div className="page-share">
      <div className="page-share__wrapper">
        <FacebookShareButton url={url} className="share-button">
          <FacebookIcon size={40} iconFillColor={iconColor} bgStyle={bgStyle} />
        </FacebookShareButton>
      </div>

      <div className="page-share__wrapper">
        <LinkedinShareButton
          url={url}
          title={title}
          windowWidth={740}
          windowHeight={600}
          className="share-button"
        >
          <LinkedinIcon size={40} iconFillColor={iconColor} bgStyle={bgStyle} />
        </LinkedinShareButton>
      </div>

      <div className="page-share__wrapper">
        <WhatsappShareButton
          url={url}
          title={title}
          separator=" - "
          className="share-button"
        >
          <WhatsappIcon size={30} iconFillColor={iconColor} bgStyle={bgStyle} />
        </WhatsappShareButton>
      </div>

      <div className="page-share__wrapper">
        <EmailShareButton
          url={url}
          subject={title}
          body={`${title} - e-Potek - ${url}`}
          className="share-button"
        >
          <EmailIcon size={40} iconFillColor={iconColor} bgStyle={bgStyle} />
        </EmailShareButton>
      </div>
    </div>
  );
};

export default PageShare;

// .Rectangle {
//   width: 50px;
//   height: 200px;
//   background-color: #f4f4f4;
// }
