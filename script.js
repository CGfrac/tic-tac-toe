const gameBoard = (() => {
    let _board = Array(9).fill('');

    const getBoard = () => { return _board };
    const clearBoard = () => _board = Array(9).fill('');

    return {
        getBoard,
        clearBoard
    };
})();

const displayController = (() => {
    const drawboard = () => {
        const boardArray = gameBoard.getBoard();
        const boardContainer = document.querySelector('#board');

        for (let i = 0; i < boardArray.length; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-index', i);

            const cellContent = document.createElement('span');
            cellContent.textContent = boardArray[i];

            cell.appendChild(cellContent);
            boardContainer.appendChild(cell);
        }
    }

    return {
        drawboard
    };
})();

const player = token => {
    const _token = token;
    let _score = 0;

    const getToken = () => { return _token };
    const getScore = () => { return _score };
};

const game = (() => {
    const _players = [];

    const newGame = () => {
        displayController.drawboard();

        const player1 = player('X');
        const player2 = player('0');
        _players.push(player1, player2);
    };

    return {
        newGame
    };
})();

game.newGame();
