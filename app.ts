enum Color {
    BLACK,
    WHITE
};

const STATE = {
    living: true,
    dead: false
};

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

        this.setColor(Color.BLACK);
    }

    /**
     * Sets the rendering color
     */
    setColor(color: Color) {
        switch (color) {
            case Color.BLACK:
                this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
                break;

            case Color.WHITE:
                this.ctx.fillStyle = 'rgba(1, 1, 1, 1)';
                break;
        }
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

    const generateBoard = (boardSize: number, population: number) => {
        return new Array(boardSize)
            .fill(false)
            .map(() =>
                new Array(boardSize)
                    .fill(false)
                    .map(() => Math.random() < population)
            );
    }

    const generateGlider = (boardSize: number) => {
        const board = generateBoard(boardSize, 0);
        
        // TODO

        return board;
    }

    const getNeighbourCount = (x: number, y: number) => {
        let neighbours: number = 0;

        let xChecks = [x - 1, x, x + 1];
        let yChecks = [y - 1, y, y + 1];

        for (const xCheck of xChecks) {
            for (const yCheck of yChecks) {
                neighbours += (!(xCheck == x && yCheck == y) && board[xCheck] && board[xCheck][yCheck]) ? 1 : 0;
            }
        }

        return neighbours;
    }

    const nextGeneration = () => {
        board = board.map((rows, x) => rows.map((column, y) => {
            let neighbours: number = getNeighbourCount(x, y);

            return neighbours == 3 || (column && neighbours === 2)
        }));

    }
    setInterval(nextGeneration, 100);


    const drawBoard = () => {
        renderer.clearScreen();

        board.forEach((rows, x) => rows.forEach((colum, y) => {
            if (colum) renderer.drawPoint(x * scale, y * scale);
        }));

        window.requestAnimationFrame(drawBoard);
    }

    window.requestAnimationFrame(drawBoard);

    const boardSize = 200;
    const scale = 4;
    const population = .03;

    let board = generateBoard(boardSize * scale, population);
    // let board = generateGlider(boardSize * scale);



    document.getElementById('nextGen').onclick = () => {
        nextGeneration();
    }
};
