class Renderer {
    canvasSize: number;
    canvas: any;
    ctx: any;

    /**
     * 
     * @param canvasSize the size of the canvas
     */
    constructor(canvasSize: number) {
        this.canvasSize = canvasSize;

        // Get reference to canvas
        this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this.canvas.width = this.canvas.height = canvasSize;
        this.ctx = this.canvas.getContext('2d');

        // Standard color = black
        this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    }

    /**
     * Sets the rendering color
     */
    setColor() {
        // TODO
    }

    /**
     * Clears the entire screen
     */
    clearScreen() {
        this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
    }

    /**
     * Draws a point.
     * @param x the x coordinate
     * @param y the y coordinate
     */
    drawPoint(x: number, y: number) {
        this.ctx.fillRect(x, y, 4, 4);
    }

    /**
     * Draws a line.
     * @param x starting coordinate
     * @param y starting coordinate
     * @param lengthX length of the x coordinate
     * @param lengthY length of the y coordinate
     */
    drawLine(x: number, y: number, lengthX: number, lengthY: number) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + lengthX, y + lengthY);
        this.ctx.stroke();
    }

    /**
     * Draws text.
     * @param x the x coordinate
     * @param y the y coordinate
     * @param text custom text
     */
    drawText(x: number, y: number, text: string) {
        this.ctx.font = "14px Arial";
        this.ctx.fillText(text, x, y);
    }
}


window.onload = () => {
    const renderer = new Renderer(800);
    
    const generateBoard = () => {
        return new Array(10).fill(undefined).map(element => new Array(10).fill(1))
    }

    const generateGlider = () => {

    }

    const draw = () => {
        console.log("Hello");
        renderer.drawPoint(100, 100);
        window.requestAnimationFrame(draw);
    }



    window.requestAnimationFrame(draw);


};
