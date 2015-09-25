const directions = ["north", "south", "east", "west"]

class Cell {
  constructor(row, column) {
    this.row = row
    this.column = column
    this.north = this.south = this.east = this.west = null
    this._links = new Set()
  }

  get links() {
    return [...this._links]
  }

  get neighbors() {
    const result = []
    directions.forEach(direction => {
      if (this[direction]) {
        result.push(this[direction])
      }
    })
    return result
  }

  link(cell, bidirectional=true) {
    this._links.add(cell)
    if (bidirectional) {
      cell.link(this, false)
    }
    return this
  }

  unlink(cell, bidirectional=true) {
    this._links.delete(cell)
    if (bidirectional) {
      cell.unlink(this, false)
    }
    return this
  }

  isLinked(cell) {
    return cell && this._links.has(cell)
  }
}

export default class Grid {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.grid = this.generateGrid()
    this.configureCells()
  }

  get rows() {
    return this.grid
  }

  get cells() {
    return this.rows.reduce((a, b) => a.concat(b))
  }

  get length() {
    return this.width * this.height
  }

  randomCell() {
    return this.cells[Math.floor(Math.random() * this.length)]
  }

  get(row, column) {
    if (row < 0 || row >= this.height) {
      return null
    }
    if (column < 0 || column >= this.width) {
      return null
    }
    return this.grid[row][column]
  }

  generateGrid() {
    const result = new Array(this.height)
    for (let row = 0; row < this.height; row++) {
      result[row] = new Array(this.width)
      for (let column = 0; column < this.width; column++) {
        result[row][column] = new Cell(row, column)
      }
    }
    return result
  }

  configureCells() {
    this.cells.forEach(cell => {
      const {row, column} = cell
      cell.north = this.get(row - 1, column)
      cell.south = this.get(row + 1, column)
      cell.west = this.get(row, column - 1)
      cell.east = this.get(row, column + 1)
    })
  }

  toString() {
    return this.rows.map((row, i) => {
      let result = ""

      if (i == 0) {
        result += "█"
        row.forEach(() => {
          result += "████"
        })
        result += "\n"
      }

      let top = "█"
      let bottom = "█"
      row.forEach((cell, j) => {
        top += "   "
        if (cell.isLinked(cell.east)) {
          top += " "
        } else {
          top += "█"
        }

        if (cell.isLinked(cell.south)) {
          bottom += "   "
        } else {
          bottom += "███"
        }
        bottom += "█"
      })

      result += [top, bottom].join("\n")
      return result
    }).join("\n")
  }
}
