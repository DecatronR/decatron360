import { useEffect, useState } from "react";

const OwnerConversationList = ({ onTenantSelect }) => {
  const [conversations, setConversations] = useState([]);

  // Example logic to fetch conversations, replace with actual logic
  useEffect(() => {
    // Simulate fetching conversations from the backend
    const fetchedConversations = [
      {
        tenantId: "tenant1",
        tenantName: "Tenant 1",
        lastMessage: "Modification request 1...",
      },
      {
        tenantId: "tenant2",
        tenantName: "Tenant 2",
        lastMessage: "Modification request 2...",
      },
    ];
    setConversations(fetchedConversations);
  }, []);

  return (
    <div className="w-1/4 p-4 bg-gray-100">
      <h2 className="text-lg font-medium">Pending Modification Requests</h2>
      <ul>
        {conversations.map((conversation, index) => (
          <li
            key={index}
            className="cursor-pointer p-2 hover:bg-blue-100"
            onClick={() => onTenantSelect(conversation.tenantId)}
          >
            <h4 className="font-semibold">{conversation.tenantName}</h4>
            <p className="text-sm">{conversation.lastMessage}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OwnerConversationList;
