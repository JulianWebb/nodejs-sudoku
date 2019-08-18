exports.solve = async (sudoku) => {
    let unsolved = true;

    while (unsolved) {
        sudoku = generateCandidates(sudoku);
        let globalSoles = getSoleCandidates(sudoku);
        if (globalSoles.length > 0) {
            for (cell of globalSoles) {
                sudoku.grid[cell.x][cell.y].value = cell.value;
                sudoku.grid[cell.x][cell.y].candidates = [];
            }
        } else {
            unsolved = false;

            /* Sector Checking */
            for (let x = 0; x < 3; x++) {
                for (let y = 0; y < 3; y++) {
                    let sectorCandidates = getSectorCandidates(sudoku.sector(x * 3, y * 3));
                    if (sectorCandidates.length > 0) {
                        unsolved = true;
                        for (c of sectorCandidates) {
                            sudoku.grid[c.x][c.y].value = c.value;
                            sudoku.grid[c.x][c.y].candidates = [];
                        }
                    } 
                }
            }
            sudoku = generateCandidates(sudoku);

            /* Row Checking */
            for (let i = 0; i < 9; i++) {
                let rowCandidates = getLineCandidates(sudoku.row(i))
                if (rowCandidates.length > 0) {
                    unsolved = true;
                    for (cell of rowCandidates) {
                        sudoku.grid[cell.x][cell.y].value = cell.value;
                        sudoku.grid[cell.x][cell.y].candidates = [];
                    }
                }
            }
            sudoku = generateCandidates(sudoku);

            /* Column Checking */
            for (let i = 0; i < 9; i++) {
                let colCandidates = getLineCandidates(sudoku.row(i))
                if (colCandidates.length > 0) {
                    unsolved = true;
                    for (cell of colCandidates) {
                        sudoku.grid[cell.x][cell.y].value = cell.value;
                        sudoku.grid[cell.x][cell.y].candidates = [];
                    }
                }
            }
        }
    }

    return sudoku;
}


function generateCandidates(sudoku) {
    for (let x = 0; x < sudoku.width; x++) {
        for (let y = 0; y < sudoku.height; y++) {
            if (sudoku.grid[x][y].value == 0) {
                let notCandidates = [];
                
                for (other of sudoku.grid[x][y].row) { if (other.value != 0) notCandidates.push(other.value) }
                for (other of sudoku.grid[x][y].column) { if (other.value != 0) notCandidates.push(other.value) }
                for (column of sudoku.grid[x][y].sector) {
                    for (other of column) { if (other.value != 0) notCandidates.push(other.value) }
                }
                let candidates = [];

                for (let i = 1; i <= sudoku.width; i++) {
                    if (notCandidates.includes(i)) continue;
                    candidates.push(i)
                }
                sudoku.grid[x][y].candidates = candidates;
            } 
        }
    }
    return sudoku;
}

function getSoleCandidates(sudoku) {
    let positions = [];

    for (let x = 0; x < sudoku.width; x++) {
        for (let y = 0; y < sudoku.height; y++) {
            if (sudoku.grid[x][y].value == 0) {
                if (sudoku.grid[x][y].candidates.length == 1) {
                    positions.push({
                        x: x, y: y,
                        value: sudoku.grid[x][y].candidates[0]
                    })
                }
            }
        }
    }
    return positions;
}

function getSectorCandidates(sector) {
    let positions = [];
    for (let n = 1; n <= 9; n++) {
        let position = [];
        for (let x = 0; x < sector.length; x++) {
            for (let y = 0; y < sector[x].length; y++) {
                if (sector[x][y].candidates.includes(n)) {
                    let cell = sector[x][y];
                    let c = {
                        x: cell.x, y: cell.y,
                        value: n
                    }
                    position.push(c)
                }
                if (position.length > 1) break;
            }
            if (position.length > 1) break;
        }
        if (position.length == 1) positions.push(position[0])
    }

    return positions;
}

function getLineCandidates(line) {
    let positions = [];
    
    for (let n = 1; n <= 9; n++) {
        let position = [];
        for (let i = 0; i < line.length; i++) {
            if (line[i].candidates.includes(n)) {
                let cell = line[i];
                let c = {
                    x: cell.x, y: cell.y,
                    value: n
                }
                position.push(c)
            }
            if (position.length > 1) break;
        }
        
        if (position.length == 1) {
            console.log(position)
            positions.push(position[0])
        }
    }

    return positions;
}

function checkSolved(sudoku) {
    for (let x = 0; x < sudoku.width; x++) {
        for (let y = 0; y < sudoku.height; y++) {
            if (sudoku.grid[x][y].value == 0) {
                return false;
            }
        }
    }
    return true;
}