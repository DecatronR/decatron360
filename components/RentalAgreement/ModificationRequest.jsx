import { useEffect, useState } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:1280");

const ModificationRequestChat = ({ currentUserId, recipientUserId }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState();
  const [showCommentBox, setShowCommentBox] = useState(true); // control this from parent if needed

  useEffect(() => {
    // Register this user with the backend
    socket.emit("register", currentUserId);

    // Listen for messages sent to this user
    socket.on("receivePrivateMessage", (message) => {
      // Filter to include only messages relevant to this chat
      if (
        (message.from === currentUserId && message.to === recipientUserId) ||
        (message.from === recipientUserId && message.to === currentUserId)
      ) {
        setComments((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("receivePrivateMessage");
    };
  }, [currentUserId, recipientUserId]);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmitComment = () => {
    if (!comment.trim()) return;

    const newMessage = {
      from: currentUserId,
      to: recipientUserId,
      text: comment.trim(),
      timestamp: Date.now(),
    };

    // Emit the message to the backend
    socket.emit("sendPrivateMessage", newMessage);

    // Optionally add it to local state (server should echo too)
    setComments((prev) => [...prev, newMessage]);
    setComment("");
  };

  if (!showCommentBox) return null;

  return (
    <div className="w-full lg:w-1/3 bg-gray-100 shadow-md rounded-md p-4 sm:p-6 flex flex-col max-h-[1000px]">
      <h3 className="text-lg font-medium text-gray-800 mb-3">
        Modification Requests
      </h3>
      <div className="flex-1 overflow-y-auto max-h-[700px] space-y-2 border p-2 rounded-md bg-white">
        {comments.length > 0 ? (
          comments.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-md text-sm ${
                msg.from === currentUserId
                  ? "bg-blue-100 text-gray-700"
                  : "bg-green-100 text-gray-800"
              }`}
            >
              <p>{msg.text}</p>
              <span className="text-xs text-gray-500 block mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No messages yet.</p>
        )}
      </div>
      <textarea
        className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
        rows={2}
        placeholder="Describe the required modifications..."
        value={comment}
        onChange={handleCommentChange}
      ></textarea>
      <button
        onClick={handleSubmitComment}
        className="mt-3 w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition"
      >
        Submit Request
      </button>
    </div>
  );
};

export default ModificationRequestChat;
