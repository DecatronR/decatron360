import { useEffect, useState, useRef } from "react";
import socket from "lib/socket";
import { fetchMessages } from "utils/api/chat/fetchMessages";
import { Send, Paperclip, Smile, MessageSquare } from "lucide-react";

const OwnerModificationChat = ({ contractId, ownerId, clientId }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [isTyping, setIsTyping] = useState(false);
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

  const handleCommentChange = (e) => {
    setComment(e.target.value);
    setIsTyping(true);
    // Clear typing indicator after 1 second of no typing
    setTimeout(() => setIsTyping(false), 1000);
  };

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
    setIsTyping(false);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  return (
    <div className="w-full bg-white rounded-lg flex flex-col h-full border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 px-4 py-3 border-b border-gray-200 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-800">
              Modification Request
            </h3>
            <p className="text-xs text-gray-600">Chat with tenant</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Online</span>
          </div>
        </div>
      </div>

      {/* Messages container */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-auto bg-gray-50 p-3 sm:p-4 space-y-3 custom-scrollbar"
      >
        {comments.length > 0 ? (
          comments.map((msg, index) => {
            const isOwnMessage = msg.from === ownerId;
            const showDate =
              index === 0 ||
              new Date(msg.timestamp).toDateString() !==
                new Date(comments[index - 1]?.timestamp).toDateString();

            return (
              <div key={msg.messageId}>
                {showDate && (
                  <div className="flex justify-center my-4">
                    <span className="bg-white px-3 py-1 rounded-full text-xs text-gray-500 border border-gray-200">
                      {new Date(msg.timestamp).toLocaleDateString([], {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
                <div
                  className={`flex items-end space-x-2 ${
                    isOwnMessage ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isOwnMessage && (
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-white font-medium">
                        {msg.role === "client" ? "C" : "T"}
                      </span>
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[75%] sm:max-w-[65%] ${
                      isOwnMessage ? "order-2" : "order-1"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-2xl ${
                        isOwnMessage
                          ? "bg-primary-600 text-white rounded-br-md"
                          : "bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100"
                      }`}
                    >
                      <p className="text-sm leading-relaxed break-words">
                        {msg.text}
                      </p>
                    </div>
                    <div
                      className={`flex items-center mt-1 space-x-1 ${
                        isOwnMessage ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span className="text-[10px] text-gray-500">
                        {formatTime(msg.timestamp)}
                      </span>
                      {isOwnMessage && (
                        <div className="w-3 h-3 text-primary-600">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>

                  {isOwnMessage && (
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 order-1">
                      <span className="text-xs text-white font-medium">
                        You
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-gray-600 font-medium">No messages yet</p>
              <p className="text-sm text-gray-500 mt-1">
                Start a conversation about the contract
              </p>
            </div>
          </div>
        )}

        {isTyping && (
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">C</span>
            </div>
            <div className="bg-white p-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input & Submit Button */}
      <div className="bg-white p-3 sm:p-4 border-t border-gray-200 rounded-b-lg">
        <div className="flex items-end gap-2 sm:gap-3">
          <div className="flex-1 relative">
            <textarea
              className="w-full p-3 pr-12 border border-gray-200 rounded-2xl text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              rows={1}
              style={{
                minHeight: "44px",
                maxHeight: "120px",
                height: "44px",
              }}
              placeholder="Type your message..."
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
            <div className="absolute right-2 bottom-2 flex items-center space-x-1">
              <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                <Paperclip className="w-4 h-4 text-gray-400" />
              </button>
              <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                <Smile className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
          <button
            onClick={handleSubmitComment}
            disabled={!comment.trim()}
            className={`p-3 rounded-full transition-all duration-200 flex-shrink-0 ${
              comment.trim()
                ? "bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerModificationChat;
