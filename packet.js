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
    var svg, svgBits, bitData,
        boxSize = 50,
        simple_packet = [{
            field: "D/C",
            length: 1,
            value: 1
        }, {
            field: "RF",
            length: 1,
            value: 0
        }, {
            field: "P",
            length: 1,
            value: 1
        }, {
            field: "FI",
            length: 2,
            value: "10"
        }, {
            field: "E",
            length: 1,
            value: 0
        }, {
            field: "SN",
            length: 2,
            value: ""
        }, {
            field: "SN",
            length: 8,
            value: 1023
        }, {
            field: "",
            length: 8,
            value: "Data",
            color: "data"
        }, {
            field: "",
            length: 8,
            value: "...",
            color: "odd_data"
        }, {
            field: "",
            length: 8,
            value: "",
            color: "data"
        }],
        complex_packet = [{
            field: "D/C",
            length: 1,
            value: 1
        }, {
            field: "RF",
            length: 1,
            value: 0
        }, {
            field: "P",
            length: 1,
            value: 1
        }, {
            field: "FI",
            length: 2,
            value: "10"
        }, {
            field: "E",
            length: 1,
            value: 1
        }, {
            field: "SN",
            length: 2,
            value: ""
        }, {
            field: "SN",
            length: 8,
            value: 1023
        }, {
            field: "E",
            length: 1,
            value: 1,
            color: "secondary_header"
        }, {
            field: "LI",
            length: 7,
            value: 120,
            color: "secondary_header"
        }, {
            field: "LI",
            length: 4,
            value: "",
            color: "secondary_header"
        }, {
            field: "E",
            length: 1,
            value: 1,
            color: "secondary_header"
        }, {
            field: "LI",
            length: 3,
            value: "",
            color: "secondary_header"
        }, {
            field: "LI",
            length: 8,
            value: 987,
            color: "secondary_header"
        }, {
            field: "E",
            length: 1,
            value: 0,
            color: "secondary_header"
        }, {
            field: "LI",
            length: 7,
            value: 456,
            color: "secondary_header"
        }, {
            field: "LI",
            length: 4,
            value: "",
            color: "secondary_header"
        }, {
            field: "padding",
            length: 4,
            value: "",
            color: "secondary_header"
        }, {
            field: "",
            length: 8,
            value: "Data",
            color: "data"
        }, {
            field: "",
            length: 8,
            value: "...",
            color: "odd_data"
        }, {
            field: "",
            length: 8,
            value: "",
            color: "data"
        }],
        data, dw, dh, width, height;

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

    data = transformBits(complex_packet);
    dh = data.length;
    width = 8 * boxSize;
    height = data.bytes * boxSize;

    svg = d3.select("#packet").append("svg")
        .attr("class", "chart")
        .attr("width", width)
        .attr("height", height);

    bitData = svg.selectAll("g.bit")
        .data(data.list)
        .enter()
        .append("g")
        .attr("class", "bit")
        .attr("transform", translateXY);

    bitData.append("rect")
        .attr("width", function (d) { return d.length * boxSize; })
        .attr("height", boxSize)
        .attr("class", function (d) {
            return d.color || "";
        });

    bitData.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "2.3em")
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

}());
