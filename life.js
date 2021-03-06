/**
 * Game of Life
 *
 * Accepts multi-line input on stdin to generate a starting state for a board,
 * runs multiple iterations, ends by outputting the final state of the board.
 *
 * Run with:
 * cat inputfile.txt | node life.js
 *
 * To get friendly in-progress output, turn on debug mode with
 * export DEBUG=true
 */

var readBoard = function(data) {

  var lines = data.split("\n")

  var iterations = lines[0].trim()
  var dimensions = lines[1].trim().split(' ')
  var width = dimensions[0]
  var height = dimensions[1]

  debug("Board is " + width + " by " + height + ", " + iterations + " iterations")

  var board = parseBoard(lines.slice(2))
  var newBoard = []

  // some validity checking
  if (board.length != height) {
    throw new Error("Height of input is " + board.length + ", does not match specification of " + height)
  }
  if (board[0].length != width) {
    throw new Error("Width of input is " + board[0].length + ", does not match specification of " + width)
  }

  for(var n = 0; n < iterations; n++) {
    if (isDebug()) {
      console.log("n = " + n)
      outputBoard(board)
      console.log("")
    }
    for(var y = 0; y < height; y++) {
      newBoard[y] = [] // initialize/clear
      for(var x = 0; x < width; x++) {
        newBoard[y][x] = aliveOrDead(x,y,board,width,height)
      }
    }
    board = newBoard.slice(0) // clones the array, necessary to avoid colliding on the next loop
  }

  debug("Final output:")
  outputBoard(board)

}

// calculate the life or death of a given cell
var aliveOrDead = function(x,y,board,width,height) {
  var total = 0
  for(var j = -1; j <= 1; j++) {
    for(var i = -1; i <= 1; i++) {

      if (i == 0 && j == 0) continue; // don't check yourself (or you'll wreck yourself)

      var checkY = y + j
      if (checkY < 0) {
        checkY = height - 1
      } else if (checkY >= height) {
        checkY = 0
      }

      var checkX = x + i
      if (checkX < 0) {
        checkX = width - 1
      } else if (checkX >= width) {
        checkX = 0
      }

      total += parseInt(board[checkY][checkX])
    }
  }
  // are you yourself alive?
  if (board[y][x] == 1) {
	if (total < 2 || total > 3) {
		return 0;
	} else {
		return 1;
	}
  } else {
	// currently dead
	if (total == 3) return 1
	else return 0
  }
}

// turn the input into our board array
var parseBoard = function(lines) {
  var board = []
  lines.forEach(function(line,index) {
    // TODO: these are all strings; more efficient as numbers
    // potentially even more efficient as booleans, but there would be
    // extra overhead on the math
    board.push(line.split(' '))
  })
  return board;
}

// turn the board array into output
var outputBoard = function(board) {
  board.forEach(function(line,i1) {
    console.log(line.join(' '))
  })
}

// make debugging easier
var debug = function(str) {
  if (isDebug()) console.log(str)
}
var isDebug = function() {
  return (process.env['DEBUG'] == 'true')
}

// read stdin and get cracking
var input = ''
process.stdin.resume();
process.stdin.on('data', function(buf) { input += buf.toString(); });
process.stdin.on('end', function() {readBoard(input)});