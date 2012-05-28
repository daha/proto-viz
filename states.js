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
// 'AS IS' AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
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

/*globals d3 */

// Based on http://bl.ocks.org/1093025 by Mike Bostock
var globalSvg;

(function () {
    'use strict';
    var width = 500,
        height = 500,
        boxHeight = 25,
        boxWidth = 50,
        duration = 2000,
        color = 'steelblue',
        svg = d3.select('#states').append('svg')
            .attr('class', 'states')
            .attr('width', width)
            .attr('height', height),
        box,
        boxEnter,
        data = [
            {val: 50, state: 0},
            {val: 100, state: 1},
            {val: 150, state: 2},
            {val: 200, state: 3}],
        area = [];

    globalSvg = svg;

    function removeByValue(arr, val) {
        var i;
        for (i = 0; i < arr.length; i += 1) {
            if (arr[i] === val) {
                arr.splice(i, 1);
                break;
            }
        }
    }

    function click(d) {
        var oldState = d.state,
            newState = (oldState + 1) % 4;
        d.state = newState;
        removeByValue(data, d);
        data.push(d);
        plotState(oldState);
        plotState(newState);
    }

    function translate(state) {
        var x_pos = Math.floor(state / 2) * 250,
            y_pos = (state % 2) * 250;

        return 'translate(' + x_pos + ', ' + y_pos + ')';
    }

    function createAreas() {
        var i;
        for (i = 0; i < 4; i += 1) {
            area[i] = svg.append('g')
                .attr('class', 'state')
                .attr('transform', translate(i));
        }
    }

    function plotState(state) {
        var box = area[state].selectAll('rect')
                .data(data.filter(function (d) { return d.state === state; })),
            boxEnter = box.enter()
                .append('rect')
                .attr('height', boxHeight)
                .attr('width', boxWidth)
                .style('fill', color)
                .style('opacity', 0)
                .on('click', click),
            boxExit = box.exit()
                .transition()
                .duration(duration)
                .attr('width', 0)
                .attr('height', 0)
                .remove();

        box.transition()
            .duration(duration)
            .attr('transform', function (d) {
                return 'translate(' + d.val + ', ' + d.val + ')';
            })
            .style('opacity', 1);


    }

    createAreas();
    // TODO: make these calls with data/enter
    plotState(0);
    plotState(1);
    plotState(2);
    plotState(3);

}());
