const fs = require('fs');

let { create } = require('./printable');

exports.solve = async (sudoku) => {
    sudoku = findPossibles(sudoku);
    let sole = true;
    while (sole) {
        console.log("checking soles");
        let previousPlain = sudoku.plain
        sudoku = soleCandidates(sudoku);
        if (sudoku.plain.toString() == previousPlain.toString()) {
            console.log("No soles left");
            sole = false;
        }
        console.log(sudoku.plain)
        /*create(sudoku).then(s => {
            fs.writeFile(`./images/${new Date().toISOString()}`, s.toBuffer());
        })*/
    }

    return sudoku;
}

function findPossibles(sudoku) {
    for (let x = 0; x < sudoku.width; x++) {
        for (let y = 0; y < sudoku.height; y++) {
            
            if (sudoku.grid[x][y].value == 0) {
                let impossibleValues = [];
                
                for (other of sudoku.grid[x][y].row) {
                    if (other.value != 0) impossibleValues.push(other.value);
                }

                for (other of sudoku.grid[x][y].column) {
                    if (other.value != 0) impossibleValues.push(other.value);
                }

                for (column of sudoku.grid[x][y].sector) {
                    for (other of column) {
                        if (other.value != 0) impossibleValues.push(other.value);
                    }
                }

                let possibleValues = [];

                for (let i = 1; i <= sudoku.width; i++) {
                    if (impossibleValues.includes(i)) continue;
                    possibleValues.push(i)
                }
                sudoku.grid[x][y].possibleValues = possibleValues;
            } 
        }
    }

    return sudoku;
}

function soleCandidates(sudoku) {
    for (let x = 0; x < sudoku.width; x++) {
        for (let y = 0; y < sudoku.height; y++) {
            if (sudoku.grid[x][y].value == 0) {
                if (sudoku.grid[x][y].possibleValues.length == 1) {
                    sudoku.grid[x][y].value = sudoku.grid[x][y].possibleValues[0];
                    sudoku.grid[x][y].possibleValues = [];
                }
            }
        }
    }
    sudoku = findPossibles(sudoku);
    return sudoku;
}