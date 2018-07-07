import Chart from "chart.js";

export default class ChartCurvature {

    constructor(target) {
        this.target = target;
        this.chart = new Chart(this.target.getContext("2d"), {
            type: 'line',
            options: {
                elements: {
                    line: {
                        capBezierPoints: false
                    },
                    point: {
                        radius: 0,
                        hitRadius: 10, hoverRadius: 10
                    }
                },
                animation: {
                    duration: 0, // general animation time
                },
                hover: {
                    animationDuration: 0, // duration of animations when hovering an item
                },
                responsiveAnimationDuration: 0, // animation duration after a resize
            }
        });
    }

    draw(labels, values) {
        this.chart.data = {
            labels: labels,
            datasets: [{
                label: 'k(t)',
                data: values,
                borderColor: "rgba(75, 192, 192, 1)",
                fill: false
            }]
        }
        this.chart.update();
    }

}