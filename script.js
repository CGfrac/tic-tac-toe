const gameBoard = (() => {
    let _board = Array(9).fill('');

    const getBoard = () => {
        return _board;
    };

    const getCell = index => {
        return _board[index]
    };

    const setCell = (index, token) => {
        _board[index] = token;
    };

    const clearBoard = () => _board = Array(9).fill('');

    return {
        getBoard,
        getCell,
        setCell,
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

    const updateCell = (index, token) => {
        const cell = document.querySelector(`[data-index="${index}"]`);
        const cellContent = cell.children[0];

        cellContent.textContent = token;
    };

    return {
        drawboard,
        updateCell
    };
})();

const player = token => {
    const _token = token;

    const getToken = () => { return _token };

    return {
        getToken
    };
};

const game = (() => {
    const _players = [];
    let _currentPlayer = 0;

    const _getCurrentPlayer = () => {
        return _players[_currentPlayer];
    };

    const _changeCurrentPlayer = () => {
        _currentPlayer = (_currentPlayer + 1) % 2;
    };

    const _handleClick = (event) => {
        const boardIndex = parseInt(event.target.getAttribute('data-index'));
        const cell = gameBoard.getCell(boardIndex);

        if (cell === '') {
            const player = _getCurrentPlayer();
            const token = player.getToken();

            gameBoard.setCell(boardIndex, token);
            displayController.updateCell(boardIndex, token);

            _changeCurrentPlayer();
        }
    };

    const _setEventListeners = () => {
        const cells = document.querySelectorAll('.cell');

        cells.forEach(cell => cell.addEventListener('click', _handleClick));
    };

    const newGame = () => {
        displayController.drawboard();

        const player1 = player('X');
        const player2 = player('0');
        _players.push(player1, player2);

        _setEventListeners();
    };

    return {
        newGame
    };
})();

game.newGame();
