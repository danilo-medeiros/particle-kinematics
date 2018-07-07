export default class ChartCurvature {

    constructor(canvas) {
        this.canvas = canvas;
        this.canvas.width = 1600;
        this.canvas.height = 300;
        this.ctx = canvas.getContext("2d");
        this.ctx.translate(this.canvas.width / 2, this.canvas.height);
        this._scale = 10;
        this.margin = 2 * this._scale;
    }

    set scale(scale) {
        this._scale = scale * -1;
    }

    get scale() {
        return this._scale;
    }

    get width() {
        return this.canvas.width * 2 / this.scale;
    }

    get height() {
        return this.canvas.height * 2 / this.scale;
    }

    init() {
        this.startDraw("#000", 2);
        for (let i = this.height * -1; i < this.height; i++) {
            this.drawLine([this.width / 2 * -1, i], [this.width / 2, i]);
        }
        this.endDraw();
    }

    startDraw(color, width) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
    }

    endDraw() {
        this.ctx.stroke();
    }

    drawLine(initial, final) {
        initial = this.scaleV(initial);
        final = this.scaleV(final);
        this.ctx.moveTo(initial[0], initial[1]);
        this.ctx.lineTo(final[0], final[1]);
    }

    drawCircle(radius, position) {
        radius = radius * this.scale;
        position = this.scaleV(position);
        this.ctx.arc(position[0], position[1], radius, 0, 2 * Math.PI);
    }

    clear() {
        this.ctx.clearRect(this.canvas.width * -1, this.canvas.height * -1, this.canvas.width * 2, this.canvas.height * 2);
    }

    setCenter(center) {
        this.ctx.translate(this.scale * center[0], this.scale * center[1]);
    }

    scaleV(vector) {
        return [
            vector[0] * this.scale,
            vector[1] * this.scale
        ]
    }

    drawText(text, position) {

    }

}