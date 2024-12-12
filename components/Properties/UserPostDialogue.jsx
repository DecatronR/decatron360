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
      setDialogOpen(false); // Close the dialog after selecting a post
    }
  };

  const handleCancel = () => {
    setSelectedPost(null); // Reset selected post
    setDialogOpen(false); // Close the dialog
  };

  return (
    <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
      <Dialog.Trigger asChild>
        {/* <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
          Open Posts Dialog
        </button> */}
      </Dialog.Trigger>

      <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
      <Dialog.Content className="fixed inset-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-96">
        <Dialog.Title className="text-2xl font-semibold">
          Select a Post
        </Dialog.Title>
        <Dialog.Description className="mt-2 text-gray-600">
          Please select a post to proceed with creating your listing.
        </Dialog.Description>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <h3 className="font-semibold">{post.title}</h3>
              <p className="text-sm text-gray-700">{post.description}</p>
            </div>
          ))}
        </div>

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
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default UserPostDialog;
