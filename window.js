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

/*globals d3,btoa */
(function () {
    'use strict';
    var svg, svgBits, bitData,
        boxSizeHeight = 50,
        defaultWidth = 50,
        send_window = [{
            width: 50,
            color: "green"
        }, {
            width: 100,
            color: "green"
        }, {
            width: 33,
            color: "yellow"
        }, {
            width: 53,
            color: "red"
        }, {
            width: 110,
            color: "green"
        }, {
            width: 220,
            color: "red"
        }, {
            width: 40,
            color: "red"
        }, {
            width: 60,
            color: "green"
        }, {
            color: "white"
        }, {
            color: "white"
        }, {
            color: "white",
            id: "..."
        }, {
            color: "white",
            id: 514
        }],
        colorMap = {
            red: "#d7191c",
            orange: "#feae61",
            yellow: "#ffffbf",
            lightgreen: "a6d96a",
            green: "#1a9641",
            white: "#fff"
        },
        data, dw, dh, width, height, html;

    function translateX(d, i) {
        return "translate(" + (d.offset) + ",0)";
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
    height = boxSizeHeight;

    svg = d3.select("#window").append("svg")
        .attr("title", "a packet")
        .attr("version", 1.1)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .style("border", "solid 1px #000")
        .attr("width", width)
        .attr("height", height);

    bitData = svg.selectAll("g.bit")
        .data(data.list)
        .enter()
        .append("g")
        .attr("transform", translateX);

    bitData.append("rect")
        .attr("width", function (d) { return d.width; })
        .attr("height", boxSizeHeight)
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
