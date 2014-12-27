jui.define("chart.brush.area", [], function() {

    var AreaBrush = function() {

        this.drawArea = function(path) {
            var g = this.chart.svg.group(),
                maxY = this.brush.y(this.brush.y.min());

            for (var k = 0; k < path.length; k++) {
                var p = this.createLine(path[k], k),
                    xList = path[k].x;

                p.LineTo(xList[xList.length - 1], maxY);
                p.LineTo(xList[0], maxY);
                p.ClosePath();
                p.attr({
                    fill: this.color(k),
                    "fill-opacity": this.chart.theme("areaBackgroundOpacity"),
                    "stroke-width": 0
                });

                this.addEvent(p, null, k);
                g.prepend(p);
            }

            return g;
        }

        this.draw = function() {
            return this.drawArea(this.getXY());
        }
    }

    return AreaBrush;
}, "chart.brush.line");
