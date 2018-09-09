/* Main */
let board;

function input(action) {
  board = transition(board, action)
  output(board)
}

function output(board) {
  document.getElementById("root").innerHTML = render(board)
}

input({type: 'intialize'})

/* Transition functions */
function transition(board, action) {
  switch (action.type) {
    case 'intialize':
      return intialBoard()
    case 'click':
      return click(board, action.value)
    default:
      return board
  }
}

function intialBoard(rows=15, cols=15, mines=30){
  const cell = (i, j) => ({
    mine : false,
    show : false,
    index: [i, j],
    hint : 0
  })
  return calculateHints(assignMines(make2dArrayOf(rows, cols, cell), mines))
}

/*  "click" functions */
function click(board, evt) {
  const
    x      = evt.target.x.baseVal.value,
    y      = evt.target.y.baseVal.value,
    width  = evt.target.width.baseVal.value,
    height = evt.target.height.baseVal.value,
    i      = x/width,
    j      = y/height

  return board[i][j].mine ? showAllCells(board) : showCells(board, board[i][j])
}

function showAllCells(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      board[i][j].show = true
    }
  }
  return board
}

function showCells(board, cell){
  cell.show = true
  if (cell.hint == 0){
    let neighbors = neighborHood(board, cell.index)
    for (let n = 0; n < neighbors.length; n++) {
      let i = neighbors[n][0],
          j = neighbors[n][1]
      if (!board[i][j].mine && !board[i][j].show){
        showCells(board, board[i][j])
      }
    }
  }
  return board
}

/* Render Functions */
function render(board) {
  const
    width      = 600,
    height     = 600,
    cellWidth  = width/board.length,
    cellHeight = height/board[0].length
  return(
    `<svg width=600 height=600 stroke="black">
      <g fill="none" stroke="black">
        ${renderBoard({cellWidth, cellHeight}, board)}
      </g)>
    </svg>`
  )
}

function renderBoard(props, board) {
  let boardRendering = ""
  for (const col of board) {
    for (const cell of col) {
      boardRendering += renderCell(props, cell)
    }
  }
  return boardRendering
}

function renderCell(props, cell) {
  const
    x = cell.index[0] * props.cellWidth,
    y = cell.index[1] * props.cellWidth
    width = props.cellWidth
    height = props.cellHeight
  return(
    `<rect
      width=${width}
      height=${height}
      x=${x}
      y=${y}
      fill=${cell.show? cell.mine ? "red" : "white" : "#c9c9c9"}
      stroke="black">
    </rect>
    <text
      x=${x + width/2}
      y=${y + height/2}
      text-anchor="middle"
      alignment-baseline="middle"
      font-size="1.5em"
      font-weight="bolder"
      fill="black">
      ${cell.show && cell.hint != 0 && !cell.mine ? cell.hint : " "}
     </text>`
   )
}

/* Inputs */
document.body.addEventListener("click",
  function(evt) {
    if(evt.target.tagName === "rect"){
      input({type:"click", value: evt})
    }
  })

document.getElementById("reset").addEventListener("click",
  function(evt) {
    input({type:"intialize", value: evt})
  })

/* Helper functions */
function neighborHood(board, [i, j]) {
  return [[i-1,j+1],[i,j+1],[i+1,j+1],
          [i-1,j]  ,        [i+1,j]  ,
          [i-1,j-1],[i,j-1],[i+1,j-1]]
          .filter(([i, j]) => inBoundry(board, i, j))
}

function inBoundry(board, i, j) {
  return i >= 0 && j >= 0 && i < board.length && j < board[0].length
}

function make2dArrayOf(rows, cols, element) {
  let board = []
  for (let i = 0; i < rows; i++) {
    board[i] = []
    for (let j = 0; j < cols; j++) {
      board[i][j] = element(i, j)
    }
  }
  return board
}

function assignMines(board, mines) {
  for (let k = 0; k < mines; k++) {
    let i = Math.floor(Math.random() * board.length)
    let j = Math.floor(Math.random() *  board[0].length)
    board[i][j].mine = true
  }
  return board
}

function calculateHints(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      let hint = 0
      let neighbors =  neighborHood(board, [i, j])
      for (let n = 0; n < neighbors.length; n++) {
        if (board[neighbors[n][0]][neighbors[n][1]].mine) {
          hint++
        }
      }
      board[i][j].hint = hint
    }
  }
  return board
}
