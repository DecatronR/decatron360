"use client";
import React, { useEffect, useRef, useState } from "react";
import TreeGraph from "components/RelationshipMap/TreeGraph";
import * as d3 from "d3";

const data = {
  name: "Property Manager 1",
  children: [
    {
      name: "Agent A",
      children: [{ name: "Client 1" }, { name: "Client 2" }],
    },
    {
      name: "Agent B",
      children: [{ name: "Client 3" }, { name: "Client 4" }],
    },
    {
      name: "Agent C",
      children: [{ name: "Client 5" }, { name: "Client 6" }],
    },
  ],
};

const Dashboard = () => {
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

  return (
    <section className="flex h-screen overflow-hidden min-w-0">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-6 overflow-y-auto shadow-lg">
        <h3 className="text-xl font-semibold text-primary-500">User Details</h3>
        {selectedNode ? (
          <div className="mt-4">
            <p className="text-lg font-bold">{selectedNode.name}</p>
            {selectedNode.children && (
              <p className="text-sm text-gray-600">
                {selectedNode.children.length} connections
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-500">Click on a user to view details</p>
        )}
      </div>
      {/* Main Content */}
      <div className="flex-1 flex justify-center items-center bg-white overflow-auto">
        <svg ref={svgRef} className="w-full h-full overflow-visible">
          <g transform="translate(50,50)">
            <TreeGraph data={data} onNodeClick={handleNodeClick} />
          </g>
        </svg>
      </div>
    </section>
  );
};

export default Dashboard;
