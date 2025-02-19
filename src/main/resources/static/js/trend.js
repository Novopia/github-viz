$(document).ready(function() {
    var idea = document.getElementById("idea").innerHTML;
    var margin = {top: 40, right: 50, bottom: 50, left: 50},
        width = 750 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var formatDate = d3.time.format("%Y/%m");

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
        .x(function(d) { return x(d.time); })
        .y(function(d) { return y(d.quantity); });

    var svg = d3.select("#trend").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var maxy = 0;
    var min_date = -1;
    d3.csv("google_trend_cleaned.csv", function(error, data) {
        tmp = d3.max(data, function(data) {return parseInt(data.quantity);});
        if (tmp > maxy) {
            maxy = tmp
        }
        d3.csv("day_created.csv", function(error, data) {
            console.log(data)
            tmp = d3.max(data, function(data) {return parseInt(data.quantity);});
            if (tmp > maxy) {
                maxy = tmp
            }
            // Get the start date
            min_date = d3.min(data, function(data) { return formatDate.parse(data.time); });

            // Visualize the Google Trend here, because we just get the min_date to filter
            // out some data
            d3.csv("google_trend_cleaned.csv", type2, function(error, data) {
                if (error) throw error;

                data = data.filter(function(d) {
                    return d.time >= min_date;
                });

                svg.append("path")
                    .datum(data)
                    .attr("class", "line")
                    .attr("d", line);
            });


        });
    });

    d3.csv("day_created.csv", type, function(error, data) {
        if (error) throw error;

        x.domain(d3.extent(data, function(d) { return d.time; }));
        y.domain([0,1]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("fill", "white");

        svg.append("path")
            .datum(data)
            .attr("class", "line2")
            .attr("d", line);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .attr("fill", "white")
        .attr("font-size", "15px")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .attr("fill", "white")
        .attr("font-size", "12px")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .attr("fill", "white")
        .attr("font-size", "15px")
        .style("text-anchor", "end")
        .text("Popularity");

    svg.append("path")
        .datum(data)
        .attr("class", "line2")
        .attr("d", line);
});

d3.csv("google_trend_cleaned.csv", type, function(error, data) {
    if (error) throw error;
    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);
});

var colors = [ ["GitHub", "#55D6FF"],
    ["Google Trend", "green"] ];

var legend = svg.append("g")
    .attr("class", "legend")
    //.attr("x", w - 65)
    // .attr("y", 100)
    .attr("height", 100)
    .attr("width", 100)
    .attr('transform', 'translate(-20,50)');


var legendRect = legend.selectAll('rect').data(colors);

legendRect.enter()
    .append("rect")
    .attr("x", width - 65)
    .attr("width", 10)
    .attr("height", 10);

legendRect
    .attr("y", function(d, i) {
        return i * 20;
    })
    .style("fill", function(d) {
        return d[1];
    });
    var colors = [ ["GitHub", "#55D6FF"],
        ["Google Trend", "green"] ];

    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("height", 100)
        .attr("width", 100)
        .attr('transform', 'translate(-20,50)');


    var legendRect = legend.selectAll('rect').data(colors);

    legendRect.enter()
        .append("rect")
        .attr("x", width - 65)
        .attr("width", 10)
        .attr("height", 10);

    legendRect
        .attr("y", function(d, i) {
            return i * 20;
        })
        .style("fill", function(d) {
            return d[1];
        });

    var legendText = legend.selectAll('text').data(colors);

    legendText.enter()
        .append("text")
        .attr("x", width - 52)
        .style("fill","white");

    legendText
        .attr("y", function(d, i) {
            return i * 20 + 9;
        })
        .style("fill","white")
        .text(function(d) {
            return d[0];
        });

    function type(d) {
        d.time = formatDate.parse(d.time);
        d.quantity = d.quantity;
        return d;
    }

    function type2(d) {
        d.time = formatDate.parse(d.time);
        d.quantity = d.quantity / maxy;
        return d;
    }
});