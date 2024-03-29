class Sudoku {
  constructor() {
    this.gen();
  }

  display() {
    let temp, element;
    console.log();
    for (let i = 0; i < 9; i++) {
      if (i % 3 == 0) {
        console.log("  -----------------------------");
      }
      temp = [];
      temp.push(" | ");
      for (let j = 0; j < 9; j++) {
        element = this.grid[i][j];
        if (element == 0) {
          temp.push(" ");
        } else {
          temp.push(String(element));
        }
        if (j % 3 == 2) {
          temp.push(" | ");
        }
      }
      console.log(temp.join(" "));
    }
    console.log("  -----------------------------");
  }

  possible(x, y, n) {
    for (let i = 0; i < 9; i++) {
      if (n == this.grid[y][i] || n == this.grid[i][x]) {
        return false;
      }
    }
    let x0 = Math.floor(x / 3) * 3;
    let y0 = Math.floor(y / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.grid[y0 + i][x0 + j] == n) {
          return false;
        }
      }
    }
    return true;
  }

  getValidBoard() {
    let grid_poss = {};
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        if (this.grid[y][x] == 0) {
          grid_poss[[x, y]] = [];
          for (let n = 1; n < 10; n++) {
            if (this.possible(x, y, n)) {
              grid_poss[[x, y]].push(n);
            }
          }
        }
      }
    }
    if (Object.keys(grid_poss).length > 0) {
      let min_len = Math.min(...Object.values(grid_poss).map((x) => x.length));
      if (min_len == 0) {
        return false;
      }
      let temp, x, y, v;
      temp = Object.entries(grid_poss).filter((x) => x[1].length == min_len);
      temp = temp[Math.floor(Math.random() * temp.length)];
      [x, y] = temp[0].split(",").map((x) => parseInt(x));
      v = temp[1];
      for (let n of v) {
        this.grid[y][x] = n;
        if (this.getValidBoard()) {
          return true;
        }
        this.grid[y][x] = 0;
      }
      return false;
    }
    return true;
  }

  solveAlgo(display) {
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        if (this.grid[y][x] == 0) {
          for (let n = 1; n < 10; n++) {
            if (this.possible(x, y, n)) {
              this.grid[y][x] = n;
              this.solveAlgo(display);
              if (this.unique == false) {
                return false;
              }
              this.grid[y][x] = 0;
            }
          }
          return false;
        }
      }
    }
    if (this.unique == null) {
      this.unique = true;
      if (display) {
        this.display();
      }
    } else if (this.unique == true) {
      this.unique = false;
    }
  }

  solve(display = true) {
    this.unique = null;
    this.solveAlgo(display);
    return this.unique;
  }

  shuffle(array) {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }

  getProblem() {
    this.getValidBoard(false);
    let pairs = [];
    for (let i = 0; i < 41; i++) {
      pairs.push([i, 80 - i]);
    }
    this.shuffle(pairs);
    for (let [i, j] of pairs) {
      let temp1, temp2;
      temp1 = this.grid[Math.floor(i / 9)][i % 9];
      temp2 = this.grid[Math.floor(j / 9)][j % 9];
      this.grid[Math.floor(i / 9)][i % 9] = 0;
      this.grid[Math.floor(j / 9)][j % 9] = 0;
      if (!this.solve(false)) {
        this.grid[Math.floor(i / 9)][i % 9] = temp1;
        this.grid[Math.floor(j / 9)][j % 9] = temp2;
      }
    }
  }

  gen(zero_threshold = 40) {
    this.grid = [];
    while (this.grid.flat().filter((x) => x == 0).length < zero_threshold) {
      this.grid = [];
      for (let i = 0; i < 9; i++) {
        this.grid.push([]);
        for (let j = 0; j < 9; j++) {
          this.grid[i].push([0]);
        }
      }
      this.getProblem(false);
    }
  }
}

s = new Sudoku();
s.display();
s.solve();
