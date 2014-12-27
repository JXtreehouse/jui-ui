jui.define("chart.brush.line", [], function() {

	var LineBrush = function() {

        this.setActiveEffect = function(elem) {
            var lines = this.lineList;

            for(var i = 0; i < lines.length; i++) {
                var opacity = (elem == lines[i].element) ? 1 : this.chart.theme("lineDisableBorderOpacity");

                lines[i].element.attr({ opacity: opacity });
                if(lines[i].tooltip != null) {
                    lines[i].tooltip.attr({ opacity: opacity });
                }
            }
        }

        this.setActiveEvent = function(elem) {
            var self = this;

            elem.on(this.brush.activeEvent, function(e) {
                self.setActiveEffect(elem);
            });
        }

        this.addLineElement = function(elem) {
            if(!this.lineList) {
                this.lineList = [];
            }

            this.lineList.push(elem);
        }

        this.createLine = function(pos, index) {
            var x = pos.x,
                y = pos.y;

            var p = this.chart.svg.path({
                stroke : this.getColor(index),
                "stroke-width" : this.chart.theme("lineBorderWidth"),
                fill : "transparent",
                "cursor" : (this.brush.activeEvent != null) ? "pointer" : "normal"
            }).MoveTo(x[0], y[0]);

            if(this.brush.symbol == "curve") {
                var px = this.curvePoints(x),
                    py = this.curvePoints(y);

                for (var i = 0; i < x.length - 1; i++) {
                    p.CurveTo(px.p1[i], py.p1[i], px.p2[i], py.p2[i], x[i + 1], y[i + 1]);
                }
            } else {
                for (var i = 0; i < x.length - 1; i++) {
                    if(this.brush.symbol == "step") {
                        var sx = x[i] + ((x[i + 1] - x[i]) / 2);

                        p.LineTo(sx, y[i]);
                        p.LineTo(sx, y[i + 1]);
                    }

                    p.LineTo(x[i + 1], y[i + 1]);
                }
            }

            return p;
        }

        this.drawTooltip = function(g, pos, index) {
            var display = this.brush.display,
                circleColor = this.chart.theme("lineCircleBorderColor");

            for (var i = 0; i < pos.x.length; i++) {
                if(display == "max" && pos.max[i] || display == "min" && pos.min[i]) {
                    var tooltip = this.createTooltip(this.getColor(index), circleColor),
                        position = (display == "max" && pos.max[i]) ? "top" : "bottom";

                    this.showTooltip(tooltip, pos.x[i], pos.y[i], pos.value[i], position);
                    g.append(tooltip);

                    // 컬럼 상태 설정 (툴팁)
                    this.lineList[index].tooltip = tooltip;
                }
            }
        }

        this.drawLine = function(path) {
            var brush = this.brush,
                g = this.chart.svg.group();

            for(var k = 0; k < path.length; k++) {
                var p = this.createLine(path[k], k);

                this.addEvent(p, null, k);
                g.append(p);

                // 컬럼 상태 설정
                this.addLineElement({
                    element: p,
                    tooltip: null
                });

                // Max & Min 툴팁 추가
                if(brush.display != null) {
                    this.drawTooltip(g, path[k], k);
                }

                // 액티브 라인 추가
                if(brush.activeEvent != null) {
                    this.setActiveEvent(p);
                }
            }

            // 액티브 라인 설정
            if(this.lineList) {
                for (var i = 0; i < this.lineList.length; i++) {
                    if (brush.active == brush.target[i]) {
                        this.setActiveEffect(p);
                    }
                }
            }

            return g;
        }

        this.draw = function() {
            return this.drawLine(this.getXY());
        }

        this.drawSetup = function() {
            return this.getOptions({
                symbol: "normal", // normal, curve, step
                display: null,
                active: null,
                activeEvent: null // or click, mouseover, ...
            });
        }
	}

	return LineBrush;
}, "chart.brush.core");