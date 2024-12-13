import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";

const UserPostDialog = ({ posts, onPostSelect, dialogOpen, setDialogOpen }) => {
  const [selectedPost, setSelectedPost] = useState(null);

  const handlePostSelect = (postId) => {
    const selectedPostData = posts.find((post) => post.id === postId);
    console.log(selectedPostData);
    setSelectedPost(selectedPostData);
  };

  const handleConfirmSelection = () => {
    if (selectedPost) {
      onPostSelect(selectedPost);
      setDialogOpen(false);
    }
  };

  const handleCancel = () => {
    setSelectedPost(null); // Reset selected post
    setDialogOpen(false); // Close the dialog
  };

  return (
    <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
      {/* Overlay */}
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />

      {/* Dialog Content */}
      <Dialog.Content className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="relative bg-white p-6 rounded-lg shadow-lg z-10 overflow-hidden"
          style={{
            width: "90%", // Larger width
            maxWidth: "800px", // Restrict the maximum width
            maxHeight: "80vh", // Limit height to 80% of the viewport height
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Dialog.Title className="text-2xl font-semibold">
            Select a Post
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-gray-600">
            Please select a post to proceed with creating your listing.
          </Dialog.Description>

          {/* Posts Grid */}
          <div
            className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto"
            style={{ flex: "1 1 auto", maxHeight: "calc(80vh - 150px)" }}
          >
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => handlePostSelect(post.id)}
                className={`cursor-pointer p-4 border rounded-md ${
                  selectedPost === post.id
                    ? "bg-blue-100 border-blue-500"
                    : "bg-gray-100"
                } hover:bg-blue-50`}
              >
                {/* Post Content */}
                <h3 className="font-semibold text-sm">
                  {post.message || "No message available"}
                </h3>
                {post.attachments?.data?.[0]?.media?.image?.src && (
                  <img
                    src={post.attachments.data[0].media.image.src}
                    alt="Post media"
                    className="mt-2 rounded-md"
                  />
                )}
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(post.created_time).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={handleCancel}
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSelection}
              disabled={!selectedPost}
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Confirm
            </button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default UserPostDialog;
