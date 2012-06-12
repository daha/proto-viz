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
/*globals d3,protoViz */

protoViz.Window = function (selector) {
    'use strict';
    var svgBits, box, boxEnter, dw, dh, width, height, html, arrow, arrowEnter,
        oldMaxArrowLabels = 0,
        that = this,
        boxSizeHeight = 50,
        defaultWidth = 50,
        defaultTextSize = 15,
        boxTextSize = defaultTextSize,
        arrowTextSize = defaultTextSize,
        transitionDuration = 2000,
        typeToColorMap = {
            ack: "#4DAF4A",
            pending: "#FF7F00",
            nack: "#E41A1C",
            unused: "#377EB8"
        },
        rootSvg = d3.select(selector).append("svg").attr("title", "a packet").attr("version", 1.1).attr("xmlns", "http://www.w3.org/2000/svg"),
        windowSvg = rootSvg.append("g").attr("transform", "translate(5,5)");

    function translateX(d) {
        return "translate(" + (d.offset) + ",0)";
    }

    function arrowX(d) {
        return d.offset + d.width / 2;
    }

    function initialTranslateArrow(d) {
        return "translate(0,55.5)";
    }

    function translateArrow(d) {
        return "translate(" + d.x + ",55.5)";
    }

    function translateBoxText(d) {
        return "translate(" + (d.width / 2) + "," + (boxSizeHeight / 2 + boxTextSize / 2.5) + ")";
    }

    function transformData(dataToProcess) {
        return dataToProcess.reduce(function (acc, val) {
            if (!val.hasOwnProperty("width")) {
                val.width = defaultWidth;
            }
            val.offset = acc.width;
            if (!val.hasOwnProperty("id")) {
                val.id = acc.count;
            }
            if (val.hasOwnProperty("arrow")) {
                acc.arrows = acc.arrows.concat(
                    val.arrow.map(function (d, i) {
                        return {
                            text: d,
                            index: i,
                            x: arrowX(val)
                        };
                    })
                );
            }
            if (val.arrow) {
                acc.maxArrowLabels = Math.max(val.arrow.length, acc.maxArrowLabels);
            }
            acc.list.push(val);
            acc.width += val.width;
            acc.count += 1;
            return acc;
        }, {list: [], arrows: [], width: 0, count: 0, maxArrowLabels: 0});
    }

    // TODO: split this method into smaller methods
    this.update = function (inData) {
        var data = transformData(inData);
        dh = data.length;
        width = data.width + 10;
        height = boxSizeHeight + Math.max(oldMaxArrowLabels, data.maxArrowLabels) * arrowTextSize + 65;
        oldMaxArrowLabels = data.maxArrowLabels;

        // Update the size to fit the data
        rootSvg.attr("width", width)
            .attr("height", height);

         // Group the rect and the text
        box = windowSvg.selectAll("g.boxes")
            .data(data.list);

        // Enter
        boxEnter = box.enter()
            .append("g")
            .attr("class", "boxes")
            .attr("transform", translateX);

        boxEnter.append("rect")
            .style("fill", "#fff");

        boxEnter.append("text")
            .style("font-size", boxTextSize.toString() + "px")
            .style("fill", "#000")
            .attr("transform", translateBoxText)
            .attr("text-anchor", "middle")
            .text(function (d) {
                return d.id;
            });

        // static position
        box.select("rect").attr("width", function (d) { return d.width; })
            .attr("height", boxSizeHeight)
            .style("border", "solid 1px #000")
            .style("stroke", "#000")
            .style("stroke-width", "2px")
            .transition()
            .duration(transitionDuration)
            .style("fill", function (d) {
                return typeToColorMap[d.type] || typeToColorMap.unused;
            });

        // Define the arrow head
        windowSvg.append("defs")
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


        // Group arrows and arrow labels
        arrow = windowSvg.selectAll("g.arrows")
            .data(data.arrows);

        // Enter
        arrowEnter = arrow.enter()
            .append("g")
            .attr("class", "arrows")
            .attr("transform", initialTranslateArrow);

        arrowEnter.append("line")
            .attr("y2", function (d) { return 45 + 0.5; });

        arrowEnter.append("text")
            .attr("dy", function (d) { return 60 + arrowTextSize * d.index; });

        // Static attributes
        arrow.transition()
            .duration(transitionDuration)
            .attr("transform", translateArrow);

        arrow.select("line")
            .attr("y2", function (d) { return 45 + 0.5; })
            .attr("fill", "none")
            .attr("stroke", "#000")
            .attr("stroke-width", 3)
            .attr("marker-start", "url(#ArrowFillLeft)");

        arrow.select("text")
            .style("font-size", arrowTextSize.toString() + "px")
            .style("fill", "#000")
            .attr("text-anchor", "middle")
            .text(function (d) {
                return d.text;
            })
            .transition()
            .duration(transitionDuration)
            .attr("dy", function (d) { return 60 + arrowTextSize * d.index; });
    };

    this.json = function (url) {
        d3.json(url, function (data) {
            that.update(data);
        });
    };
};
