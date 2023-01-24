d3.dsv(",", "board_games.csv", function(d) {
    return {
      source: d.source,
      target: d.target,
      value: +d.value
    }
  }).then(function(data) {
  
    var links = data;
  
    var nodes = {};
  
    // compute the distinct nodes from the links.
    links.forEach(function(link) {
        link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
        link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
    });
  
    var width = 1200,
        height = 700;
  
    var force = d3.forceSimulation()
        .nodes(d3.values(nodes))
        .force("link", d3.forceLink(links).distance(100))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .force("charge", d3.forceManyBody().strength(-250))
        .alphaTarget(1)
        .on("tick", tick);
  
    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);
    
        var credit = svg.append("text").text(()=>{
            return "xwang3141"
        }).attr("transform", function(d) {
            return "translate(" + (width-200) + "," + 40 + ")"; 
        }).attr("id", "credit");;
    // add the links
    var path = svg.append("g")
        .selectAll("path")
        .data(links)
        .enter()
        .append("path")
        .attr("class", function(d) { 
            if (d.value==0){
                d.type="solid"
            } else {
                d.type='dashed'
            }
            return "link " + d.type; });
  
    // define the nodes
    var node = svg.selectAll(".node")
        .data(force.nodes())
        .enter().append("g")
        .attr("class", "node")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
        .on('dblclick', function(d){
            d.fixed = false;
            d3.select(this).select("circle").attr("class", null);
            dragended(d)
        });
    
  
    // add the nodes
    node.append("circle")
        .attr("id", function(d){
           return (d.name.replace(/\s+/g,'').toLowerCase());
        })
        .attr("r", function(d){
            d.weight = links.filter(function(l){
                return l.source.index == d.index || l.target.index == d.index 
            }).length;
            var baseRadius = 4
            return d.weight*baseRadius;
        }).attr("class", function(d){
            if (d.weight>= 1 && d.weight < 3){
                return "degree-level-one";
            } else if (d.weight >= 3 && d.weight < 6){
                return "degree-level-two";
            } else if (d.weight >= 6 && d.weight < 9){
                return "degree-level-three";
            } else {
                return "degree-level-four"
            }
        });
    
    node.append("text").text(function(d){
        return d.name;
    }).attr("class", "node-label").attr("transform", function(d) {
        return "translate(" + 5 + "," + -10 + ")"; 
    });

      
  
    // add the curvy lines
    function tick() {
        path.attr("d", function(d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" +
                d.source.x + "," +
                d.source.y + "A" +
                dr + "," + dr + " 0 0,1 " +
                d.target.x + "," +
                d.target.y;
        });
  
        node.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")"; 
        });
    };
  
    function dragstarted(d) {
        if (!d3.event.active) force.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
        d.fixed = true
    };
  
    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    };
  
    function dragended(d) {
        if (!d3.event.active) force.alphaTarget(0);
        if (d.fixed == true) {
            d3.select(this).select('circle').attr("class", "pined")
            d.fx = d.x;
            d.fy = d.y;
        }
        else {
            d.fx = null;
            d.fy = null;
        }
    };
    
  }).catch(function(error) {
    console.log(error);
  });