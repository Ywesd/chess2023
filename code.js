// This is my code tho =) - wes
// Creates the board
var board = [
["bR1", "bN1", "bB1", "bQu", "bKi", "bB2", "bN2", "bR2"],
["bP1", "bP2", "bP3", "bP4", "bP5", "bP6", "bP7", "bP8"],
["   ", "   ", "   ", "   ", "   ", "   ", "   ", "   "],
["   ", "   ", "   ", "   ", "   ", "   ", "   ", "   "],
["   ", "   ", "   ", "   ", "   ", "   ", "   ", "   "],
["   ", "   ", "   ", "   ", "   ", "   ", "   ", "   "],
["wP1", "wP2", "wP3", "wP4", "wP5", "wP6", "wP7", "wP8"],
["wR1", "wN1", "wB1", "wQu", "wKi", "wB2", "wN2", "wR2"]
];

// Sets new user id to a data set
createRecord("Games", {UserId:getUserId(), Game:""}, function(){});
// Displays the board and keeps the user's id in the variable id
displayBoard(); var id = getColumn("Games", "id").length + 1;

// Variables to hold the piece clicked
var initialRow;
var initialCol;
// Changes based upon if it is checking if King is in check. This is to allow
// Some pieces to not move
var checking = false;
// Holds what turn it is. Odd for white, even for black
var turn = 1;
// Holds the original color of the square buttons
var originalColor;
// Keeps the location of the Kings
var blackKingRow = 0;
var blackKingCol = 4;
var whiteKingRow = 7;
var whiteKingCol = 4;
// Helps check if castle is available
var blackLongCastle = true;
var blackShortCastle = true;
var whiteLongCastle = true;
var whiteShortCastle = true;
// Checks if an en passant is possible
var passantable = false;
var passantableTurn = 0;
var passantableRow;
var passantableCol;
// Other variables to hold moves
var possibleMoves;
var moves = "";

// Checks if the pawn can move and returns it
function canPawnMove(pawn, row, col, toRow, toCol) {
  if (pawn.substring(0, 2) == "wP" && row != 0) {
    if (col != 0 && board[row - 1][col - 1].charAt(0) == "b"
    && toRow == row - 1 && toCol == col - 1) {
      return true;
    }
    else if (col != 7 && board[row - 1][col + 1].charAt(0) == "b"
    && toRow == row - 1 && toCol == col + 1) {
      return true;
    }
    else if (toRow == passantableRow && toCol == passantableCol
    && toRow == row - 1 && Math.max(col, toCol) - Math.min(col, toCol) == 1) {
      return true;
    }
    else if (board[row - 1][col] == "   ") {
      if (toRow == row - 1 && toCol == col) {
        return true;
      }
      else if (row == 6 && board[row - 2][col] == "   ") {
        if (!checking) {
          passantable = true;
          passantableTurn = turn;
          passantableRow = toRow + 1;
          passantableCol = toCol;
        }
        return toRow == row - 2 && toCol == col;
      }
    }
  }
  else if (pawn.substring(0, 2) == "bP" && row != 7) {
    if (col != 0 && board[row + 1][col - 1].charAt(0) == "w" && toRow == row + 1 && toCol == col - 1) {
      return true;
    }
    else if (col != 7 && board[row + 1][col + 1].charAt(0) == "w" && toRow == row + 1 && toCol == col + 1) {
      return true;
    }
    else if (toRow == passantableRow && toCol == passantableCol
    && toRow == row + 1 && Math.max(col, toCol) - Math.min(col, toCol) == 1) {
      return true;
    }
    else if (board[row + 1][col] == "   ") {
      if (toRow == row + 1 && toCol == col) {
        return true;
      }
      else if (row == 1 && board[row + 2][col] == "   ") {
        if (!checking) {
          passantable = true;
          passantableTurn = turn;
          passantableRow = toRow - 1;
          passantableCol = toCol;
        }
        return toRow == row + 2 && toCol == col;
      }
    }
  }
  return false;
}

// Changes the pawn to promote
function promote(col) {
  if (board[0][col].charAt(1) == "P") {
    board[0][col] = "wQu";
  }
  else if (board[7][col].charAt(1) == "P") {
    board[7][col] = "bQu";
  }
}

