d3.dsv(",", "boardgame_ratings.csv", function (d) {
  var keys = Object.keys(d);
  var collection = [];
  for (let i = 0; i < (keys.length - 1) / 2; i++) {
    const newObject = { date: new Date(d.date) };
    var countKeyName = keys[i * 2 + 1],
      rankKeyName = keys[i * 2 + 2];
    var gameName = countKeyName.split("=")[0];
    newObject.gameName = gameName;
    newObject.rateCounting = d[countKeyName];
    newObject.rank = d[rankKeyName];
    collection.push(newObject);
  }
  return collection;
})
  .then(function (data) {
    var data = [].concat.apply([], data),
      margin = { top: 20, right: 20, bottom: 20, left: 20 },
      padding = { top: 60, right: 60, bottom: 60, left: 60 },
      outerWidth = 960,
      outerHeight = 500,
      innerWidth = outerWidth - margin.left - margin.right,
      innerHeight = outerHeight - margin.top - margin.bottom,
      width = innerWidth - padding.left - padding.right,
      height = innerHeight - padding.top - padding.bottom;

    var svg = d3
      .select("body")
      .append("svg")
      .attr("id", "svg-a")
      .attr("width", outerWidth)
      .attr("height", outerHeight);

    var svg_b = d3
      .select("body")
      .append("svg")
      .attr("id", "svg-b")
      .attr("width", outerWidth)
      .attr("height", outerHeight);

    var svg_c_1 = d3
      .select("body")
      .append("svg")
      .attr("id", "svg-c-1")
      .attr("width", outerWidth)
      .attr("height", outerHeight);

    var svg_c_2 = d3
      .select("body")
      .append("svg")
      .attr("id", "svg-c-2")
      .attr("width", outerWidth)
      .attr("height", outerHeight);

    svg
      .append("text")
      .attr("id", "title-a")
      .attr("y", 20)
      .attr("x", outerWidth / 2 + margin.left + padding.left)
      .attr("text-anchor", "end")
      .attr("stroke", "black")
      .text("Number of Ratings 2016-2020");

    svg_b
      .append("text")
      .attr("id", "title-b")
      .attr("y", 20)
      .attr("x", outerWidth / 2 + margin.left + padding.left)
      .attr("text-anchor", "end")
      .attr("stroke", "black")
      .text("Number of Ratings 2016-2020 with Rankings");

    svg_c_1
      .append("text")
      .attr("id", "title-c-1")
      .attr("y", 20)
      .attr("x", outerWidth / 2 + margin.left + padding.left)
      .attr("text-anchor", "end")
      .attr("stroke", "black")
      .text("Number of Ratings 2016-2020 (Square root Scale)");

    svg_c_2
      .append("text")
      .attr("id", "title-c-2")
      .attr("y", 20)
      .attr("x", outerWidth / 2 + margin.left + padding.left)
      .attr("text-anchor", "end")
      .attr("stroke", "black")
      .text("Number of Ratings 2016-2020 (Log Scale)");

    var plot = svg
      .append("g")
      .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
      .attr("id", "plot-a");

    var plot_b = svg_b
      .append("g")
      .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
      .attr("id", "plot-b");

    var plot_c_1 = svg_c_1
      .append("g")
      .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
      .attr("id", "plot-c-1");

    var plot_c_2 = svg_c_2
      .append("g")
      .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
      .attr("id", "plot-c-2");

    var lines = plot
      .append("g")
      .attr("id", "lines-a")
      .attr("transform", "translate(" + (margin.left + 20) + ",0)")
      .attr("class", "lines-a");

    var lines_b = plot_b
      .append("g")
      .attr("id", "lines-b")
      .attr("transform", "translate(" + (margin.left + 20) + ",0)")
      .attr("class", "lines-b");

    var lines_c_1 = plot_c_1
      .append("g")
      .attr("id", "lines-c-1")
      .attr("transform", "translate(" + (margin.left + 20) + ",0)")
      .attr("class", "lines-b");

    var lines_c_2 = plot_c_2
      .append("g")
      .attr("id", "lines-c-2")
      .attr("transform", "translate(" + (margin.left + 20) + ",0)")
      .attr("class", "lines-b");

    var xExtent = d3.extent(data, (d) => {
      return d.date;
    });
    var xScale = d3.scaleTime().domain(xExtent).range([0, width]);
    var xAxis = d3
      .axisBottom(xScale)
      .ticks(d3.utcMonth.every(3))
      .tickFormat((x) => {
        var formatter = d3.utcFormat("%b %y");
        return formatter(x);
      });

    plot
      .append("g")
      .attr("id", "x-axis-a")
      .attr("transform", "translate(" + (margin.left + 20) + "," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("text-anchor", "end")
      .attr("stroke", "black")
      .attr("transform", "translate(" + width / 2 + "," + 30 + ")")
      .text("Month");

    plot_b
      .append("g")
      .attr("id", "x-axis-b")
      .attr("transform", "translate(" + (margin.left + 20) + "," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("text-anchor", "end")
      .attr("stroke", "black")
      .attr("transform", "translate(" + width / 2 + "," + 30 + ")")
      .text("Month");

    plot_c_1
      .append("g")
      .attr("id", "x-axis-c-1")
      .attr("transform", "translate(" + (margin.left + 20) + "," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("text-anchor", "end")
      .attr("stroke", "black")
      .attr("transform", "translate(" + width / 2 + "," + 30 + ")")
      .text("Month");

    plot_c_2
      .append("g")
      .attr("id", "x-axis-c-2")
      .attr("transform", "translate(" + (margin.left + 20) + "," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("text-anchor", "end")
      .attr("stroke", "black")
      .attr("transform", "translate(" + width / 2 + "," + 30 + ")")
      .text("Month");

    var yMax = d3.max(data, (d) => {
      return d.rateCounting;
    });
    var yScale = d3.scaleLinear().domain([0, yMax]).range([height, 0]);
    var yScale_c_1 = d3.scaleSqrt().domain([0, yMax]).range([height, 0]);
    var yScale_c_2 = d3.scaleLog().domain([1, yMax]).range([height, 0]);
    var yAxis = d3.axisLeft().scale(yScale).ticks(10);
    var yAxis_c_1 = d3.axisLeft().scale(yScale_c_1).ticks(10);
    var yAxis_c_2 = d3.axisLeft().scale(yScale_c_2).ticks(10);

    plot
      .append("g")
      .attr("id", "y-axis-a")
      .attr("transform", "translate(" + (margin.left + 20) + ",0)")
      .call(yAxis)
      .append("text")
      .attr("stroke", "black")
      .attr(
        "transform",
        "rotate(-90) translate(" +
          -(height - padding.top - margin.top) / 2 +
          "," +
          -50 +
          ")"
      )
      .text("Num of Ratings");

    plot_b
      .append("g")
      .attr("id", "y-axis-b")
      .attr("transform", "translate(" + (margin.left + 20) + ",0)")
      .call(yAxis)
      .append("text")
      .attr("stroke", "black")
      .attr(
        "transform",
        "rotate(-90) translate(" +
          -(height - padding.top - margin.top) / 2 +
          "," +
          -50 +
          ")"
      )
      .text("Num of Ratings");

    plot_c_1
      .append("g")
      .attr("id", "y-axis-c-1")
      .attr("transform", "translate(" + (margin.left + 20) + ",0)")
      .call(yAxis_c_1)
      .append("text")
      .attr("stroke", "black")
      .attr(
        "transform",
        "rotate(-90) translate(" +
          -(height - padding.top - margin.top) / 2 +
          "," +
          -50 +
          ")"
      )
      .text("Num of Ratings");

    plot_c_2
      .append("g")
      .attr("id", "y-axis-c-2")
      .attr("transform", "translate(" + (margin.left + 20) + ",0)")
      .call(yAxis_c_2)
      .append("text")
      .attr("stroke", "black")
      .attr(
        "transform",
        "rotate(-90) translate(" +
          -(height - padding.top - margin.top) / 2 +
          "," +
          -50 +
          ")"
      )
      .text("Num of Ratings");

    var sumstat = d3
      .nest()
      .key((d) => {
        return d.gameName;
      })
      .entries(data);

    var mediaName = sumstat.map((d) => {
      return d.key;
    });
    var colorScheme = d3.scaleOrdinal(d3.schemeCategory10).domain(mediaName);

    var game = lines
      .selectAll(".line")
      .append("g")
      .attr("class", "line")
      .data(sumstat)
      .enter();

    var game_b = lines_b
      .selectAll(".line")
      .append("g")
      .attr("class", "line")
      .data(sumstat)
      .enter();

    var game_c_1 = lines_c_1
      .selectAll(".line")
      .append("g")
      .attr("class", "line")
      .data(sumstat)
      .enter();

    var game_c_2 = lines_c_2
      .selectAll(".line")
      .append("g")
      .attr("class", "line")
      .data(sumstat)
      .enter();

    game
      .append("path")
      .attr("d", function (d) {
        return d3
          .line()
          .x((d) => xScale(d.date))
          .y((d) => yScale(d.rateCounting))
          .curve(d3.curveCardinal)(d.values);
      })
      .attr("fill", "none")
      .attr("stroke", (d) => colorScheme(d.key))
      .attr("stroke-width", 2);

    game_b
      .append("path")
      .attr("d", function (d) {
        return d3
          .line()
          .x((d) => xScale(d.date))
          .y((d) => yScale(d.rateCounting))
          .curve(d3.curveCardinal)(d.values);
      })
      .attr("fill", "none")
      .attr("stroke", (d) => colorScheme(d.key))
      .attr("stroke-width", 2);

    game_c_1
      .append("path")
      .attr("d", function (d) {
        return d3
          .line()
          .x((d) => xScale(d.date))
          .y((d) => yScale_c_1(d.rateCounting))
          .curve(d3.curveCardinal)(d.values);
      })
      .attr("fill", "none")
      .attr("stroke", (d) => colorScheme(d.key))
      .attr("stroke-width", 2);

    game_c_2
      .append("path")
      .attr("d", function (d) {
        return d3
          .line()
          .x((d) => xScale(d.date))
          .y((d) => yScale_c_2(d.rateCounting))
          .curve(d3.curveCardinal)(d.values);
      })
      .attr("fill", "none")
      .attr("stroke", (d) => colorScheme(d.key))
      .attr("stroke-width", 2);

    game
      .append("text")
      .attr("transform", (d) => {
        var rating = d.values[d.values.length - 1].rateCounting;
        var date = d.values[d.values.length - 1].date;
        return "translate(" + (xScale(date) + 10) + "," + yScale(rating) + ")";
      })
      .text((d) => {
        return d.key;
      })
      .attr("stroke", (d) => colorScheme(d.key))
      .style("font-size", "10px");

    game_b
      .append("text")
      .attr("transform", (d) => {
        var rating = d.values[d.values.length - 1].rateCounting;
        var date = d.values[d.values.length - 1].date;
        return "translate(" + (xScale(date) + 10) + "," + yScale(rating) + ")";
      })
      .text((d) => {
        return d.key;
      })
      .attr("stroke", (d) => colorScheme(d.key))
      .style("font-size", "10px");

    game_c_1
      .append("text")
      .attr("transform", (d) => {
        var rating = d.values[d.values.length - 1].rateCounting;
        var date = d.values[d.values.length - 1].date;
        return (
          "translate(" + (xScale(date) + 10) + "," + yScale_c_1(rating) + ")"
        );
      })
      .text((d) => {
        return d.key;
      })
      .attr("stroke", (d) => colorScheme(d.key))
      .style("font-size", "10px");

    game_c_2
      .append("text")
      .attr("transform", (d) => {
        var rating = d.values[d.values.length - 1].rateCounting;
        var date = d.values[d.values.length - 1].date;
        return (
          "translate(" + (xScale(date) + 10) + "," + yScale_c_2(rating) + ")"
        );
      })
      .text((d) => {
        return d.key;
      })
      .attr("stroke", (d) => colorScheme(d.key))
      .style("font-size", "10px");

    var rank_tag_data = [];
    for (var game of sumstat) {
      if (
        ["Catan", "Codenames", "Terraforming Mars", "Gloomhaven"].includes(
          game.key
        )
      ) {
        for (var i = 1; i < game.values.length; i++) {
          if (i % 3 == 0) {
            rank_tag_data.push(game.values[i - 1]);
          }
        }
      }
    }

    var circles_b = plot_b
      .append("g")
      .attr("id", "symbols-b")
      .attr("transform", "translate(" + (margin.left + 20) + ",0)");

    var circles_c_1 = plot_c_1
      .append("g")
      .attr("id", "symbols-c-1")
      .attr("transform", "translate(" + (margin.left + 20) + ",0)");

    var circles_c_2 = plot_c_2
      .append("g")
      .attr("id", "symbols-c-2")
      .attr("transform", "translate(" + (margin.left + 20) + ",0)");

    circles_b
      .selectAll(".symbol")
      .append("g")
      .data(rank_tag_data)
      .enter()
      .append("circle")
      .attr("r", 15)
      .style("fill", (d) => colorScheme(d.gameName))
      .attr("cx", (d) => xScale(d.date))
      .attr("cy", (d) => yScale(d.rateCounting));

    circles_c_1
      .selectAll("circle")
      .append("g")
      .data(rank_tag_data)
      .enter()
      .append("circle")
      .attr("r", 15)
      .style("fill", (d) => colorScheme(d.gameName))
      .attr("cx", (d) => xScale(d.date))
      .attr("cy", (d) => yScale_c_1(d.rateCounting));

    circles_c_2
      .selectAll("circle")
      .append("g")
      .data(rank_tag_data)
      .enter()
      .append("circle")
      .attr("r", 15)
      .style("fill", (d) => colorScheme(d.gameName))
      .attr("cx", (d) => xScale(d.date))
      .attr("cy", (d) => yScale_c_2(d.rateCounting));

    circles_b
      .selectAll("text.special")
      .append("g")
      .data(rank_tag_data)
      .enter()
      .append("text")
      .attr("class", "special")
      .style("fill", "white")
      .attr("font-size", "10px")
      .attr("transform", (d) => {
        return (
          "translate(" +
          (xScale(d.date) - 8) +
          "," +
          (yScale(d.rateCounting) + 3) +
          ")"
        );
      })
      .text((d) => d.rank);

    circles_c_1
      .selectAll("text.special")
      .append("g")
      .data(rank_tag_data)
      .enter()
      .append("text")
      .attr("class", "special")
      .style("fill", "white")
      .attr("font-size", "10px")
      .attr("transform", (d) => {
        return (
          "translate(" +
          (xScale(d.date) - 8) +
          "," +
          (yScale_c_1(d.rateCounting) + 3) +
          ")"
        );
      })
      .text((d) => d.rank);

    circles_c_2
      .selectAll("text.special")
      .append("g")
      .data(rank_tag_data)
      .enter()
      .append("text")
      .attr("class", "special")
      .style("fill", "white")
      .attr("font-size", "10px")
      .attr("transform", (d) => {
        return (
          "translate(" +
          (xScale(d.date) - 8) +
          "," +
          (yScale_c_2(d.rateCounting) + 3) +
          ")"
        );
      })
      .text((d) => d.rank);

    var legend_b = svg_b.append("g").attr("id", "legend-b");

    var legend_c_1 = svg_c_1.append("g").attr("id", "legend-c-1");

    var legend_c_2 = svg_c_2.append("g").attr("id", "legend-c-2");

    legend_b
      .append("circle")
      .attr("r", 15)
      .attr("transform", (d) => {
        return (
          "translate(" +
          (width + margin.right + 100) +
          "," +
          (height - 10) +
          ")"
        );
      });

    legend_c_1
      .append("circle")
      .attr("r", 15)
      .attr("transform", (d) => {
        return (
          "translate(" +
          (width + margin.right + 100) +
          "," +
          (height - 10) +
          ")"
        );
      });

    legend_c_2
      .append("circle")
      .attr("r", 15)
      .attr("transform", (d) => {
        return (
          "translate(" +
          (width + margin.right + 100) +
          "," +
          (height - 10) +
          ")"
        );
      });

    legend_b
      .append("text")
      .text("Rank")
      .attr("stroke", "white")
      .attr("transform", (d) => {
        return (
          "translate(" + (width + margin.right + 83) + "," + (height - 5) + ")"
        );
      });

    legend_c_1
      .append("text")
      .text("Rank")
      .attr("stroke", "white")
      .attr("transform", (d) => {
        return (
          "translate(" + (width + margin.right + 83) + "," + (height - 5) + ")"
        );
      });

    legend_c_2
      .append("text")
      .text("Rank")
      .attr("stroke", "white")
      .attr("transform", (d) => {
        return (
          "translate(" + (width + margin.right + 83) + "," + (height - 5) + ")"
        );
      })
      .attr("font-size", 15);

    legend_b
      .append("text")
      .text("BoardGameGeek Rank")
      .attr("transform", (d) => {
        return (
          "translate(" + (width + margin.right + 45) + "," + (height + 25) + ")"
        );
      })
      .style("font-size", "10px");

    legend_c_1
      .append("text")
      .text("BoardGameGeek Rank")
      .attr("transform", (d) => {
        return (
          "translate(" + (width + margin.right + 45) + "," + (height + 25) + ")"
        );
      })
      .style("font-size", "10px");

    legend_c_2
      .append("text")
      .text("BoardGameGeek Rank")
      .attr("transform", (d) => {
        return (
          "translate(" + (width + margin.right + 45) + "," + (height + 25) + ")"
        );
      })
      .style("font-size", "10px");

    var credit = document.createElement("div");
    credit.setAttribute("id", "xwang3141");
    document.getElementsByTagName("body")[0].appendChild(credit);
  })
  .catch(function (error) {
    console.log(error);
  });
