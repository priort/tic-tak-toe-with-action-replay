let eventDispatcher = function() {
    let replaying = false;
    let events = [];
    let subscribers = {};
    let dispatchEvent = (ev) => {
        if (!replaying) { 
            events.push(ev);
        }

        for (const sub of subscribers[ev.name]) {
            sub(ev);
        } 
    }

    let subscribe = (eventName, f) => {
        if(subscribers[eventName]) {
            subscribers[eventName].push(f);
        } else {
            subscribers[eventName] = [f];
        }
    }

    let replay = () => {
        replaying = true;
        let i = 1 
        for (const ev of events) {
            setTimeout(() => dispatchEvent(ev), 1000 * i);
            i++;
        }
        setTimeout(() => replaying = false, 1000 * events.length)
    }

    return {
        dispatch: dispatchEvent,
        subscribe: subscribe,
        replay: replay
    }
}();

let gameEngine = function() {
    let handleTurnTaken = (turnTakenEvent) => {
        if(turnTakenEvent.gameboard[turnTakenEvent.row][turnTakenEvent.col] !== 'X' && turnTakenEvent.gameboard[turnTakenEvent.row][turnTakenEvent.col] !== 'O') {

            console.log('Player ' + turnTakenEvent.player + ' has taken a turn');
            let nextPlayer = turnTakenEvent.player === 'O' ? 'X' : 'O';
            let nextGameBoard = turnTakenEvent.gameboard.map(
                (row, rIndex) => {
                    return row.map((col, cIndex) => {
                        return rIndex === turnTakenEvent.row && cIndex === turnTakenEvent.col ?
                            turnTakenEvent.player : col 
                    });
                }
            ) 

            if (winChecker.thereIsAWinner(nextGameBoard)) {
                eventDispatcher.dispatch({
                    name: 'winner-determined-event',
                    winner: turnTakenEvent.player,
                    gameboard: nextGameBoard
                });
            }
            else if (winChecker.gameBoardIsFull(nextGameBoard)){
                eventDispatcher.dispatch({
                    name: 'completed-with-no-winner-event',
                    gameboard: nextGameBoard
                });
            } else {
                eventDispatcher.dispatch({
                    name: 'game-board-updated-event',
                    nextPlayer: nextPlayer,
                    gameboard: nextGameBoard 
                });
            }
        }
    }

    return {
        handleEvent: (ev) => {
            switch (ev.name) {
                case 'turn-taken-event':
                    handleTurnTaken(ev);
                    break;
            
                default:
                    break;
            }
        } 
    }
}();

let view = function() {
    let viewModel = {
        currentPlayer: 'X',
        winner: null
    };

    let gameBoard = new Array(3).fill(new Array(3).fill(''));

    eventDispatcher.subscribe('game-board-updated-event', gameBoardUpdatedEvent => {
        viewModel.currentPlayer = gameBoardUpdatedEvent.nextPlayer;
        gameBoard = gameBoardUpdatedEvent.gameboard;
        drawBoard(gameBoard);
    });

    eventDispatcher.subscribe('winner-determined-event', ({gameboard, winner}) => {
        viewModel.winner = winner;
        gameBoard = gameboard;
        drawBoard(gameBoard);
    });

    eventDispatcher.subscribe('completed-with-no-winner-event', completedWithNoWinnerEvent => {
        viewModel.winner = 'NO_WINNER';
        gameBoard = completedWithNoWinnerEvent.gameboard;
        drawBoard(gameBoard);
    });

    document.getElementById('replay-button').addEventListener('click', () => {
        viewModel = {
            currentPlayer: 'X',
            winner: null
        };

        let gameboard = new Array(3).fill(new Array(3).fill(''));
        drawBoard(gameboard);
        eventDispatcher.replay();
    });

    const drawBoard = (gameBoard) => {
        let heading = '';
        if (viewModel.winner === 'NO_WINNER') {
            heading = 'Game completed with no winner';
        } else if (viewModel.winner) {
            heading = viewModel.winner + ' has won!!'  
        } else {
            heading = 'Current Player is: ' + viewModel.currentPlayer;
        }
        let headingView = document.getElementById('heading');
        headingView.textContent = heading;

        let gameBoardView = document.getElementById('gameBoard');
        gameBoardView.innerHTML = '';
        gameBoardView.style.width = (gameBoard[0].length * 100 * 2 * 2 * (gameBoard[0].length * 100/gameBoard[0].length)) + 'px';
        gameBoardView.style.height = (gameBoard.length * 100 * 2 * 2 * (gameBoard.length * 100/gameBoard.length)) + 'px';
        gameBoard.forEach((row, rIndex) => renderRow(row, rIndex, gameBoardView));
    }
    
    const renderRow = (row, rIndex, gameBoardView) => {
        let rowView = document.createElement('div');
        rowView.style.width = (row.length * 100 * 2 * 2 * (gameBoard[0].length * 100/gameBoard[0].length)) + 'px';
        rowView.style.height = '100px';
        rowView.style.float = 'left';
        gameBoardView.appendChild(rowView);
        row.forEach((cell, cIndex) => renderCell(cell, cIndex, rIndex, rowView, row));
    }

    const renderCell = (cell, cIndex, rIndex, rowView, row) => {
        let cellView = document.createElement('div');
        cellView.style.width = ((row.length * 100)/row.length) + 'px';
        cellView.style.height = '100px';
        cellView.style.border = '2px solid black';
        cellView.style.float = 'left';
        cellView.textContent = cell;
        cellView.style['align-items'] ='center';
        cellView.style['justify-content'] = 'center';
        cellView.style['font-size'] = '60pt';
        cellView.style.display = 'grid';
        if (!viewModel.winner) {
            cellView.addEventListener('click', 
                    () => gameEngine.handleEvent(
                        {
                            name: 'turn-taken-event',
                            player: viewModel.currentPlayer,
                            row: rIndex,
                            col: cIndex, 
                            gameboard: gameBoard
                        }));
        }
        rowView.appendChild(cellView);

    }

drawBoard(gameBoard);

return {
    render: function(gameboard) { return drawBoard(gameboard) }
}
}(); 