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
    <div className="w-full bg-gray-100 shadow-md rounded-md flex flex-col h-full">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b">
        <h3 className="text-base md:text-lg font-semibold text-gray-800">
          Modification Request
        </h3>
      </div>

      {/* Messages container */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-auto bg-gray-50 p-2 md:p-4 space-y-2 md:space-y-4 custom-scrollbar"
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
                className={`p-2 md:p-3 rounded-2xl max-w-[85%] md:max-w-[70%] break-words ${
                  msg.from === ownerId
                    ? "bg-primary-100 text-gray-800 rounded-tr-none"
                    : "bg-white text-gray-800 rounded-tl-none shadow-sm"
                }`}
              >
                <p className="text-sm md:text-base">{msg.text}</p>
                <span className="text-[10px] md:text-xs text-gray-500 block mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-sm md:text-base">
              No messages yet
            </p>
          </div>
        )}
      </div>

      {/* Input & Submit Button */}
      <div className="bg-white p-2 md:p-4 border-t">
        <div className="flex items-end gap-2 md:gap-4">
          <div className="flex-1 relative">
            <textarea
              className="w-full p-2 md:p-3 pr-12 border border-gray-200 rounded-full md:rounded-xl text-sm md:text-base resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ease-in-out duration-200"
              rows={1}
              style={{
                minHeight: "40px",
                maxHeight: "120px",
                height: "40px",
              }}
              placeholder="Type a message..."
              value={comment}
              onChange={(e) => {
                handleCommentChange(e);
                // Auto-resize textarea
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitComment();
                }
              }}
            />
          </div>
          <button
            onClick={handleSubmitComment}
            disabled={!comment.trim()}
            className={`p-2 md:p-3 rounded-full ${
              comment.trim()
                ? "bg-primary-600 text-white hover:bg-primary-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            } transition-all ease-in-out duration-200`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 md:w-6 md:h-6"
            >
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerModificationChat;
