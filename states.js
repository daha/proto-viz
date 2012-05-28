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
            {val: 50, s: 0},
            {val: 100, s: 1},
            {val: 150, s: 2},
            {val: 200, s: 3}];

    function click(e) {
        console.log(e);
    }

    function translate(state) {
        var x_pos = Math.floor(state / 2) * 250,
            y_pos = (state % 2) * 250;

        return 'translate(' + x_pos + ', ' + y_pos + ')';
    }

    function plotState(state) {
        var area = svg.append('g')
                .attr('class', 'state' + state)
                .attr('transform', translate(state)),
            boxEnter = area.selectAll('rect')
                .data(data.filter(function (d) { return d.s === state; }))
                .enter()
                .append('rect')
                .attr('height', boxHeight)
                .attr('width', boxWidth)
                .style('fill', color)
                .style('opacity', 0)
                .on('click', click);

        boxEnter.transition()
            .duration(duration)
            .attr('transform', function (d) {
                return 'translate(' + d.val + ', ' + d.val + ')';
            })
            .style('opacity', 1);
    }

    // TODO: make these calls with data/enter
    plotState(0);
    plotState(1);
    plotState(2);
    plotState(3);

}());