// Checks if the knight can move and returns it
function canKnightMove(horse, row, col, toRow, toCol) {
  return Math.max(row, toRow) - Math.min(row, toRow) == 1 && Math.max(col, toCol) - Math.min(col, toCol) == 2 && board[toRow][toCol].charAt(0) != horse.charAt(0)
  || Math.max(row, toRow) - Math.min(row, toRow) == 2 && Math.max(col, toCol) - Math.min(col, toCol) == 1 && board[toRow][toCol].charAt(0) != horse.charAt(0);
}

// Checks if the bishop can move and returns it
function canBishopMove(bishop, row, col, toRow, toCol) {
  if (row > toRow && col > toCol) {
    row--; col--;
    while (row > toRow && col > toCol && board[row][col] == "   ") {
      row--; col--;
    }
    return row == toRow && col == toCol && board[row][col].indexOf(bishop.charAt(0)) == -1;
  }
  else if (row < toRow && col > toCol) {
    row++; col--;
    while (row < toRow && col > toCol && board[row][col] == "   ") {
      row++; col--;
    }
    return row == toRow && col == toCol && board[row][col].indexOf(bishop.charAt(0)) == -1;
  }
  else if (row > toRow && col < toCol) {
    row--; col++;
    while (row > toRow && col < toCol && board[row][col] == "   ") {
      row--; col++;
    }
    return row == toRow && col == toCol && board[row][col].indexOf(bishop.charAt(0)) == -1;
  }
  else if (row < toRow && col < toCol) {
    row++; col++;
    while (row < toRow && col < toCol && board[row][col] == "   ") {
      row++; col++;
    }
    return row == toRow && col == toCol && board[row][col].indexOf(bishop.charAt(0)) == -1;
  }
  return false;
}

// Checks if the rook can move and returns it
function canRookMove(rook, row, col, toRow, toCol) {
  if (toRow == row && toCol != col) {
    if (toCol > col) {
      return canRookMoveHelper(row, col, toCol, "col", rook.charAt(0), ">");
    }
    else {
      return canRookMoveHelper(row, col, toCol, "col", rook.charAt(0), "<");
    }
  }
  else if (toCol == col && toRow != row) {
    if (toRow > row) {
      return canRookMoveHelper(row, col, toRow, "row", rook.charAt(0), ">");
    }
    else {
      return canRookMoveHelper(row, col, toRow, "row", rook.charAt(0), "<");
    }
  }
  return false;
}

// Reduces the amount of code the rook needs
function canRookMoveHelper(row, col, to, which, color, sign) {
  if (which == "row") {
    if (sign == ">") {
      row++; while (row < to) { if (board[row][col] != "   ") { return false; } row++; } return board[row][col].indexOf(color) == -1;
    }
    else {
      row--; while (row > to) { if (board[row][col] != "   ") { return false; } row--; } return board[row][col].indexOf(color) == -1;
    }
  }
  else {
    if (sign == ">") {
      col++; while (col < to) { if (board[row][col] != "   ") { return false; } col++; } return board[row][col].indexOf(color) == -1;
    }
    else {
      col--; while (col > to) { if (board[row][col] != "   ") { return false; } col--; } return board[row][col].indexOf(color) == -1;
    }
  }
}

// Disables a castle variable
function rookCastleDisabler(rook) {
  if (rook.length == 3) {
    if (rook.charAt(0) == "b") {
      if (rook.charAt(2) == "1") {
        blackLongCastle = false;
      }
      else {
        blackShortCastle = false;
      }
    }
    else {
      if (rook.charAt(2) == "1") {
        whiteLongCastle = false;
      }
      else {
        whiteShortCastle = false;
      }
    }
  }
}

// Checks if the queen can move and returns it
function canQueenMove(queen, row, col, toRow, toCol) {
  return canBishopMove(queen.charAt(0), row, col, toRow, toCol)
  || canRookMove(queen.charAt(0), row, col, toRow, toCol);
}

// Checks if the king can move and returns it
function canKingMove(king, row, col, toRow, toCol) {
  return Math.max(row, toRow) - Math.min(row, toRow) <= 1
  && Math.max(col, toCol) - Math.min(col, toCol) <= 1
  && board[toRow][toCol].charAt(0) != king.charAt(0);
}

// Checks if the king can castle and returns it
function canCastle(king, row, col, toRow, toCol) {
  if (row == toRow && king.charAt(0) == "b") {
    if (toCol == 2 && blackLongCastle) {
      castle(true, true);
    }
    else if (toCol == 6 && blackShortCastle) {
      castle(true, false);
    }
  }
  else if (row == toRow && king.charAt(0) == "w") {
    if (toCol == 2 && whiteLongCastle) {
      castle(false, true);
    }
    else if (toCol == 6 && whiteShortCastle) {
      castle(false, false);
    }
  }
}

