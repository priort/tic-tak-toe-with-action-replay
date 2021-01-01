let winChecker = function() {

    const thereIsAWinner = gameBoard =>
         thereIsACompletedRow(gameBoard) ||
            thereIsACompletedColumn(gameBoard) ||
            thereIsACompletedDiagonalLeftToRight(gameBoard) ||
            thereIsACompletedDiagonalRightToLeft(gameBoard);

    const thereIsACompletedRow = gameBoard =>
        gameBoard.find(row => row.every(col => col && col === row[0])) !== undefined;

    const thereIsACompletedColumn = gameBoard => {
        let completedColumn = false;
        for (let col = 0; col < gameBoard[0].length; col++) {
            let row = 0;
            for (row = 0; row < gameBoard.length; row++) {
                if (!gameBoard[row][col] || gameBoard[row][col] !== gameBoard[0][col]) {
                    break;
                }
            }

            if (row === gameBoard.length) {
                completedColumn = true;
                break;
            }
        }
        return completedColumn;
    }

    const thereIsACompletedDiagonalLeftToRight = gameBoard => {
        let i;
        for (i = 0; i < gameBoard.length; i++) {
            if (!gameBoard[i][i] || gameBoard[i][i] !== gameBoard[0][0]) {
                break;
            }
        }
        return (i === gameBoard.length)
    }

    const thereIsACompletedDiagonalRightToLeft = gameBoard => {
        let iBack = gameBoard.length - 1;
        for (let r = 0; iBack >= 0; iBack--, r++) {
            if (!gameBoard[r][iBack] || gameBoard[r][iBack] !== gameBoard[0][gameBoard.length - 1]) {
                break;
            }
        }
        return (iBack === -1)
    }


    const gameBoardIsFull = gameBoard =>
        gameBoard.every(row => row.every(cell => cell === 'X' || cell === 'O'));

    return { 
        thereIsAWinner: thereIsAWinner, 
        gameBoardIsFull: gameBoardIsFull
    };
}();

const tests = () => {
    let testsPassed;
    let gameboardWithNoCompletedRowsOrColumnsButAllCellsCompleted = [
        ['X','O', 'X'],
        ['O','O', 'X'],
        ['O','X', 'O']
    ]

    testsPassed = !(winChecker.thereIsAWinner(gameboardWithNoCompletedRowsOrColumnsButAllCellsCompleted));
    console.log('Test thereIsAWinner gameboardWithNoCompletedRowsOrColumnsButAllCellsCompleted ' + testsPassed);

    testsPassed = (winChecker.gameBoardIsFull(gameboardWithNoCompletedRowsOrColumnsButAllCellsCompleted));
    console.log('Test gameboardIsFull gameboardWithNoCompletedRowsOrColumnsButAllCellsCompleted ' + testsPassed);

    let gameboardWithCompletedRow0 = [
        ['X','X', 'X'],
        ['O','O', 'X'],
        ['O','X', 'O']
    ]

    testsPassed = winChecker.thereIsAWinner(gameboardWithCompletedRow0);
    console.log('Test thereIsAWinner gameboardWithCompletedRow0 ' + testsPassed);

    testsPassed = winChecker.gameBoardIsFull(gameboardWithCompletedRow0);
    console.log('Test gameboardIsFull gameboardWithCompletedRow0 ' + testsPassed);

    let gameboardWithCompletedRow1 = [
        ['O','O', 'X'],
        ['X','X', 'X'],
        ['O','X', 'O']
    ]

    testsPassed = winChecker.thereIsAWinner(gameboardWithCompletedRow1);
    console.log('Test thereIsAWinner gameboardWithCompletedRow1 ' + testsPassed);

    let gameboardWithCompletedRow2 = [
        ['O','O', 'X'],
        ['O','X', 'O'],
        ['X','X', 'X']
    ]

    testsPassed = winChecker.thereIsAWinner(gameboardWithCompletedRow2);
    console.log('Test thereIsAWinner gameboardWithCompletedRow2 ' + testsPassed);

    let gameboardWithCompletedCol0 = [
        ['O','O', 'X'],
        ['O','X', 'O'],
        ['O','X', 'X']
    ]

    testsPassed = winChecker.thereIsAWinner(gameboardWithCompletedCol0);
    console.log('Test: gameboardWithCompletedCol0 ' + testsPassed);

    let gameboardWithCompletedCol1 = [
        ['O', 'O', 'X'],
        ['X', 'O', 'O'],
        ['X', 'O', 'X']
    ]

    testsPassed = winChecker.thereIsAWinner(gameboardWithCompletedCol1);
    console.log('Test thereIsAWinner gameboardWithCompletedCol1 ' + testsPassed);

    let gameboardWithCompletedCol2 = [
        ['O', 'X', 'O' ],
        ['X', 'O', 'O' ],
        ['X', 'X', 'O' ]
    ]

    testsPassed = winChecker.thereIsAWinner(gameboardWithCompletedCol2);
    console.log('Test thereIsAWinner gameboardWithCompletedCol2 ' + testsPassed);

    let gameboardWithCompletedDiagonalLeftToRight = [
        ['O', 'X', 'O' ],
        ['X', 'O', 'X' ],
        ['X', 'X', 'O' ]
    ]

    testsPassed = winChecker.thereIsAWinner(gameboardWithCompletedDiagonalLeftToRight);
    console.log('Test thereIsAWinner gameboardWithCompletedDiagonalLeftToRight ' + testsPassed);

    let gameboardWithCompletedDiagonalRightToLeft = [
        ['X', 'X', 'O' ],
        ['X', 'O', 'X' ],
        ['O', 'X', 'O' ]
    ]

    testsPassed = winChecker.thereIsAWinner(gameboardWithCompletedDiagonalRightToLeft);
    console.log('Test thereIsAWinner gameboardWithCompletedDiagonalRightToLeft ' + testsPassed);

    let gameboardWithCompletedDiagonalLeftToRight5By5 = [
        ['O', 'X', 'O', 'X', 'O' ],
        ['X', 'O', 'X', 'O', 'X' ],
        ['O', 'X', 'O', 'X', 'O' ],
        ['O', 'X', 'O', 'O', 'O' ],
        ['O', 'X', 'O', 'X', 'O' ]
    ]

    testsPassed = winChecker.thereIsAWinner(gameboardWithCompletedDiagonalLeftToRight5By5);
    console.log('Test thereIsAWinner gameboardWithCompletedDiagonalLeftToRight5By5 ' + testsPassed);

    let gameboardWithCompletedDiagonalRightToLeft5By5 = [
        ['X', 'X', 'O', 'X', 'O' ],
        ['X', 'O', 'X', 'O', 'X' ],
        ['O', 'X', 'O', 'X', 'O' ],
        ['O', 'O', 'O', 'O', 'O' ],
        ['O', 'X', 'O', 'X', 'O' ]
    ]

    testsPassed = winChecker.thereIsAWinner(gameboardWithCompletedDiagonalRightToLeft5By5);
    console.log('Test thereIsAWinner gameboardWithCompletedDiagonalRightToLeft5By5 ' + testsPassed);

    let gameboardWithSomeEmpty = [
        ['X', '', '' ],
        ['', '', '' ],
        ['', '', '' ],
    ]

    testsPassed = !winChecker.thereIsAWinner(gameboardWithSomeEmpty);
    console.log('Test thereIsAWinner gameboardWithSomeEmpty ' + testsPassed);

    testsPassed = !winChecker.gameBoardIsFull(gameboardWithSomeEmpty);
    console.log('Test gameboardIsFull gameboardWithSomeEmpty ' + testsPassed);
}