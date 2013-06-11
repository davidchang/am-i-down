'use strict';

angular.module('publicApp')
  .directive('heatmap', function () {
    return {
      template: '<div id="mymap{{index}}"></div>',
      restrict: 'E',
      scope: { index: '@', data: '=' },
      link: function postLink(scope, element, attrs) {
        setTimeout(function() {
          var id = '#mymap' + scope.index;

          d3.select(id).append("svg")
            .attr("class", "graph");
     
          var w = function(d) { return 10; };
          var h = function(d) { return 130; };
          
          var domainsWidth = [], width = 0;
          
          var positionX = function(i) {
            return width === 0 ? domainsWidth[i] : domainsWidth[i+1];
          };
          
          //one year ago
          var d = new Date();
          d.setFullYear(d.getFullYear() - 1);
     
          var weekStart;
          
          if (d.getDay() === 1) {
            weekStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
          } else if (d.getDay() === 0) {
            weekStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            weekStart.setDate(weekStart.getDate() - 6);
          } else {
            weekStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()-d.getDay()+1);
          }
          
          var endDate = new Date(weekStart);
          var stop = new Date(endDate.setDate(endDate.getDate() + 52 * 7));
          
          var eachWeek = d3.time.sundays(Math.min(weekStart, stop), Math.max(weekStart, stop));
     
          // Painting all the domains
          var domainSvg = d3.select(id + ' .graph')
            .attr("height", 130)
            .selectAll("svg")
            .data(eachWeek);
          
          var tempWidth = 0;
          var tempLastDomainWidth = 0;
     
     
          var svg = domainSvg
            .enter()
            .insert("svg:svg")
            .attr("width", function(d){
              var wd = w(d) + 2;
     
              tempWidth += tempLastDomainWidth = wd + 5;
     
              if (width === 0) {
                domainsWidth.push(tempWidth - tempLastDomainWidth);
              } else {
                domainsWidth.push(width);
              }
     
              return wd;
            })
            .attr("height", function(d) { return h(d);})
            .attr("x", function(d, i){ return positionX(i); })
            ;
            
          var legendFormat = d3.time.format('%b');
     
          // Appending a label to each domain
          var label = d3.select(id + " .graph").selectAll("text")
            .data(eachWeek, function(d) { return d;});
     
          label
            .enter().insert("text")
            .attr("y", 113)
            .attr("x", function(d, i){ return positionX(i) - 10; })
            .attr("class", "graph-label")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .text(function(d) {
              var date = new Date(d);
              if(date.getDate() <= 7)
                return legendFormat(date);
            });
     
          function getDayDomain(d) {        
            var start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            var stop = new Date(start);
            stop = new Date(stop.setDate(stop.getDate() + 7));
     
            return d3.time.days(Math.min(start, stop), Math.max(start, stop));
          }
          
          // Drawing the sudomain inside each domain
          var rect = domainSvg.selectAll("rect")
            .data(function(d) { return getDayDomain(d); })
            .enter().append("svg:rect")
            .attr("class", "graph-rect")
            .attr("class", "neutral")
            .attr("width", 10)
            .attr("height", 10)
            .attr("x", function(d) { return 1; })
            .attr("y", function(d, i) { return i * 15 + 1; })
            .on('click', function() {
              d3.select(this).attr('class', 'green');
            });
            ;
     
          // Appeding a title to each subdomain
          rect.append("svg:title").text(function(d){ return d3.time.format('%x')(d); });
        });
      }
    };
  });
