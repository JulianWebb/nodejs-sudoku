const {createCanvas} = require('canvas');

exports.create = async (sudoku, settings = {}) => {

    /* Default Settings if missing from the settings object */
    let padding = settings.padding || 16;
    let cellWidth = settings.padding || 128;
    let valueSize = settings.padding || 48;
    let possibleValueSize = settings.padding || 16;

    let bgColor = settings.background || "white";
    let fgColor = settings.foreground || "black";

    // Creating the Canvas
    let printable = createCanvas((padding * 2) + (cellWidth * 9), (padding * 2) + (cellWidth * 9));
    let ctx = printable.getContext('2d');

    
    // Filling the Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, (padding * 2) + (cellWidth * 9), (padding * 2) + (cellWidth * 9));

    // Simple Grid
    // TODO: Make it work with any size sudoku
    ctx.beginPath();
    ctx.strokeStyle = fgColor;
    ctx.lineWidth = 2;

    for (let x = 0; x <= 9; x++) {
        ctx.moveTo(padding + (x * cellWidth), padding);
        ctx.lineTo(padding + (x * cellWidth), padding + (cellWidth * 9))
    }

    for (let y = 0; y <= 9; y++) {
        ctx.moveTo(padding, padding + (y * cellWidth));
        ctx.lineTo(padding + (cellWidth * 9), padding + (y * cellWidth))
    }
    ctx.stroke();

    // Thicker Grid around Sectors
    // TODO: Make it work with any size sectors
    ctx.beginPath();
    ctx.lineWidth = 4;

    for (let x = 0; x <= 3; x++) {
        ctx.moveTo(padding + (cellWidth * (x * 3)), padding);
        ctx.lineTo(padding + (cellWidth * (x * 3)), padding + (cellWidth * 9));
    }

    for (let y = 0; y <= 3; y++) {
        ctx.moveTo(padding, padding + (cellWidth * (y * 3)));
        ctx.lineTo(padding + (cellWidth * 9), padding + (cellWidth * (y * 3)));
    }
    ctx.stroke();

    // Box around edge to clean up the border
    ctx.strokeRect(padding, padding, (cellWidth * 9), (cellWidth * 9));

    // This is to make the text be drawn from a centre point, so much easier
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Values
    ctx.fillStyle = fgColor;
    ctx.font = `${valueSize}px serif`;
    for (let x = 0; x < sudoku.width; x++) {
        for (let y = 0; y < sudoku.height; y++) {
            if (sudoku.grid[x][y].value == 0) continue;
            let value = sudoku.grid[x][y].value.toString();
            let text_x = padding + (cellWidth * (x + 1)) - (cellWidth / 2);
            let text_y = padding + (cellWidth * (y + 1)) - (cellWidth / 2);
            ctx.fillText(value, text_x, text_y)
        }
    }

    // Possible Values
    // TODO: Make usable for any number range
    ctx.font = `${possibleValueSize}px serif`;
    let pos = [[1, 4, 7],[2, 5, 8],[3, 6, 9]]
    
    for (let x = 0; x < sudoku.width; x++) {
        for (let y = 0; y < sudoku.height; y++) {
            for (let c = 0; c < 3; c++) {
                for (let r = 0; r < 3; r++) {
                    if (sudoku.grid[x][y].possibleValues.includes(pos[c][r])) {
                        let pos_x = padding - (cellWidth / 2) - (cellWidth / 4) + (cellWidth * (x + 1)) + ((cellWidth / 4) * c);
                        let pos_y = padding - (cellWidth / 2) - (cellWidth / 4) + (cellWidth * (y + 1)) + ((cellWidth / 4) * r)
                        ctx.fillText(pos[c][r], pos_x, pos_y)
                    }
                }
            }
        }
    }
    return printable;
}