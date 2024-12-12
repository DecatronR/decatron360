import React from "react";

const PostSelectionDialogue = ({
  isOpen,
  onClose,
  posts,
  handlePostSelection,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-4 w-1/2"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4">Select a Post</h2>
        <ul>
          {posts.map((post, index) => (
            <li key={index} className="mb-4">
              <div className="flex items-center">
                <div className="mr-4">
                  <img
                    src={post.full_picture}
                    alt={post.message}
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <div>
                  <p className="text-lg font-bold">{post.message}</p>
                  <p className="text-sm text-gray-600">{post.created_time}</p>
                </div>
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handlePostSelection(post)}
              >
                Select
              </button>
            </li>
          ))}
        </ul>
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PostSelectionDialogue;
