"use client";
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const AgentTreeGraph = ({ data, onNodeClick }) => {
  const svgRef = useRef();

  const roleColors = {
    Agent: "green",
    "Property Manager": "blue",
    Client: "orange",
  };

  const determineRole = (depth) => {
    if (depth === 0) return "Agent";
    if (depth === 1) return "Property Manager";
    return "Client";
  };

  useEffect(() => {
    const width = 800;
    const height = 600;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(50, 50)");

    const treeLayout = d3.tree().size([width - 100, height - 200]);
    const root = d3.hierarchy(data);
    treeLayout(root);

    // Links (connecting lines)
    svg
      .selectAll("path")
      .data(root.links())
      .enter()
      .append("path")
      .attr(
        "d",
        d3
          .linkHorizontal()
          .x((d) => d.y)
          .y((d) => d.x)
      )
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-width", 2);

    // Nodes (images & text)
    const nodes = svg
      .selectAll("g.node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.y},${d.x})`)
      .style("cursor", "pointer")
      .on("click", (event, d) => onNodeClick(d.data));

    // Add images
    nodes
      .append("image")
      .attr("xlink:href", (d) => d.data.image)
      .attr("x", -15)
      .attr("y", -15)
      .attr("width", 30)
      .attr("height", 30)
      .attr(
        "clip-path",
        (d) => `url(#clip-${d.data.name?.replace(/\s/g, "")})`
      );

    nodes
      .append("circle")
      .attr("r", 18)
      .attr("stroke", (d) => roleColors[determineRole(d.depth)])
      .attr("stroke-width", 3)
      .attr("fill", "none");

    // Add text labels
    nodes
      .append("text")
      .attr("dy", 35)
      .attr("text-anchor", "middle")
      .text((d) => d.data.name)
      .attr("font-size", "12px");
  }, [data, onNodeClick]);

  return <svg ref={svgRef}></svg>;
};

export default AgentTreeGraph;
