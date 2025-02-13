"use client";
import React, { useEffect, useRef, useState } from "react";
import TreeGraph from "components/RelationshipMap/TreeGraph";
import * as d3 from "d3";

const data = {
  name: "Property Manager 1",
  image: "/images/manager.png",
  rating: 4.5,
  verified: true,
  children: [
    {
      name: "Agent A",
      image: "/images/agentA.png",
      rating: 4.0,
      verified: true,
      children: [
        {
          name: "Client 1",
          image: "/images/client1.png",
          rating: 3.5,
          verified: false,
        },
        {
          name: "Client 2",
          image: "/images/client2.png",
          rating: 4.2,
          verified: true,
        },
      ],
    },
    {
      name: "Agent B",
      image: "/images/agentB.png",
      rating: 3.8,
      verified: false,
      children: [
        {
          name: "Client 3",
          image: "/images/client3.png",
          rating: 4.7,
          verified: true,
        },
        {
          name: "Client 4",
          image: "/images/client4.png",
          rating: 3.9,
          verified: false,
        },
      ],
    },
  ],
};

const NetworkMap = () => {
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
    { role: "Property Manager", color: "blue" },
    { role: "Agent", color: "green" },
    { role: "Client", color: "orange" },
  ];

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
        {/* Sidebar */}
        <div className="w-1/4 bg-gray-100 p-6 overflow-y-auto shadow-lg">
          <h3 className="text-xl font-semibold text-primary-500">
            User Details
          </h3>
          {selectedNode ? (
            <div className="mt-4 flex flex-col items-center">
              {/* User Image */}
              <img
                src={selectedNode.image}
                alt={selectedNode.name}
                className="w-24 h-24 rounded-full shadow-md"
              />

              {/* User Name */}
              <p className="text-lg font-bold mt-3">{selectedNode.name}</p>

              {/* Star Rating */}
              <div className="flex items-center mt-2">
                {[...Array(5)].map((_, index) => (
                  <span key={index}>
                    {index < Math.round(selectedNode.rating) ? (
                      <span className="text-yellow-500 text-xl">★</span>
                    ) : (
                      <span className="text-gray-300 text-xl">★</span>
                    )}
                  </span>
                ))}
              </div>

              {/* Verification Status */}
              <div className="flex items-center gap-2 mt-3">
                <span
                  className={`w-3 h-3 rounded-full ${
                    selectedNode.verified ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></span>
                <span className="text-sm">
                  {selectedNode.verified ? "Verified" : "Unverified"}
                </span>
              </div>

              {/* Connection Info */}
              {selectedNode.children && (
                <p className="text-sm text-gray-600 mt-2">
                  {selectedNode.children.length} connections
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Click on a user to view details</p>
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

export default NetworkMap;
