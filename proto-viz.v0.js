(function(){protoViz = {};
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

    function translateBitText(d) {
        return "translate(" + (d.length * boxSize / 2) + "," + (boxSize / 2 * 1.2) + ")";
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
            .attr("transform", translateBitText)
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
    var that = this,
        oldMaxArrowLabels = 0,
        boxSizeHeight = 50,
        defaultWidth = 50,
        defaultTextSize = 15,
        boxTextSize = defaultTextSize,
        arrowTextSize = defaultTextSize,
        labelTextSize = defaultTextSize,
        transitionDuration = 2000,
        arrowIndexMap = d3.scale.ordinal().range(d3.range(10)),
        typeToColorMap = {
            ack: "#4DAF4A",
            pending: "#FF7F00",
            nack: "#E41A1C",
            unused: "#377EB8"
        },
        dataList = [],
        dataIndex = 0,
        rootSvg = d3.select(selector).append("svg").attr("title", "a packet").attr("version", 1.1).attr("xmlns", "http://www.w3.org/2000/svg"),
        windowSvg = rootSvg.append("g").attr("transform", "translate(5,5)"),
        getDataFunction = function (d) { return d.data; };

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

    function translateX(d) {
        return "translate(" + (d.offset) + ",0)";
    }

    function arrowX(d) {
        return d.offset + d.width / 2;
    }

    function initialTranslateBoxAnnotation(d) {
        return "translate(0,55.5)";
    }

    function translateBoxAnnotation(d) {
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
                val.arrow.forEach(function (d, i) {
                    acc.arrows[arrowIndexMap(d)] = {
                        text: d,
                        index: i,
                        x: arrowX(val)
                    };
                });
            }
            if (val.hasOwnProperty("label")) {
                acc.labels.push({
                    text: val.label,
                    x: arrowX(val)
                });
            }
            if (val.arrow) {
                acc.maxArrowLabels = Math.max(val.arrow.length, acc.maxArrowLabels);
            }
            acc.list.push(val);
            acc.width += val.width;
            acc.count += 1;
            return acc;
        }, {list: [], arrows: [], labels: [], width: 0, count: 0, maxArrowLabels: 0});
    }

    this.setGetDataFunction = function (newGetDataFunction) {
        getDataFunction = newGetDataFunction;
    };

    this.show = function () {
        that.update(getDataFunction(dataList[dataIndex]));
    };

    this.updateMulti = function (inData) {
        dataList = inData;
        dataIndex = 0;
        that.show();
    };

    this.next = function () {
        dataIndex = (dataIndex + 1) % dataList.length;
        that.show();
    };

    this.prev = function () {
        var nextIndex = (dataIndex - 1) % dataList.length;
        if (nextIndex >= 0) {
            dataIndex = nextIndex;
        }
        that.show();
    };

    // TODO: split this method into smaller methods
    this.update = function (inData) {
        var label, labelEnter, box, boxEnter, arrow, arrowEnter,
            data = transformData(inData),
            dh = data.length,
            width = data.width + 10,
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
            .style("fill", function (d) { return d.textColor || "#000"; })
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
                return d.color || typeToColorMap[d.type] || typeToColorMap.unused;
            });

        box.exit().remove();

        // Group arrows and arrow labels
        arrow = windowSvg.selectAll("g.arrows")
            .data(data.arrows);

        // Enter
        arrowEnter = arrow.enter()
            .append("g")
            .attr("class", "arrows")
            .attr("transform", initialTranslateBoxAnnotation);

        arrowEnter.append("line")
            .attr("y2", function (d) { return 45 + 0.5; });

        arrowEnter.append("text")
            .attr("dy", function (d) { return 60 + arrowTextSize * d.index; });

        // Static attributes
        arrow.transition()
            .duration(transitionDuration)
            .attr("transform", translateBoxAnnotation);

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

        arrow.exit().remove();

        // Group box labels
        label = windowSvg.selectAll("g.label")
            .data(data.labels);

        // Enter
        labelEnter = label.enter()
            .append("g")
            .attr("class", "label")
            .attr("transform", initialTranslateBoxAnnotation);

        labelEnter.append("text")
            .attr("dy", labelTextSize);

        // Static attributes
        label.transition()
            .duration(transitionDuration)
            .attr("transform", translateBoxAnnotation);

        label.select("text")
            .style("font-size", labelTextSize.toString() + "px")
            .style("fill", "#000")
            .attr("text-anchor", "middle")
            .text(function (d) {
                return d.text;
            })
            .transition()
            .duration(transitionDuration);

        label.exit().remove();
    };

    this.json = function (url) {
        d3.json(url, function (data) {
            that.update(data);
        });
    };
};
}());
