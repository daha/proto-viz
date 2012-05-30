// Copyright (c) 2012, David Haglund
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//
//     * Redistributions of source code must retain the above
//       copyright notice, this list of conditions and the following
//       disclaimer.
//
//     * Redistributions in binary form must reproduce the above
//       copyright notice, this list of conditions and the following
//       disclaimer in the documentation and/or other materials
//       provided with the distribution.
//
//     * Neither the name of the copyright holder nor the names of its
//       contributors may be used to endorse or promote products
//       derived from this software without specific prior written
//       permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
// FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
// COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
// INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
// HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
// STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
// OF THE POSSIBILITY OF SUCH DAMAGE.

// I have borrowed a few lines from the code specified below:
// https://github.com/mbostock/d3/blob/master/examples/contour/contour.html
// with the license:
// https://github.com/mbostock/d3/blob/master/LICENSE

/*globals d3 */
(function () {
    'use strict';
    var svg, svgBits, bitData, data, dw, dh, width, height, html,
        boxSizeHeight = 50,
        defaultWidth = 50,
        send_window = [{
            width: 50,
            color: "green2"
        }, {
            width: 100,
            color: "green2"
        }, {
            width: 33,
            color: "orange2",
            arrow: "VT(R)"
        }, {
            width: 53,
            color: "red2"
        }, {
            width: 110,
            color: "green2"
        }, {
            width: 220,
            color: "red2"
        }, {
            width: 40,
            color: "red2"
        }, {
            width: 60,
            color: "green2"
        }, {
            color: "white"
        }, {
            color: "white",
            id: "..."
        }, {
            color: "white",
            id: 514,
            arrow: "VT(MR)"
        }],
        colorMap = {
            red: "#d7191c",
            orange: "#feae61",
            yellow: "#ffffbf",
            lightgreen: "a6d96a",
            green: "#1a9641",
            // white: "#fff",
            orange2: "#FF7F00",
            red2: "#E41A1C",
            blue: "#377EB8",
            green2: "#4DAF4A",
            pink: "#984EA3",
            white: "#377EB8"
        };

    function translateX(d, i) {
        return "translate(" + (d.offset) + ",0)";
    }

    function translateArrowX(d) {
        return d.offset + d.width / 2;
    }

    function addOffsetAndId(bits) {
        return bits.reduce(function (acc, val) {
            if (!val.hasOwnProperty("width")) {
                val.width = defaultWidth;
            }
            val.offset = acc.width;
            if (!val.hasOwnProperty("id")) {
                val.id = acc.count;
            }
            acc.list.push(val);
            acc.width += val.width;
            acc.count += 1;
            return acc;
        }, {list: [], width: 0, count: 0});
    }

    data = addOffsetAndId(send_window);
    dh = data.length;
    width = data.width;
    height = boxSizeHeight + 150;

    svg = d3.select("#window").append("svg")
        .attr("title", "a packet")
        .attr("version", 1.1)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .attr("width", width)
        .attr("height", height);

    // define arrow-head, generate it with data?
    d3.select("#window").select("svg")
        .append("defs")
        .append("marker")
        .attr("id", "ArrowFillLeft")
        .attr("viewBox", "0 0 10 10")
        .attr("refX", 5)
        .attr("refY", 5)
        .attr("markerUnits", "strokeWidth")
        .attr("markerwidth", 18)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M 10 0 L 0 5 L 10 10 z");

    // Arrows!
    svg.selectAll("line")
        .data(data.list.filter(function (d) {
            return d.hasOwnProperty("arrow");
        }))
        .enter()
        .append("line")
        .attr("x1", translateArrowX)
        .attr("x2", translateArrowX)
        .attr("y1", 55.5)
        .attr("y2", 100)
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("stroke-width", 3)
        .attr("marker-start", "url(#ArrowFillLeft)");

    bitData = svg.selectAll("g.bit")
        .data(data.list)
        .enter()
        .append("g")
        .attr("transform", translateX);

    bitData.append("rect")
        .attr("width", function (d) { return d.width; })
        .attr("height", boxSizeHeight)
        .style("border", "solid 1px #000")
        .style("stroke", "#000")
        .style("stroke-width", "2px")
        .style("fill", function (d) {
            return colorMap[d.color] || colorMap.orange;
        });

    bitData.append("text")
        .style("font-size", "0.8em")
        .style("fill", "#000")
        .attr("text-anchor", "middle")
        .attr("dy", boxSizeHeight / 2 * 1.2)
        .attr("dx", function (d) { return d.width / 2; })
        .text(function (d) {
            return d.id;
        });
}());
