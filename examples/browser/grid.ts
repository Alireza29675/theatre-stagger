const rows = 10;
const cols = 10;

const width = window.innerWidth / cols;
const height = window.innerHeight / rows;

const size = Math.min(width, height) - 10;

type TCell = HTMLDivElement;
type TColumn = TCell[]
type TGrid = TColumn[]

const grid: TGrid = []

const gridContainer = document.querySelector('.grid')

for (let i = 0; i < cols; i++) {
    const column: TColumn = []
    for (let j = 0; j < rows; j++) {
        const element = document.createElement('div')
        element.style.width = size + 'px';
        element.style.height = size + 'px';
        element.style.top = (j * height) + ((height - size)/2) + 'px';
        element.style.left = (i * width) + ((width - size)/2) + 'px';
        if (gridContainer) {
            gridContainer.appendChild(element)
            column.push(element)
        }
    }
    grid.push(column)
}

export const getRow = (i: number) => {
    return grid[i]
}
export const getAll = () => {
    const cells: TColumn = [];
    grid.forEach((column: TColumn) => {
        column.forEach((cell: TCell) => {
            cells.push(cell)
        })
    })
    return cells;
}