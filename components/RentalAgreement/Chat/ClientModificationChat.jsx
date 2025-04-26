import { useEffect, useRef, useState } from "react";
import socket from "lib/socket";
import { fetchMessages } from "utils/api/chat/fetchMessages";

const ClientModificationChat = ({ contractId, clientId, ownerId }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom on new message
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
    // Register client user on socket server
    console.log("ClientId (current user): ", clientId);
    console.log("OwnerId: ", ownerId);

    socket.emit("register", clientId);

    // Listen for incoming messages
    socket.on("receivePrivateMessage", (message) => {
      const isRelevant =
        (message.from === clientId && message.to === ownerId) ||
        (message.from === ownerId && message.to === clientId);

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
  }, [clientId, ownerId]);

  const handleCommentChange = (e) => setComment(e.target.value);

  const handleSubmitComment = () => {
    if (!comment.trim()) return;

    const newMessage = {
      contractId,
      messageId: `${clientId}-${Date.now()}`,
      from: clientId,
      to: ownerId,
      text: comment.trim(),
      role: "client",
      timestamp: Date.now(),
    };

    // Emit to backend
    socket.emit("sendPrivateMessage", newMessage, (ack) => {
      if (ack.status === "delivered") {
        console.log("Message delivered successfully");
      }
    });

    // Optimistic update (server should also echo)
    setComments((prev) => {
      const exists = prev.find((m) => m.messageId === newMessage.messageId);
      if (exists) return prev;
      return [...prev, newMessage];
    });

    setComment("");
  };

  return (
    <div className="w-full bg-gray-100 shadow-md rounded-md p-4 sm:p-6 flex flex-col max-h-[700px] h-full">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Modification Request (Client)
      </h3>

      {/* Messages container */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-auto bg-white p-4 rounded-lg space-y-4 custom-scrollbar"
      >
        {comments.length > 0 ? (
          comments.map((msg) => (
            <div
              key={msg.messageId}
              className={`flex items-start ${
                msg.from === clientId ? "justify-end" : "justify-start"
              }`}
            >
              {/* Message Bubble */}
              <div
                className={`p-3 rounded-lg max-w-xs break-words text-sm ${
                  msg.from === clientId
                    ? "bg-blue-200 text-gray-800 self-end"
                    : "bg-green-200 text-gray-800 self-start"
                }`}
              >
                <p>{msg.text}</p>
                <span className="text-xs text-gray-500 block mt-2">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No messages yet.</p>
        )}
      </div>

      {/* Input & Submit Button */}
      <div className="mt-4 flex flex-col space-y-3">
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ease-in-out duration-200"
          rows={4}
          placeholder="Message Property Owner ..."
          value={comment}
          onChange={handleCommentChange}
        ></textarea>

        <button
          onClick={handleSubmitComment}
          className="w-full bg-primary-600 text-white py-3 rounded-full hover:bg-primary-700 transition-all ease-in-out duration-200"
        >
          Submit Response
        </button>
      </div>
    </div>
  );
};

export default ClientModificationChat;
