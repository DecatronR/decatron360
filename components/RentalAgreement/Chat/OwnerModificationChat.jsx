import { useEffect, useState, useRef } from "react";
import socket from "lib/socket";
import { fetchMessages } from "utils/api/chat/fetchMessages";
const OwnerModificationChat = ({ contractId, ownerId, clientId }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const scrollRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments]);

  useEffect(() => {
    const handleFetchMessageHistory = async () => {
      try {
        const res = await fetchMessages(contractId);
        console.log("Message history: ", res);
        if (res?.data) {
          const formattedMessages = res.data.map((msg) => ({
            messageId: msg.messageId,
            from: msg.from._id,
            to: msg.to._id,
            text: msg.text,
            role: msg.role,
            timestamp: msg.timestamp,
          }));

          setComments(
            formattedMessages.sort(
              (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
            )
          );
        }
      } catch (error) {
        console.error("Error fetching messages", error);
      }
    };
    handleFetchMessageHistory();
  }, [contractId]);

  useEffect(() => {
    // Register the owner with the socket server
    console.log("OwnerId (current user): ", ownerId);
    console.log("ClientId: ", clientId);

    socket.emit("register", ownerId);

    // Listen for incoming messages
    socket.on("receivePrivateMessage", (message) => {
      const isRelevant =
        (message.from === ownerId && message.to === clientId) ||
        (message.from === clientId && message.to === ownerId);

      if (isRelevant) {
        setComments((prev) => {
          const exists = prev.find((m) => m.messageId === message.messageId);
          if (exists) return prev;
          return [...prev, message];
        });
      }
    });

    return () => {
      socket.off("receivePrivateMessage");
    };
  }, [ownerId, clientId]);

  const handleCommentChange = (e) => setComment(e.target.value);

  const handleSubmitComment = () => {
    if (!comment.trim()) return;

    const newMessage = {
      contractId,
      messageId: `${ownerId}-${Date.now()}`,
      from: ownerId,
      to: clientId,
      text: comment.trim(),
      role: "owner",
      timestamp: Date.now(),
    };

    socket.emit("sendPrivateMessage", newMessage, (ack) => {
      if (ack.status === "delivered") {
        console.log("Message delivered successfully");
      }
    });

    // Optimistic update
    setComments((prev) => {
      const exists = prev.find((m) => m.messageId === newMessage.messageId);
      if (exists) return prev;
      return [...prev, newMessage];
    });

    setComment("");
  };

  return (
    <div className="w-full bg-gray-100 shadow-md rounded-md p-3 sm:p-6 flex flex-col max-h-[700px] h-full">
      <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-gray-800">
        Modification Request (Owner)
      </h3>

      {/* Messages container */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-auto bg-white p-3 md:p-4 rounded-lg space-y-3 md:space-y-4 custom-scrollbar"
      >
        {comments.length > 0 ? (
          comments.map((msg) => (
            <div
              key={msg.messageId}
              className={`flex items-start ${
                msg.from === ownerId ? "justify-end" : "justify-start"
              }`}
            >
              {/* Message Bubble */}
              <div
                className={`p-2 md:p-3 rounded-lg max-w-[75%] md:max-w-xs break-words text-xs md:text-sm ${
                  msg.from === ownerId
                    ? "bg-blue-200 text-gray-800 self-end"
                    : "bg-green-200 text-gray-800 self-start"
                }`}
              >
                <p>{msg.text}</p>
                <span className="text-xs text-gray-500 block mt-1 md:mt-2">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-xs md:text-sm">No messages yet.</p>
        )}
      </div>

      {/* Input & Submit Button */}
      <div className="mt-3 md:mt-4 flex flex-col space-y-2 md:space-y-3">
        <textarea
          className="w-full p-3 md:p-4 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ease-in-out duration-200"
          rows={3}
          placeholder="Message Client..."
          value={comment}
          onChange={handleCommentChange}
        ></textarea>

        <button
          onClick={handleSubmitComment}
          className="w-full bg-primary-600 text-white text-sm py-2 md:py-3 rounded-full hover:bg-primary-700 transition-all ease-in-out duration-200"
        >
          Submit Response
        </button>
      </div>
    </div>
  );
};

export default OwnerModificationChat;
