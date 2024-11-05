"use client";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

const ShareButtons = ({ property }) => {
  const shareUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/properties/${property.data._id}`;
  console.log("share url: ", shareUrl);
  console.log("property object in share: ", property);

  return (
    <>
      <h3 className="text-xl font-bold text-center pt-2">
        Share This Property:
      </h3>
      <div className="flex gap-4 justify-center pb-5">
        {/* Share buttons with unified styles */}
        <FacebookShareButton
          url={shareUrl}
          quote={property.data.title}
          hashtag={`#${property.data.propertyType?.replace(/\s/g, "")} For ${
            property.data.listingType
          }`}
          className="share-button"
        >
          <FacebookIcon size={30} round={true} />
        </FacebookShareButton>

        <TwitterShareButton
          url={shareUrl}
          title={property.data.title}
          hashtags={[
            `${property.data.propertyType?.replace(/\s/g, "")} For ${
              property.data.listingType
            }`,
          ]}
          className="share-button"
        >
          <TwitterIcon size={30} round={true} />
        </TwitterShareButton>

        <WhatsappShareButton
          url={shareUrl}
          title={property.data.title}
          separator=":: "
          className="share-button"
        >
          <WhatsappIcon size={30} round={true} />
        </WhatsappShareButton>

        <EmailShareButton
          url={shareUrl}
          subject={property.data.title}
          body={`Check out this property listing: ${shareUrl}`}
          className="share-button"
        >
          <EmailIcon size={30} round={true} />
        </EmailShareButton>
      </div>

      <style jsx>{`
        .share-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: #f5f5f5; /* Light background for buttons */
          transition: background-color 0.3s, transform 0.2s;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
        }

        .share-button:hover {
          background-color: #e0e0e0; /* Darker shade on hover */
          transform: scale(1.05); /* Slight scaling effect */
        }
      `}</style>
    </>
  );
};

export default ShareButtons;
