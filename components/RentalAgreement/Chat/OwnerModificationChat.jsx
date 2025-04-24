import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
// Initialize socket connection
const socket = io(baseUrl);

const OwnerModificationChat = ({ ownerId, clientId, rightSectionWidth }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!ownerId) {
      return;
    }

    // Register the owner with the socket server
    socket.emit("register", ownerId);

    // Listen for incoming messages
    socket.on("receivePrivateMessage", (message) => {
      if (
        (message.from === ownerId && message.to === clientId) ||
        (message.from === clientId && message.to === ownerId)
      ) {
        setComments((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("receivePrivateMessage");
    };
  }, [ownerId, clientId]);

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
      from: ownerId,
      to: clientId,
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
    <div
      className="w-full lg:w-1/3 bg-gray-100 shadow-md rounded-md p-4 sm:p-6 flex flex-col max-h-[1000px]"
      style={{ width: `${rightSectionWidth}%` }}
    >
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Modification Request
      </h3>

      {/* Messages container */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-auto bg-white p-4 rounded-lg max-h-[600px] space-y-4 custom-scrollbar"
      >
        {comments.length > 0 ? (
          comments.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg max-w-xs break-words text-sm ${
                msg.from === ownerId
                  ? "bg-blue-200 text-gray-800 self-end"
                  : "bg-green-200 text-gray-800 self-start"
              }`}
            >
              <p>{msg.text}</p>
              <span className="text-xs text-gray-500 block mt-2">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No messages yet.</p>
        )}
      </div>

      {/* Input & Submit Button */}
      <div className="mt-6 flex flex-col space-y-3">
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ease-in-out duration-200"
          rows={4}
          placeholder="Respond to tenant's request..."
          value={comment}
          onChange={handleCommentChange}
        ></textarea>

        <button
          onClick={handleSubmitComment}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all ease-in-out duration-200"
        >
          Submit Response
        </button>
      </div>
    </div>
  );
};

export default OwnerModificationChat;
