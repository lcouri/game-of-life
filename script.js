const WIDTH = 250;
const HEIGHT = 250;

const clamp = (num, lower, upper) => Math.max(lower, Math.min(upper, num));

const getLiveCells = (grid) => grid.flat().filter(cell => cell.alive);

const createGrid = (width, height) => {
  const arr = [];
  for (let i = 0; i < width; i++) {
    arr[i] = [];
    for (let j = 0; j < height; j++) {
      arr[i][j] = {
        x: i,
        y: j,
        alive: false,
        liveNeighbors: 0,
      };
    }
  }
  return arr;
};

// randomly fills the grid with live cells for cells between between coords 100-150 on x and y
// TODO: improve this function to work with arbitray sizes
const fillRandom = (grid) => {
  for (let i = 100; i < WIDTH - 100; i++) {
    for (let j = 100; j < HEIGHT - 100; j++) {
      const alive = Math.round(Math.random() * 5) === 0;

      grid[i][j].alive = alive;

      if (alive) {
        getSurroundingCells(grid[i][j], grid).forEach(cell => cell.liveNeighbors += 1);
      }
    }
  }
};

// draws the grid - right now only draws the live cells
// TODO: draw cells that have neighbors, using darker colours with the more neighbors they have
const drawGrid = (ctx, liveCells) => {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  liveCells.forEach(cell => ctx.fillRect(cell.x, cell.y, 1, 1));
}

// returns an array of cells surrounding this cell
const getSurroundingCells = ({ x, y }, grid) => {
  const arr = [];
  const maxI = clamp(x + 1, 0, WIDTH - 1);
  const maxJ = clamp(y + 1, 0, HEIGHT - 1);
  for (let i = clamp(x - 1, 0, WIDTH); i <= maxI; i++) {
    for (let j = clamp(y - 1, 0, HEIGHT); j <= maxJ; j++) {
      if (i !== x || j !== y) {
        arr.push(grid[i][j]);
      }
    }
  }
  return arr;
};

// updates each cell's alive values, then updates their liveNeighbors values, and returns the list of liveCells to draw
const updateGrid = (grid) => {
  const liveCells = [];
  grid.forEach(row => row.forEach((cell) => {
    switch (cell.liveNeighbors) {
      case 2:
        // do nothing
        break;
      case 3:
        cell.alive = true;
        break;
      default:
        cell.alive = false;
    }
    if (cell.alive) {
      liveCells.push(cell);
    }
    // reset liveNeighbors so that we have clean values when recalculating
    cell.liveNeighbors = 0;
  }));
  // update each live cell's liveNeighbors value
  liveCells.forEach((cell) => {
    getSurroundingCells(cell, grid).forEach(cell => cell.liveNeighbors += 1)
  });
  return liveCells;
};

// -----------------------------------------------------------------------

const grid = createGrid(WIDTH, HEIGHT);
const canvas = document.getElementById('golCanvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#00cc00';
let animFrame;

fillRandom(grid);
drawGrid(ctx, getLiveCells(grid));

const update = () => {
  const liveCells = updateGrid(grid);
  drawGrid(ctx, liveCells);
  animFrame = requestAnimationFrame(update);
};

const start = () => {
  animFrame = requestAnimationFrame(update);
};

const stop = () => {
  if (animFrame) {
    cancelAnimationFrame(animFrame);
  }
};
