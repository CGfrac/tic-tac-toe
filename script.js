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

    const _threeInARow = (token, start, end, step) => {
        for (let i = start; i <= end; i += step) {
            if (getTile(i) !== token) {
                return false;
            }
        }
        return true;
    };

    const _winningRow = token => {
        for (let i = 0; i <= 6; i += 3) {
            if (_threeInARow(token, i, i+2, 1)) {
                return true;
            }
        }
        return false;
    };

    const _winningColumn = token => {
        for (let i = 0; i <= 2; i++) {
            if (_threeInARow(token, i, i+6, 3)) {
                return true;
            }
        }
        return false;
    };

    const _winningDiagonal = token => {
        return _threeInARow(token, 0, 8, 4) || _threeInARow(token, 2, 6, 2);
    };

    const win = token => {
        return _winningRow(token) || _winningColumn(token) || _winningDiagonal(token);
    };

    return {
        getBoard,
        getTile,
        setTile,
        clearBoard,
        win
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
    let _turn = 0;
    let _gameOver = false;

    const _getCurrentPlayer = () => {
        return _players[_currentPlayer];
    };

    const _changeCurrentPlayer = () => {
        _currentPlayer = (_currentPlayer + 1) % 2;
    };

    const _playTurn = (event) => {
        if (_gameOver) {
            return;
        }

        _turn++;

        const boardIndex = parseInt(event.target.getAttribute('data-index'));
        const tile = gameBoard.getTile(boardIndex);

        if (tile === '') {
            const player = _getCurrentPlayer();
            const token = player.getToken();

            gameBoard.setTile(boardIndex, token);
            displayController.updateTile(boardIndex, token);

            if (_turn > 4 && gameBoard.win(token)) {
                console.log('win');
                _gameOver = true;
            } else if (_turn == 9) {
                console.log('tie');
                _gameOver = true;
            }

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