// Changes the board by castling
function castle(black, long) {
  if (black && long && board[0][3] == "   ") {
    board[0][0] = "   ", board[0][2] = "bKi", board[0][3] = "bR1", board[0][4] = "   ";
    if (inCheck("bKi", 0, 2)) {
      board[0][0] = "bR1", board[0][2] = "   ", board[0][3] = "   ", board[0][4] = "bKi";
      blackLongCastle = false;
    }
    else {
      displayBoard();
      playSound("https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/castle.mp3");
      passantable = false;
      turn++;
    }
  }
  else if (black && !long && board[0][5] == "   ") {
    board[0][4] = "   ", board[0][5] = "bR2", board[0][6] = "bKi", board[0][7] = "   ";
    if (inCheck("bKi", 0, 6)) {
      board[0][4] = "bKi", board[0][5] = "   ", board[0][6] = "   ", board[0][7] = "bR2";
      blackShortCastle = false;
    }
    else {
      displayBoard();
      playSound("https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/castle.mp3");
      passantable = false;
      turn++;
    }
  }
  else if (!black && long && board[7][3] == "   ") {
    board[7][0] = "   ", board[7][2] = "wKi", board[7][3] = "wR1", board[7][4] = "   ";
    if (inCheck("bKi", 7, 2)) {
      board[7][0] = "bR1", board[7][2] = "   ", board[7][3] = "   ", board[7][4] = "bKi";
      whiteLongCastle = false;
    }
    else {
      displayBoard();
      playSound("https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/castle.mp3");
      passantable = false;
      turn++;
    }
  }
  else if (board[7][5] == "   ") {
    board[7][4] = "   ", board[7][5] = "wR2", board[7][6] = "wKi", board[7][7] = "   ";
    if (inCheck("bKi", 7, 6)) {
      board[7][4] = "bKi", board[7][5] = "   ", board[7][6] = "   ", board[7][7] = "bR2";
      whiteShortCastle = false;
    }
    else {
      displayBoard();
      playSound("https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/castle.mp3");
      passantable = false;
      turn++;
    }
  }
}

// Runs all opposing pieces on the board to see if the king can be captured
function inCheck(king, row, col) {
  var check = false;
  checking = true;
  possibleMoves = 0;
  for (var r = 0; r < 8; r++) {
    for (var c = 0; c < 8; c++) {
      var piece = board[r][c];
      if (piece.charAt(0) != king.charAt(0)) {
        if (piece.charAt(1) == "P") {
          check = check || canPawnMove(board[r][c], r, c, row, col);
        }
        else if (piece.charAt(1) == "N") {
          check = check || canKnightMove(board[r][c], r, c, row, col);
        }
        else if (piece.charAt(1) == "B") {
          check = check || canBishopMove(board[r][c], r, c, row, col);
        }
        else if (piece.charAt(1) == "R") {
          check = check || canRookMove(board[r][c], r, c, row, col);
        }
        else if (piece.charAt(1) == "Q") {
          check = check || canQueenMove(board[r][c], r, c, row, col);  
        }
        else if (piece.charAt(1) == "K") {
          check = check || canKingMove(board[r][c], r, c, row, col);
        }
      }
    }
  }
  checking = false;
  return check;
}

