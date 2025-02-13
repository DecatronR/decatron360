"use client";
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const TreeGraph = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const width = 800;
    const height = 600;

    // Clear previous SVG
    d3.select(svgRef.current).selectAll("*").remove();

    // Create an SVG element
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(50, 50)"); // Margin

    // Create tree layout
    const treeLayout = d3.tree().size([width - 100, height - 200]);
    const root = d3.hierarchy(data);
    treeLayout(root);

    // Create links (paths between nodes)
    svg
      .selectAll("path")
      .data(root.links())
      .enter()
      .append("path")
      .attr(
        "d",
        d3
          .linkHorizontal()
          .x((d) => d.y) // Flips X and Y for a vertical tree
          .y((d) => d.x)
      )
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-width", 2);

    // Create nodes (circles)
    const nodes = svg
      .selectAll("g.node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.y},${d.x})`);

    nodes
      .append("circle")
      .attr("r", 10)
      .attr("fill", (d) =>
        d.depth === 0 ? "blue" : d.depth === 1 ? "green" : "orange"
      );

    // Add labels
    nodes
      .append("text")
      .attr("dy", 4)
      .attr("x", (d) => (d.children ? -15 : 15))
      .attr("text-anchor", (d) => (d.children ? "end" : "start"))
      .text((d) => d.data.name)
      .attr("font-size", "12px");
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default TreeGraph;
