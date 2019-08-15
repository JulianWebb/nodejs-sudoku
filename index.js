// index.js

const fs = require('fs');

let printable = require('./printable');
let { solve } = require('./solver')

// Because I don't want to have [y][x], instead I want [x][y] since I already coded it that way
function transposeArray(array, arrayLength){
    var newArray = [];
    for(var i = 0; i < array.length; i++){
        newArray.push([]);
    };

    for(var i = 0; i < array.length; i++){
        for(var j = 0; j < arrayLength; j++){
            newArray[j].push(array[i][j]);
        };
    };

    return newArray;
}

class Cell {
    constructor(value, x, y, parent) {
        this.value = value;
        this.possibleValues = [];
        this.x = x;
        this.y = y;
        this.grid = parent;
    }

    get row() {
        return this.grid.row(this.x);
    }

    get column() {
        return this.grid.column(this.y);
    }

    get sector() {
        return this.grid.sector(this.x, this.y);
    }
}

class Grid {
    constructor(grid) {
        let inputGrid = transposeArray(grid, grid.length)

        this.grid = [];

        for (let x = 0; x < 9; x++) {
            this.grid[x] = [];
            
            for (let y = 0; y < 9; y++) {
                this.grid[x][y] = new Cell(inputGrid[x][y], x, y, this);
            }
        }


        this.cellCount = {
            width: this.grid.length,
            height: this.grid[0].length
        }

    }
    row(x) {
        return this.grid[x];
    }

    column(y) {
        let column = [];
        for (let x = 0; x < this.width; x++) {
            column.push(this.grid[x][y]);
        }

        return column;
    }

    sector(x, y) {
        // It's a horrible bodge, I bet there is a better solution (or at least a prettier one)
        let start_x = 0;
        let start_y = 0;
        
        let end_x = 0;
        let end_y = 0;

        if (x < 3) {
            start_x = 0;
            end_x = 2;
        } else if (x > 2 && x < 6) {
            start_x = 3;
            end_x = 5;
        } else if (x > 5) {
            start_x = 6;
            end_x = 8;
        }

        if (y < 3) {
            start_y = 0;
            end_y = 2;
        } else if (y > 2 && y < 6) {
            start_y = 3;
            end_y = 5;
        } else if (x > 5) {
            start_y = 6;
            end_y = 8;
        }

        let sector = [];
        for (let grid_x = start_x; grid_x <= end_x; grid_x++) {
            sector[grid_x - start_x] = [];

            for (let grid_y = start_y; grid_y <= end_y; grid_y++) {
                sector[grid_x - start_x][grid_y - start_y] = this.grid[grid_x][grid_y];
            }
        }

        return sector;

    }

    get width() {
        return this.cellCount.width;
    }

    get height() {
        return this.cellCount.height;
    }


}


let sudoku = new Grid([
    [0, 0, 8, 6, 3, 0, 9, 0, 5],
    [0, 0, 0, 0, 0, 4, 3, 0, 7],
    [2, 0, 3, 0, 9, 0, 8, 4, 0],
    [8, 0, 6, 0, 1, 0, 0, 7, 4],
    [0, 0, 2, 0, 8, 0, 5, 6, 9],
    [0, 9, 5, 2, 6, 0, 0, 0, 8],
    [5, 8, 1, 3, 0, 0, 0, 9, 0],
    [3, 6, 0, 0, 5, 2, 0, 8, 1],
    [9, 0, 4, 0, 7, 0, 6, 0, 0]
])

//console.log(sudoku.grid[6][3].sector)

solve(sudoku).then((sudoku) => {
    printable.create(sudoku).then((p) => {
        fs.writeFileSync('sudoku.png', p.toBuffer())
    })
})