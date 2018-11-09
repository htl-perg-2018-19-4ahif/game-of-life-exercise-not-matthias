// TODO: optimize algorithms (currently 6-7 FPS)
// TODO: move renderer to another file (use browserify)

// Note RS: @browserify - I would rather consider webpack

/**
 * Enum with the background colors
 */
enum Color {
    BLACK,
    WHITE,
}

class Renderer {
    public canvasSize: number;
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;

    /**
     * Gets a reference to the canvas (id: canvas), sets the size and the color to black
     * @param canvasSize the size of the canvas
     */
    constructor(canvasSize: number) {
        this.canvasSize = canvasSize;

        // Get reference to canvas
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.canvas.width = this.canvas.height = canvasSize;
        this.ctx = this.canvas.getContext("2d");

        this.setColor(Color.BLACK);
    }

    /**
     * Sets the rendering color
     */
    public setColor(color: Color) {
        // Note RS: The following line would be a shorter option:
        // this.ctx.fillStyle = `rgba(${color},${color},${color},1)`;
        switch (color) {
            case Color.BLACK:
                this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
                break;

            case Color.WHITE:
                this.ctx.fillStyle = "rgba(1, 1, 1, 1)";
                break;
        }
    }

    /**
     * Clears the entire screen
     */
    public clearScreen() {
        this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
    }

    /**
     * Draws a point.
     * @param x the x coordinate
     * @param y the y coordinate
     */
    public drawPoint(x: number, y: number) {
        this.ctx.fillRect(x, y, 4, 4);
    }

    /**
     * Draws a line.
     * @param x starting coordinate
     * @param y starting coordinate
     * @param lengthX length of the x coordinate
     * @param lengthY length of the y coordinate
     */
    public drawLine(x: number, y: number, lengthX: number, lengthY: number) {
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
    public drawText(x: number, y: number, text: string) {
        // Note RS: Avoid such constants distributed over the code. Use a central
        //          location with all consts e.g. at the beginning of the file.
        this.ctx.font = "14px Arial";
        this.ctx.fillText(text, x, y);
    }
}

/**
 * Fires immediately after the browser loads the object.
 */
window.onload = () => {

    /**
     * Generate a new board of cells
     * @param boardSize the size of the board (in cells)
     * @param population the percentage of the beginning cells
     */
    const generateBoard = (boardSize: number, population: number) => {
        return new Array(boardSize).fill(false).map(() => new Array(boardSize).fill(false)
            .map(() => Math.random() < population));
    };

    /**
     * Generates a board with a gosper glider gun
     * @param boardSize the size of the board (in cells)
     */
    const generateGosperGliderGun = (boardSize: number) => {
        const board: boolean[][] = new Array(boardSize).fill(false).map(() => new Array(boardSize).fill(false));
        const offset: number = 10;
        const coords: any[] =
            [
                [1, 5], [1, 6], [2, 5], [2, 6], [11, 5],
                [11, 6], [11, 7], [12, 4], [12, 8], [13, 3],
                [13, 9], [14, 3], [14, 9], [15, 6], [16, 4],
                [16, 8], [17, 5], [17, 6], [17, 7], [18, 6],
                [21, 3], [21, 4], [21, 5], [22, 3], [22, 4],
                [22, 5], [23, 2], [23, 6], [25, 1], [25, 2],
                [25, 6], [25, 7], [35, 3], [35, 4], [36, 3], [36, 4],
            ];

        for (const coord of coords) {
            board[offset + coord[0]][offset + coord[1]] = true;
        }

        return board;
    };

    /**
     * Get the neighbour count of a specific cell (specified by the coordinates)
     * @param x the x coordinate
     * @param y the y coordinate
     */
    const getNeighbourCount = (x: number, y: number) => {
        let neighbours: number = 0;

        const xChecks: number[] = [x - 1, x, x + 1];
        const yChecks: number[] = [y - 1, y, y + 1];

        for (const xCheck of xChecks) {
            for (const yCheck of yChecks) {
                neighbours += (!(xCheck === x && yCheck === y) && board[xCheck] && board[xCheck][yCheck]) ? 1 : 0;
            }
        }

        return neighbours;
    };

    /**
     * Generate the next generation (every 100ms)
     */
    const nextGeneration = () => {
        board = board.map((rows, x) => rows.map((column, y) => {
            const neighbours: number = getNeighbourCount(x, y);

            return neighbours === 3 || (column && neighbours === 2);
        }));
    };
    setInterval(nextGeneration, 100);

    /**
     * Draw the entire cell board
     */
    const drawBoard = () => {
        renderer.clearScreen();

        board.forEach((rows, x) => rows.forEach((colum, y) => {
            if (colum) { renderer.drawPoint(x * scale, y * scale); }
        }));

        window.requestAnimationFrame(drawBoard);
    };
    window.requestAnimationFrame(drawBoard);


    const renderer: Renderer = new Renderer(800);
    const population: number = .03;
    const boardSize: number = 200;
    const scale: number = 4;

    let board: boolean[][] = generateBoard(boardSize * scale, population);


    /**
     * Onclick handler for the next-generation button
     */
    document.getElementById("btn-next-generation").onclick = () => {
        nextGeneration();
    };

    /**
     * Onclick handler for the generate button
     */
    document.getElementById("btn-generate").onclick = () => {
        board = generateGosperGliderGun(boardSize * scale);
    };

    /**
     * Onlick handler for the restart button
     */
    document.getElementById("btn-restart").onclick = () => {
        board = generateBoard(boardSize * scale, population);
    };

    // Custom drawing (only for testing purposes)
    let canDraw: boolean = false;
    let mode: boolean = true;
    document.getElementById("canvas").onmousemove = (event: MouseEvent) => {
        if (event.shiftKey) {
            mode = false;
        } else {
            mode = true;
        }

        const offsetX = Math.floor(event.offsetX / scale);
        const offsetY = Math.floor(event.offsetY / scale);

        if (canDraw && (offsetX <= boardSize && offsetX >= 0) && (offsetY <= boardSize && offsetY >= 0)) {
            board[offsetX][offsetY] = mode;
        }
    };

    document.getElementById("canvas").onmousedown = (event: MouseEvent) => {
        // Left Click
        if (event.button === 0) {
            canDraw = true;
        }

    };

    document.getElementById("canvas").onmouseup = (event: MouseEvent) => {
        canDraw = false;
    };
};
