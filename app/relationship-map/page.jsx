import React from "react";
import NetworkGraph from "components/RelationshipMap/NetworkGraph";

const data = {
  nodes: [
    { id: "Property Manager 1", group: "manager" },
    { id: "Property Manager 2", group: "manager" },
    { id: "Agent A", group: "agent" },
    { id: "Agent B", group: "agent" },
    { id: "Client 1", group: "client" },
    { id: "Client 2", group: "client" },
  ],
  links: [
    { source: "Property Manager 1", target: "Agent A" },
    { source: "Property Manager 1", target: "Agent B" },
    { source: "Agent A", target: "Client 1" },
    { source: "Agent B", target: "Client 2" },
  ],
};

const Dashboard = () => {
  return (
    <div>
      <h2>Network Graph</h2>
      <NetworkGraph data={data} />
    </div>
  );
};

export default Dashboard;
