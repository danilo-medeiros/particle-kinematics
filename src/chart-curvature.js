import Chart from "chart.js";

export default class ChartCurvature {

    constructor(target) {
        this.target = target;
        this.chart = new Chart(this.target.getContext("2d"), {
            type: 'line',
            title: {
                text: "Curvatura e torção"
            },
            options: {
                elements: {
                    point: {
                        radius: 0,
                        hitRadius: 10, 
                        hoverRadius: 10
                    }, line: {
                        tension: 1
                    }
                },
                animation: {
                    duration: 0
                },
                scales:
                {
                    xAxes: [{
                        display: false
                    }]
                },
                hover: {
                    animationDuration: 0
                },
                responsiveAnimationDuration: 0
            }
        });
    }

    draw(labels, datasets) {
        
        this.chart.data = {
            labels: labels,
            datasets: datasets
        }
        this.chart.update();
    }

}