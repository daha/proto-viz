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

/*globals d3,btoa,protoViz */
protoViz.Packet = function (selector) {
    'use strict';
    var that = this,
        boxSize = 50,
        rootSvg = d3.select(selector).append("svg")
            .attr("title", "a packet")
            .attr("version", 1.1)
            .attr("xmlns", "http://www.w3.org/2000/svg")
            .style("border", "solid 1px #000");

    function translateXY(d, i) {
        return "translate(" +
            (d.offset * boxSize) + "," +
            (d.line * boxSize) + ")";
    }

    function transformBits(bits) {
        return bits.reduce(function (acc, val) {
            val.offset = acc.offset % 8;
            val.line = Math.floor(acc.offset / 8);
            acc.list.push(val);
            acc.offset += val.length;
            acc.bytes = Math.ceil(acc.offset / 8);
            return acc;
        }, {list: [], offset: 0, bytes: 0});
    }

    this.update = function (inData) {
        var data = transformBits(inData),
            dh = data.length,
            width = 8 * boxSize,
            height = data.bytes * boxSize,
            svg = rootSvg.attr("width", width)
                         .attr("height", height),
            bitData = svg.selectAll("g.bit")
                .data(data.list)
                .enter()
                .append("g")
                .attr("transform", translateXY);

        bitData.append("rect")
            .attr("width", function (d) { return d.length * boxSize; })
            .attr("height", boxSize)
            .style("stroke", "#555")
            .style("stroke-width", "2px")
            .style("fill", function (d) {
                return d.color || "#fff";
            });

        bitData.append("text")
            .style("font-size", "0.8em")
            .style("fill", "#000")
            .attr("text-anchor", "middle")
            .attr("dy", boxSize / 2 * 1.2)
            .attr("dx", function (d) { return d.length * boxSize / 2; })
            .text(function (d) {
                var output = "";
                if (d.field !== "") {
                    output += d.field;
                    if (d.value !== "") {
                        output += " = ";
                    }
                }

                if (d.value !== "") {
                    output += d.value;
                }
                return output;
            });
    };

    this.json = function (url) {
        d3.json(url, function (data) {
            that.update(data);
        });
    };
};
