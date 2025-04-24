import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

// Initialize socket connection
const socket = io("http://localhost:1280");

const OwnerModificationChat = ({ tenantId }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const scrollRef = useRef(null);
  const currentOwnerId = sessionStorage.getItem("userId");

  useEffect(() => {
    if (!currentOwnerId) {
      return;
    }

    // Register the owner with the socket server
    socket.emit("register", currentOwnerId);

    // Listen for incoming messages
    socket.on("receivePrivateMessage", (message) => {
      if (
        (message.from === currentOwnerId && message.to === tenantId) ||
        (message.from === tenantId && message.to === currentOwnerId)
      ) {
        setComments((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("receivePrivateMessage");
    };
  }, [currentOwnerId, tenantId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments]);

  const handleCommentChange = (e) => setComment(e.target.value);

  const handleSubmitComment = () => {
    if (!comment.trim()) return;

    const newMessage = {
      from: currentOwnerId,
      to: tenantId,
      text: comment.trim(),
      timestamp: Date.now(),
    };

    // Emit to backend
    socket.emit("sendPrivateMessage", newMessage);

    // Optimistic update
    setComments((prev) => [...prev, newMessage]);
    setComment("");
  };

  return (
    <div className="w-1/4 p-4">
      <h3 className="text-lg font-medium mb-3">Modification Request</h3>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto max-h-[700px] bg-white p-2 rounded-md border space-y-2"
      >
        {comments.length > 0 ? (
          comments.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-md text-sm ${
                msg.from === currentOwnerId
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
        placeholder="Respond to tenant's request..."
        value={comment}
        onChange={handleCommentChange}
      ></textarea>

      <button
        onClick={handleSubmitComment}
        className="mt-3 w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition"
      >
        Submit Response
      </button>
    </div>
  );
};

export default OwnerModificationChat;
