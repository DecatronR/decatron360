"use client";
import React, { useEffect, useRef, useState } from "react";
import TreeGraph from "components/TreeGraph/AgentTreeGraph";
import * as d3 from "d3";
import {
  ShieldCheck,
  ShieldX,
  Users,
  Home,
  UserCheck,
  CalendarCheck,
} from "lucide-react";
import StarRatings from "react-star-ratings";

const data = {
  name: "Agent A",
  image: "/images/agentA.png",
  role: "agent",
  rating: 4.5,
  verified: true,
  roleSpecificData: 3,
  children: [
    {
      name: "Property Manager 1",
      image: "/images/propertyManager1.png",
      role: "propertyManager",
      rating: 4.2,
      verified: true,
      roleSpecificData: 2, //role specific data for property managers would be number of listings
      children: [
        {
          name: "Client 1",
          image: "/images/client1.png",
          role: "client",
          rating: 3.8,
          verified: false,
          roleSpecificData: 12,
        },
        {
          name: "Client 2",
          image: "/images/client2.png",
          role: "client",
          rating: 4.0,
          verified: true,
          roleSpecificData: 7,
        },
      ],
    },
    {
      name: "Property Manager 2",
      image: "/images/propertyManager2.png",
      role: "propertyManager",
      rating: 4.0,
      verified: false,
      roleSpecificData: 1,
      children: [
        {
          name: "Client 3",
          image: "/images/client3.png",
          role: "client",
          rating: 3.5,
          verified: true,
          roleSpecificData: 9, //role specific data for property managers would be number of inspections
        },
      ],
    },
    {
      name: "Property Manager 3",
      image: "/images/propertyManager3.png",
      role: "propertyManager",
      rating: 4.7,
      verified: true,
      roleSpecificData: 10,
      children: [],
    },
  ],
};

const AgentNetworkMap = () => {
  const svgRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const g = svg.select("g");

    const zoom = d3.zoom().on("zoom", (event) => {
      g.attr("transform", event.transform);
    });

    svg.call(zoom);
  }, []);

  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };

  const legend = [
    { role: "Agent", color: "green" },
    { role: "Property Manager", color: "blue" },
    { role: "Client", color: "orange" },
  ];

  const roleIcons = {
    propertyManager: <Home className="w-5 h-5 text-blue-500" />,
    agent: <UserCheck className="w-5 h-5 text-green-500" />,
    client: <CalendarCheck className="w-5 h-5 text-orange-500" />,
  };

  return (
    <section className="flex flex-col h-screen overflow-hidden min-w-0">
      {/* Legend */}
      <div className="flex items-center gap-4 bg-gray-200 p-4 shadow-md">
        {legend.map(({ role, color }) => (
          <div key={role} className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: color }}
            ></span>
            <span className="text-sm font-medium">{role}</span>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-1/4 bg-gray-50 p-8 pl-10 overflow-y-auto shadow-lg border-r border-gray-200">
          <h3 className="text-lg font-semibold text-primary-600 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-500" /> User Details
          </h3>

          {selectedNode ? (
            <div className="mt-4 space-y-4">
              <img
                src={selectedNode.image}
                alt={selectedNode.name}
                className="w-24 h-24 rounded-full shadow-md border border-gray-200"
              />
              <p className="text-lg font-bold">{selectedNode.name}</p>
              <StarRatings
                rating={selectedNode.rating}
                starRatedColor="#FFD700"
                numberOfStars={5}
                starDimension="20px"
                starSpacing="2px"
              />

              {/* Verification Status */}
              <div className="flex items-center gap-2 text-sm font-medium">
                {selectedNode.verified ? (
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                ) : (
                  <ShieldX className="w-5 h-5 text-gray-400" />
                )}
                <span>{selectedNode.verified ? "Verified" : "Unverified"}</span>
              </div>

              {/* Connection Info */}
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Users className="w-5 h-5 text-blue-500" />
                <span>{selectedNode.children?.length || 0} Connections</span>
              </div>

              {/* Role Specific Data */}
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                {roleIcons[selectedNode.role] || (
                  <Users className="w-5 h-5 text-gray-500" />
                )}
                <span>
                  {selectedNode.roleSpecificData}{" "}
                  {selectedNode.role === "propertyManager"
                    ? "Properties"
                    : selectedNode.role === "agent"
                    ? "Clients"
                    : "Inspections"}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 mt-4">
              Click on a user to view details
            </p>
          )}
        </div>

        {/* Tree Graph */}
        <div className="flex-1 flex justify-center items-center bg-white overflow-auto">
          <svg ref={svgRef} className="w-full h-full overflow-visible">
            <g transform="translate(50,50)">
              <TreeGraph data={data} onNodeClick={handleNodeClick} />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default AgentNetworkMap;
