"use client";
import { Share2, Copy, Check, Link as LinkIcon } from "lucide-react";
import { useState } from "react";
import { useSnackbar } from "notistack";

const ShareButtons = ({ property }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const shareUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/properties/${property.data._id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      enqueueSnackbar("Link copied to clipboard!", { variant: "success" });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      enqueueSnackbar("Failed to copy link", { variant: "error" });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.data.title,
          text: `Check out this ${property.data.propertyType} for ${property.data.listingType}`,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled or error occurred
        setShowShareModal(true);
      }
    } else {
      setShowShareModal(true);
    }
  };

  return (
    <>
      <div className="w-full bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-center mb-4">
          <Share2 className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">
            Share Property
          </h3>
        </div>

        {/* Primary Share Button */}
        <button
          onClick={handleShare}
          className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center mb-3"
        >
          <Share2 className="w-5 h-5 mr-2" />
          Share
        </button>

        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          className={`w-full py-3 px-4 rounded-lg border transition-all duration-200 flex items-center justify-center ${
            copied
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-white hover:bg-gray-50 border-gray-300 text-gray-700 hover:text-gray-900"
          }`}
        >
          {copied ? (
            <>
              <Check className="w-5 h-5 mr-2 text-green-600" />
              <span className="font-medium">Copied!</span>
            </>
          ) : (
            <>
              <LinkIcon className="w-5 h-5 mr-2" />
              <span className="font-medium">Copy link</span>
            </>
          )}
        </button>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 p-4">
          <div className="bg-white rounded-t-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Share this property</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCopyLink}
                className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                  copied
                    ? "bg-green-50 border-green-200"
                    : "bg-white hover:bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center">
                  <LinkIcon
                    className={`w-6 h-6 mr-3 ${
                      copied ? "text-green-600" : "text-gray-600"
                    }`}
                  />
                  <div className="text-left">
                    <p
                      className={`font-medium ${
                        copied ? "text-green-700" : "text-gray-900"
                      }`}
                    >
                      {copied ? "Link copied!" : "Copy link"}
                    </p>
                    <p className="text-sm text-gray-500">Share via link</p>
                  </div>
                </div>
                {copied && <Check className="w-5 h-5 text-green-600" />}
              </button>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-500 mb-3">
                  Or share directly to:
                </p>
                <div className="grid grid-cols-4 gap-3">
                  <button className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                      <span className="text-white font-bold text-sm">f</span>
                    </div>
                    <span className="text-xs text-gray-600">Facebook</span>
                  </button>
                  <button className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center mb-2">
                      <span className="text-white font-bold text-sm">𝕏</span>
                    </div>
                    <span className="text-xs text-gray-600">Twitter</span>
                  </button>
                  <button className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mb-2">
                      <span className="text-white font-bold text-sm">W</span>
                    </div>
                    <span className="text-xs text-gray-600">WhatsApp</span>
                  </button>
                  <button className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center mb-2">
                      <span className="text-white font-bold text-sm">@</span>
                    </div>
                    <span className="text-xs text-gray-600">Email</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareButtons;
