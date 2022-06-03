const gameBoard = (() => {
    let _board = Array(9).fill('');

    const getBoard = () => {
        return _board;
    };

    const getTile = index => {
        return _board[index]
    };

    const setTile = (index, token) => {
        _board[index] = token;
    };

    const clearBoard = () => _board = Array(9).fill('');

    return {
        getBoard,
        getTile,
        setTile,
        clearBoard
    };
})();

const displayController = (() => {
    const drawboard = () => {
        const boardArray = gameBoard.getBoard();
        const boardContainer = document.querySelector('#board');

        for (let i = 0; i < boardArray.length; i++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.setAttribute('data-index', i);

            const tileContent = document.createElement('span');
            tileContent.textContent = boardArray[i];

            tile.appendChild(tileContent);
            boardContainer.appendChild(tile);
        }
    }

    const updateTile = (index, token) => {
        const tile = document.querySelector(`[data-index="${index}"]`);
        const tileContent = tile.children[0];

        tileContent.textContent = token;
    };

    return {
        drawboard,
        updateTile
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

    const _playTurn = (event) => {
        const boardIndex = parseInt(event.target.getAttribute('data-index'));
        const tile = gameBoard.getTile(boardIndex);

        if (tile === '') {
            const player = _getCurrentPlayer();
            const token = player.getToken();

            gameBoard.setTile(boardIndex, token);
            displayController.updateTile(boardIndex, token);

            _changeCurrentPlayer();
        }
    };

    const _setEventListeners = () => {
        const tiles = document.querySelectorAll('.tile');

        tiles.forEach(tile => tile.addEventListener('click', _playTurn));
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
