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

    const newBoard = () => _board = Array(9).fill('');

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
        newBoard,
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
        const tileContent = tile.firstElementChild;

        tileContent.textContent = token;
    };

    const clearTiles = () => {
        for (let i = 0; i < gameBoard.getBoard().length; i++) {
            updateTile(i, '');
        }
    };

    const showSelectPlayers = () => {
        const selectMenu = document.querySelector('#select-players');
        selectMenu.style.display = 'block';
    };

    const _hideSelectPlayers = () => {
        const selectMenu = document.querySelector('#select-players');
        selectMenu.style.display = 'none';
    };

    const modifyForm = (event) => {
        _hideSelectPlayers();

        const onePlayer = event.target.textContent === 'One';

        const legend = document.querySelector('legend');
        const playerTwoInput = document.querySelector('#player2');

        if (onePlayer) {
            legend.textContent = 'Enter your name, champion!';
            playerTwoInput.removeAttribute('required');
            playerTwoInput.parentElement.style.display = 'none';
        } else {
            legend.textContent = 'Enter your names, champions!'
            playerTwoInput.setAttribute('required', '');
            playerTwoInput.parentElement.style.display = 'flex';
        }
    };

    const showForm = () => {
        const registerForm = document.querySelector('#register');
        registerForm.style.display = 'block';
    };

    const hideForm = () => {
        const registerForm = document.querySelector('#register');
        registerForm.style.display = 'none';
    };

    const gameOverMessage = (message) => {
        const para = document.querySelector('#game-over-message');
        para.textContent = message;

        _showGameOver();
    };

    const _showGameOver = () => {
        gameOver.style.display = 'block';
        start.style.zIndex = 1;
    };

    const hideGameOver = () => {
        gameOver.style.display = 'none';
        start.style.zIndex = 0;
    };

    return {
        drawboard,
        updateTile,
        clearTiles,
        showSelectPlayers,
        modifyForm,
        showForm,
        hideForm,
        gameOverMessage,
        hideGameOver
    };
})();

const player = (name, token) => {
    const _name = name;
    const _token = token;

    const getName = () => { return _name };
    const getToken = () => { return _token };

    return {
        getName,
        getToken
    };
};

const game = (() => {
    const _players = [];
    let _currentPlayer;
    let _turn;
    let _gameOver;

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
                displayController.gameOverMessage(`${player.getName()} has won the game!`);
                _gameOver = true;
            } else if (_turn == 9) {
                displayController.gameOverMessage("It's a tie!");
                _gameOver = true;
            }

            _changeCurrentPlayer();
        }
    };

    const _setEventListeners = () => {
        const tiles = document.querySelectorAll('.tile');

        tiles.forEach(tile => tile.addEventListener('click', _playTurn));
    };

    const _registerPlayers = () => {
        const formData = new FormData(form);

        const player1 = player(formData.get('player1'), 'X');
        const player2 = player(formData.get('player2'), 'O');

        _players.push(player1, player2);
    };

    const _clearPlayers = () => {
        while (_players.length) {
            _players.pop();
        }
    };

    const newGame = (event) => {
        event.preventDefault();
        displayController.hideForm();

        gameBoard.newBoard();
        displayController.clearTiles();

        _clearPlayers();
        _currentPlayer = 0;
        _turn = 0;
        _gameOver = false;

        _registerPlayers();
        _setEventListeners();
    };

    return {
        newGame
    };
})();

displayController.drawboard();

function setup() {
    displayController.hideGameOver();
    displayController.showSelectPlayers();
    start.textContent = 'Restart';
}

function setPlayers(e) {
    displayController.modifyForm(e);
    displayController.showForm();
}

const start = document.querySelector('#start');
start.addEventListener('click', setup);

const playerSelectButtons = document.querySelectorAll('.players-number');
playerSelectButtons.forEach(button => button.addEventListener('click', setPlayers));

const form = document.querySelector('form');
form.addEventListener('submit', game.newGame);

const gameOver = document.querySelector('#game-over');
