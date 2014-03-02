var m = [20, 120, 20, 120],
    w = parseInt(d3.select("#main").style("width")) - m[1] - m[3],
    h = 800 - m[0] - m[2],
    i = 0,
    root;

var tree = d3.layout.tree()
    .size([h, w]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
    .append("svg:g")
        .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

d3.json("/data/bjcp-style-data/json/framework-tree.min.json", function(json) {
    root = json;
    root.x0 = h / 2;
    root.y0 = 0;

    // Initialize the hide all nodes.
    root.children.forEach(toggleAll);

    update(root);

    function toggleAll(d) {
        if (d.children) {
            d.children.forEach(toggleAll);
            toggle(d);
        }
    }
});

function update(source) {

    var duration = d3.event && d3.event.altKey ? 5000 : 500;

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse();

    // Normalize for y position relative to depth.
    // nodes.forEach(function(d) { d.y = d.depth * (w/4); });
    nodes.forEach(function(d) {

        var interval = w/12;
        if (d.depth == 0) { d.y = interval * 0; }
        if (d.depth == 1) { d.y = interval * 1; }
        // if (d.depth == 1) { d.y = interval * 0; }
        if (d.depth == 2) { d.y = interval * 5; }
        if (d.depth == 3) { d.y = interval * 9; }

    });

    // Update the nodes
    var node = svg.selectAll("g.node")
        .data(nodes, function(d) { return d.id || (d.id = ++i); });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("svg:g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
        .on("click", function(d) { toggle(d); update(d); });

    nodeEnter.append("svg:circle")
        .attr("r", "1e-6em")
        .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

    // Style Name
    nodeEnter.append("svg:text")
        .attr("class","labels")
        .attr("x", function(d) {
            var x = null,
                end_node = "1em",
                expanded = "-1em",
                collapsed = "1em";

            if (d._children) { x = collapsed; }
                else if (d.children) { x = expanded; }
                else { x = end_node; }

                return x;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) {
            var anchor = null,
                end_node = "start",
                expanded = "end",
                collapsed = "start";

            if (d._children) { anchor = collapsed; }
                else if (d.children) { anchor = expanded; }
                else { anchor = end_node; }

                return anchor;
        })
        .text(function(d) { return d.name; })
        .style("fill-opacity", 1e-6);

    // Style Letters/Numbers Inside Node Circles
    nodeEnter.append("svg:text")
        .attr("x", 0)
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.number ? d.number : d.letter; })
            .attr("onclick", function(d) {
                if (d._children || d.children) { return ""; }
                if (d.letter) { return ("$('#modal-" + d.parent.number + d.letter + "').modal()"); }
                else { return ("$('#modal-" + d.number + "').modal()"); }
            })
            .style("fill-opacity", 1e-6);

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

    nodeUpdate.select("circle")
        .attr("r", "0.75em")
        .attr("onclick", function(d) {
            if (d._children || d.children) { return ""; }
            if (d.letter) { return ("$('#modal-" + d.parent.number + d.letter + "').modal()"); }
            else { return ("$('#modal-" + d.number + "').modal()"); }
        })
        .style("fill", function(d) {
            var color = null,
                end_node = "#fff",
                expanded = "#fff",
                collapsed = "lightsteelblue";

            if (d._children) { color = collapsed; }
            else if (d.children) { color = expanded; }
            else { color = end_node; }

            return color;
        });

    nodeUpdate.selectAll(".labels")
        .attr("x", function(d) {
            var x = null,
                end_node = "1em",
                expanded = "-1em",
                collapsed = "1em";

            if (d._children) { x = collapsed; }
            else if (d.children) { x = expanded; }
            else { x = end_node; }

            return x;
        })
        .attr("text-anchor", function(d) {
            var anchor = null,
            end_node = "start",
            expanded = "end",
            collapsed = "start";

            if (d._children) { anchor = collapsed; }
            else if (d.children) { anchor = expanded; }
            else { anchor = end_node; }

            return anchor;
        })
        .attr("onclick", function(d) {
            if (d._children || d.children) { return ""; }
            if (d.letter) { return ("$('#modal-" + d.parent.number + d.letter + "').modal()"); }
            else { return ("$('#modal-" + d.number + "').modal()"); }
        })
        .style("fill-opacity", 1);

    nodeUpdate.selectAll("text")
        .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
        .remove();

    nodeExit.select("circle")
        .attr("r", "1e-6em");

    nodeExit.selectAll("text")
        .style("fill-opacity", 1e-6);

    // Update the links
    var link = svg.selectAll("path.link")
        .data(tree.links(nodes), function(d) { return d.target.id; });

    // Enter any new links at the parent's previous position.
    link.enter().insert("svg:path", "g")
        .attr("class", "link")
        .attr("d", function(d) {
            var o = {x: source.x0, y: source.y0};
            return diagonal({source: o, target: o});
        })
        .transition()
            .duration(duration)
            .attr("d", diagonal);

    // Transition links to their new position.
    link.transition()
        .duration(duration)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(duration)
        .attr("d", function(d) {
            var o = {x: source.x, y: source.y};
            return diagonal({source: o, target: o});
        })
        .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}

// Toggle children.
function toggle(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
}

function reset() {
    var nodes = tree.nodes(root).reverse();
    nodes.forEach(function(d) { if (d.depth && d.children) { toggle(d); update(d); } });
    $('.in').collapse('hide');
}