// Moves a piece to a location
function move(row, col, toRow, toCol) {
  var piece = board[row][col];
  var pawnMove = false;
  var kingMove = false;
  var canMove = false;
  var oldPiece = "   ";
  if (piece.charAt(1) == "P") {
    canMove = canPawnMove(piece, row, col, toRow, toCol);
    pawnMove = true;
  }
  else if (piece.charAt(1) == "N") {
    canMove = canKnightMove(piece, row, col, toRow, toCol);
  }
  else if (piece.charAt(1) == "B") {
    canMove = canBishopMove(piece, row, col, toRow, toCol);
  }
  else if (piece.charAt(1) == "R") {
    canMove = canRookMove(piece, row, col, toRow, toCol);
    if (canMove) {
      rookCastleDisabler(piece);
    }
  }
  else if (piece.charAt(1) == "Q") {
    canMove = canQueenMove(piece, row, col, toRow, toCol);
  }
  else if (piece.charAt(1) == "K") {
    canMove = canKingMove(piece, row, col, toRow, toCol);
    if (canMove) {
      if (piece.charAt(0) == "b") {
        blackShortCastle = false, blackLongCastle = false;
      }
      else {
        whiteShortCastle = false, whiteLongCastle = false;
      }
    }
    else {
      canCastle(piece, row, col, toRow, toCol);
    }
    oldPiece = board[toRow][toCol];
    kingMove = true;
  }
  if (canMove) {
    var sound = board[toRow][toCol] == "   " ?
    "http://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-self.mp3" :
    "http://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/capture.mp3";
    var attacking;
    if (turn % 2 == 0) {
      attacking = "b";
    }
    else {
      attacking = "w";
    }
    board[row][col] = "   ";
    board[toRow][toCol] = piece;
    if (kingMove) {
      if (attacking == "b") {
        blackKingRow = toRow; blackKingCol = toCol;
      }
      else {
        whiteKingRow = toRow; whiteKingCol = toCol;
      }
    }
    var blackInCheck = inCheck("b", blackKingRow, blackKingCol);
    var whiteInCheck = inCheck("w", whiteKingRow, whiteKingCol);
    if ((attacking == "b" && blackInCheck) || (attacking == "w" && whiteInCheck)
    || ((blackInCheck || whiteInCheck) && kingMove)) {
      board[row][col] = piece;
      board[toRow][toCol] = oldPiece;
      if (kingMove) {
        if (attacking == "b") {
          blackKingRow = row; blackKingCol = col;
        }
        else {
          whiteKingRow = row; whiteKingCol = col;
        }
      }
    }
    else {
      if (passantable && toRow == passantableRow && toCol == passantableCol) {
        if (attacking == "b") {
          board[4][passantableCol] = "   ";
        }
        else {
          board[3][passantableCol] = "   ";
        }
      }
      if (pawnMove) {
        promote(toCol);
      }
      displayBoard();
      moves += Math.round(turn/2) + ": " + piece + " " + String.fromCharCode(97 + toRow) + toCol + "\n";
      updateRecord("Games", {id:id, UserId:getUserId(), Game:moves}, function() {});
      if (blackInCheck || whiteInCheck) {
        playSound("https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-check.mp3");
      }
      else {
        playSound(sound);
      }
      if (passantableTurn != turn) {
        passantable = false;
      }
      turn++;
    }
  }
  return board;
}

// Displays the board with new images
function displayBoard() {
  var displays = [[" ", "P", "N", "B", "R", "Q", "K"],
  ["",
  "https://static.wikia.nocookie.net/chess/images/8/8c/DarkPawn.png",
  "https://static.wikia.nocookie.net/chess/images/7/7d/DarkKnight.png",
  "https://static.wikia.nocookie.net/chess/images/c/c3/DarkBishop.png",
  "https://static.wikia.nocookie.net/chess/images/b/b9/DarkRook.png",
  "https://static.wikia.nocookie.net/chess/images/9/90/DarkQueen.png",
  "https://static.wikia.nocookie.net/chess/images/d/d7/DarkKing.png"
  ],["",
  "https://static.wikia.nocookie.net/chess/images/3/32/LightPawn.png",
  "https://static.wikia.nocookie.net/chess/images/3/32/LightKnight.png",
  "https://static.wikia.nocookie.net/chess/images/d/d7/LightBishop.png",
  "https://static.wikia.nocookie.net/chess/images/9/97/LightRook.png",
  "https://static.wikia.nocookie.net/chess/images/4/42/LightQueen.png",
  "https://static.wikia.nocookie.net/chess/images/7/78/LightKing.png",
  ]];
  var index;
  for (var r = 0; r < 8; r++) {
    for (var c = 0; c < 8; c++) {
      if (board[r][c].charAt(0) == "b") {
        index = 1;
      }
      else {
        index = 2;
      }
      setProperty("" + r + c, "image", displays[index][displays[0].indexOf(board[r][c].charAt(1))]);
    }
  }
}

// Changes the color of squares and moves them based on user interface
function piece(row, col) {
  var id = "" + row + col, originalId = "" + initialRow + initialCol;
  if (turn % 2 == 1 && board[row][col].charAt(0) == "w") {
    if (initialRow != undefined) {
      setProperty(originalId, "background-color", originalColor);
    }
    originalColor = getProperty(id, "background-color");
    setProperty(id, "background-color", "#C84B4B");
    initialRow = row; initialCol = col;
  }
  else if (turn % 2 == 0 && board[row][col].charAt(0) == "b") {
    if (initialRow != undefined) {
      setProperty(originalId, "background-color", originalColor);
    }
    originalColor = getProperty(id, "background-color");
    setProperty(id, "background-color", "#C84B4B");
    initialRow = row; initialCol = col;
  }
  else if (initialRow != undefined) {
    move(initialRow, initialCol, row, col);
    setProperty(originalId, "background-color", originalColor);
  }
}

