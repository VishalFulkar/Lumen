import { useEffect, useRef } from "react";
import * as d3 from "d3";

const typeColors = {
    concept: "#c084fc",      // Purple
    person: "#34d399",       // Emerald
    organization: "#60a5fa", // Blue
    event: "#fbbf24",        // Amber
    source: "#f43f5e",       // Rose
};

const KnowledgeGraph = ({ graph }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!graph || !graph.nodes || !graph.edges) return;

        const width = 600;
        const height = 400;

        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3.select(svgRef.current)
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("width", "100%")
            .attr("height", "100%")
            .style("border", "1px solid #2d2d30")
            .style("border-radius", "8px")
            .style("background-color", "#131314");

        // Deep copy nodes and edges to avoid mutation of props and filter out invalid links
        const nodes = graph.nodes.map(n => ({ ...n }));
        const nodeIds = new Set(nodes.map(n => n.id));
        const edges = graph.edges
            .filter(e => {
                const sourceId = typeof e.source === 'object' ? e.source.id : e.source;
                const targetId = typeof e.target === 'object' ? e.target.id : e.target;
                return nodeIds.has(sourceId) && nodeIds.has(targetId);
            })
            .map(e => ({ ...e }));

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(edges).id((d) => d.id).distance(100))
            .force("charge", d3.forceManyBody().strength(-200))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collide", d3.forceCollide(35));

        const link = svg
            .selectAll("line")
            .data(edges)
            .enter()
            .append("line")
            .attr("stroke", "#2d2d30")
            .attr("stroke-width", 1.5)
            .attr("opacity", 0.8);

        // Add titles to edges for relationship tooltips
        link.append("title")
            .text((d) => d.relation);

        const node = svg
            .selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("r", (d) => Math.min(15, Math.max(8, (d.weight || 1) * 5)))
            .attr("fill", (d) => typeColors[d.type] || "#a3a3a3")
            .attr("stroke", "#131314")
            .attr("stroke-width", 1.5)
            .attr("cursor", "grab")
            .call(drag(simulation));

        // Add native tooltip to node
        node.append("title")
            .text((d) => `${d.label} (${d.type ? d.type.charAt(0).toUpperCase() + d.type.slice(1) : 'Unknown'})`);

        // Node hover effect
        node.on("mouseover", function() {
            d3.select(this)
                .transition()
                .duration(150)
                .attr("stroke", "#ffffff")
                .attr("stroke-width", 2);
        }).on("mouseout", function() {
            d3.select(this)
                .transition()
                .duration(150)
                .attr("stroke", "#131314")
                .attr("stroke-width", 1.5);
        });

        const labels = svg
            .selectAll("text")
            .data(nodes)
            .enter()
            .append("text")
            .attr("dy", (d) => `${Math.min(15, Math.max(8, (d.weight || 1) * 5)) + 12}px`)
            .attr("text-anchor", "middle")
            .attr("font-size", "10px")
            .attr("font-weight", "500")
            .attr("fill", "#9ca3af")
            .style("pointer-events", "none")
            .text((d) => d.label.length > 15 ? d.label.substring(0, 13) + '...' : d.label);

        simulation.on("tick", () => {
            link
                .attr("x1", (d) => d.source.x)
                .attr("y1", (d) => d.source.y)
                .attr("x2", (d) => d.target.x)
                .attr("y2", (d) => d.target.y);

            node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
            labels.attr("x", (d) => d.x).attr("y", (d) => d.y);
        });

        function drag(simulation) {
            function dragstarted(event, d) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged(event, d) {
                d.fx = event.x;
                d.fy = event.y;
            }

            function dragended(event, d) {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }

            return d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
        }
    }, [graph]);

    return (
        <div className="bg-[#1e1e1f] border border-[#2d2d30] rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-white mb-1">Knowledge Graph</h3>
            <p className="text-xs text-gray-400 mb-4">Drag nodes to explore relationships</p>
            <svg ref={svgRef} style={{ width: "100%", height: "400px" }}></svg>
            
            {/* Color Legend */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 pt-4 border-t border-[#2d2d30] text-[10px] text-gray-400">
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#c084fc]"></span>
                    <span>Concept</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#34d399]"></span>
                    <span>Person</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#60a5fa]"></span>
                    <span>Organization</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#fbbf24]"></span>
                    <span>Event</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]"></span>
                    <span>Source</span>
                </div>
            </div>
        </div>
    );
}

export default KnowledgeGraph;