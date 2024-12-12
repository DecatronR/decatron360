import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";

const UserPostDialog = ({ posts, onPostSelect, dialogOpen, setDialogOpen }) => {
  const [selectedPost, setSelectedPost] = useState(null);

  const handlePostSelect = (postId) => {
    setSelectedPost(postId);
  };

  const handleConfirmSelection = () => {
    if (selectedPost) {
      onPostSelect(selectedPost);
      setDialogOpen(false);
    }
  };

  const handleCancel = () => {
    setSelectedPost(null);
    setDialogOpen(false);
  };

  return (
    <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
      <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <Dialog.Content className="fixed inset-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg w-[90%] max-w-lg p-6">
        <Dialog.Title className="text-2xl font-bold text-gray-800">
          Select a Post
        </Dialog.Title>
        <Dialog.Description className="mt-2 text-sm text-gray-600">
          Choose a post to continue. Click "Confirm" when you're done.
        </Dialog.Description>

        <div className="mt-4 grid grid-cols-1 gap-4 max-h-[300px] overflow-y-auto">
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={() => handlePostSelect(post.id)}
              className={`cursor-pointer p-4 border rounded-md transition-colors ${
                selectedPost === post.id
                  ? "bg-blue-50 border-blue-500"
                  : "bg-gray-50 border-gray-300"
              } hover:bg-blue-100`}
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {post.title}
              </h3>
              <p className="text-sm text-gray-500">{post.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={handleCancel}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmSelection}
            disabled={!selectedPost}
            className="bg-primary-500 text-white py-2 px-4 rounded-md hover:bg-primary-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Confirm
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default UserPostDialog;