// Every user interface to allow them to play tennis
onEvent("00", "click", function () {
  piece(0, 0);
});
onEvent("10", "click", function () {
  piece(1, 0);
});
onEvent("20", "click", function () {
  piece(2, 0);
});
onEvent("30", "click", function () {
  piece(3, 0);
});
onEvent("40", "click", function () {
  piece(4, 0);
});
onEvent("50", "click", function () {
  piece(5, 0);
});
onEvent("60", "click", function () {
  piece(6, 0);
});
onEvent("70", "click", function () {
  piece(7, 0);
});
onEvent("01", "click", function () {
  piece(0, 1);
});
onEvent("11", "click", function () {
  piece(1, 1);
});
onEvent("21", "click", function () {
  piece(2, 1);
});
onEvent("31", "click", function () {
  piece(3, 1);
});
onEvent("41", "click", function () {
  piece(4, 1);
});
onEvent("51", "click", function () {
  piece(5, 1);
});
onEvent("61", "click", function () {
  piece(6, 1);
});
onEvent("71", "click", function () {
  piece(7, 1);
});
onEvent("02", "click", function () {
  piece(0, 2);
});
onEvent("12", "click", function () {
  piece(1, 2);
});
onEvent("22", "click", function () {
  piece(2, 2);
});
onEvent("32", "click", function () {
  piece(3, 2);
});
onEvent("42", "click", function () {
  piece(4, 2);
});
onEvent("52", "click", function () {
  piece(5, 2);
});
onEvent("62", "click", function () {
  piece(6, 2);
});
onEvent("72", "click", function () {
  piece(7, 2);
});
onEvent("03", "click", function () {
  piece(0, 3);
});
onEvent("13", "click", function () {
  piece(1, 3);
});
onEvent("23", "click", function () {
  piece(2, 3);
});
onEvent("33", "click", function () {
  piece(3, 3);
});
onEvent("43", "click", function () {
  piece(4, 3);
});
onEvent("53", "click", function () {
  piece(5, 3);
});
onEvent("63", "click", function () {
  piece(6, 3);
});
onEvent("73", "click", function () {
  piece(7, 3);
});
onEvent("04", "click", function () {
  piece(0, 4);
});
onEvent("14", "click", function () {
  piece(1, 4);
});
onEvent("24", "click", function () {
  piece(2, 4);
});
onEvent("34", "click", function () {
  piece(3, 4);
});
onEvent("44", "click", function () {
  piece(4, 4);
});
onEvent("54", "click", function () {
  piece(5, 4);
});
onEvent("64", "click", function () {
  piece(6, 4);
});
onEvent("74", "click", function () {
  piece(7, 4);
});
onEvent("05", "click", function () {
  piece(0, 5);
});
onEvent("15", "click", function () {
  piece(1, 5);
});
onEvent("25", "click", function () {
  piece(2, 5);
});
onEvent("35", "click", function () {
  piece(3, 5);
});
onEvent("45", "click", function () {
  piece(4, 5);
});
onEvent("55", "click", function () {
  piece(5, 5);
});
onEvent("65", "click", function () {
  piece(6, 5);
});
onEvent("75", "click", function () {
  piece(7, 5);
});
onEvent("06", "click", function () {
  piece(0, 6);
});
onEvent("16", "click", function () {
  piece(1, 6);
});
onEvent("26", "click", function () {
  piece(2, 6);
});
onEvent("36", "click", function () {
  piece(3, 6);
});
onEvent("46", "click", function () {
  piece(4, 6);
});
onEvent("56", "click", function () {
  piece(5, 6);
});
onEvent("66", "click", function () {
  piece(6, 6);
});
onEvent("76", "click", function () {
  piece(7, 6);
});
onEvent("07", "click", function () {
  piece(0, 7);
});
onEvent("17", "click", function () {
  piece(1, 7);
});
onEvent("27", "click", function () {
  piece(2, 7);
});
onEvent("37", "click", function () {
  piece(3, 7);
});
onEvent("47", "click", function () {
  piece(4, 7);
});
onEvent("57", "click", function () {
  piece(5, 7);
});
onEvent("67", "click", function () {
  piece(6, 7);
});
onEvent("77", "click", function () {
  piece(7, 7);
});
