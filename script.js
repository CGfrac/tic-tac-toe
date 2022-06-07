const gameBoard = (board = null, availableMoves = null) => {
    const _board = (board) ? board : Array(9).fill('');

    const _populateSet = () => {
        const set = new Set();
        for (let i = 0; i < _board.length; i++) {
            if (_board[i] === '') {
                set.add(i);
            }
        }
        return set;
    };

    const _availableMoves = (availableMoves) ? availableMoves : _populateSet();

    const getBoard = () => {
        return _board;
    };

    const getAvailableMoves = () => {
        return _availableMoves;
    };

    const _updateAvailableMoves = index => {
        _availableMoves.delete(index);
    };

    const getTile = index => {
        return _board[index];
    };

    const setTile = (index, token) => {
        _board[index] = token;
        _updateAvailableMoves(index);
    };

    const newBoard = () => _board.fill('');

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
        getAvailableMoves,
        getTile,
        setTile,
        newBoard,
        win
    };
};

const displayController = (() => {
    const drawboard = () => {
        const boardArray = board.getBoard();
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
        for (let i = 0; i < board.getBoard().length; i++) {
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
            playerTwoInput.value = '';
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

const computerPlayer = () => {
    const _name = 'CPU';
    const _token = 'O';
    let _currentTurn = 0;
    let _moveChoice;

    const {getName, getToken} = player(_name, _token);

    const _createBoardState = (boardObject) => {
        return gameBoard([...boardObject.getBoard(), new Set(boardObject.getAvailableMoves())]);
    };

    const _getScore = (boardState) => {
        if (boardState.win(_token)) {
            return 1;
        }
        if (boardState.win('X')) {
            return -1;
        }
        return 0;
    };

    // See https://en.wikipedia.org/wiki/Minimax
    const _minimax = (token, turn, boardState) => {
        if (turn > 4 && (boardState.win(token) || turn === 9)) {
            return _getScore(boardState);
        }

        const scores = [];
        const moves = [];

        for (const move of boardState.getAvailableMoves()) {
            const newBoardState = _createBoardState(boardState);
            newBoardState.setTile(move, token);
            const newToken = (token === _token) ? 'X' : _token;
            scores.push(_minimax(newToken, turn + 1, newBoardState));
            moves.push(move);
        }

        if (token === _token) {
            let maxScore = -Infinity;
            let maxScoreIndex;
            for (let i = 0; i < scores.length; i++) {
                if (maxScore < scores[i]) {
                    maxScore = scores[i];
                    maxScoreIndex = i;
                }
            }
            _moveChoice = moves[maxScoreIndex];
            return scores[maxScoreIndex];
        } else {
            let minScore = Infinity;
            let minScoreIndex;
            for (let i = 0; i < scores.length; i++) {
                if (minScore > scores[i]) {
                    minScore = scores[i];
                    minScoreIndex = i;
                }
            }
            _moveChoice = moves[minScoreIndex];
            return scores[minScoreIndex];
        }
    };

    const pickMove = () => {
        _currentTurn++; // player turn accounted
        const boardState = _createBoardState(board);
        _minimax(_token, _currentTurn, boardState);
        _currentTurn++;
        return _moveChoice;
    };

    return {
        getName,
        getToken,
        pickMove
    };
};

const game = (() => {
    const _players = [];
    let _currentPlayer;
    let _turn;
    let _gameOver;
    let _cpu;
    let _computerPlaying = false;

    const _getCurrentPlayer = () => {
        return _players[_currentPlayer];
    };

    const _changeCurrentPlayer = () => {
        _currentPlayer = (_currentPlayer + 1) % 2;
    };

    const _executeMove = (index) => {
        const token = _getCurrentPlayer().getToken();
        board.setTile(index, token);
        displayController.updateTile(index, token);
    }

    const _checkGameOver = () => {
        const player = _getCurrentPlayer();
        const token = player.getToken();

        if (_turn > 4 && board.win(token)) {
            displayController.gameOverMessage(`${player.getName()} has won the game!`);
            _gameOver = true;
        } else if (_turn == 9) {
            displayController.gameOverMessage("It's a tie!");
            _gameOver = true;
        }
    }

    const _playComputerTurn = () => {
        _turn++;

        const computer = _getCurrentPlayer();

        _executeMove(computer.pickMove());
        _checkGameOver();
        _changeCurrentPlayer();
    };

    const _playTurn = (event) => {
        if (_gameOver) {
            return;
        }

        _turn++;

        const boardIndex = parseInt(event.target.getAttribute('data-index'));
        const tile = board.getTile(boardIndex);

        if (tile === '' && !_computerPlaying) {
            _executeMove(boardIndex);
            _checkGameOver();
            _changeCurrentPlayer();

            if (_cpu && !_gameOver) {
                _computerPlaying = true;
                _playComputerTurn();
                _computerPlaying = false;
            }
        }
    };

    const _setEventListeners = () => {
        const tiles = document.querySelectorAll('.tile');

        tiles.forEach(tile => tile.addEventListener('click', _playTurn));
    };

    const setPlayers = event => {
        displayController.modifyForm(event);
        displayController.showForm();
    };

    const _getFormData = () => {
        return new FormData(form);
    }

    const _registerPlayer = (playerName, token) => {
        const newPlayer = player(playerName, token);
        _players.push(newPlayer);
    };

    const _registerCPU = () => {
        const playerCPU = computerPlayer();
        _players.push(playerCPU);
    };

    const _clearPlayers = () => {
        while (_players.length) {
            _players.pop();
        }
    };

    const newGame = (event) => {
        event.preventDefault();
        displayController.hideForm();
        const formData = _getFormData();

        _clearPlayers();

        const playerName = formData.get('player1');
        _registerPlayer(playerName, 'X');

        if (formData.get('player2') !== '') {
            _cpu = false;
            const playerTwoName = formData.get('player2');
            _registerPlayer(playerTwoName, 'O');
        } else {
            _cpu = true;
            _registerCPU();
        }

        _currentPlayer = 0;
        _turn = 0;
        _gameOver = false;

        board.newBoard();
        displayController.clearTiles();
        _setEventListeners();
    };

    return {
        setPlayers,
        newGame
    };
})();

const board = gameBoard();
displayController.drawboard();

function setup() {
    displayController.hideGameOver();
    displayController.showSelectPlayers();
    start.textContent = 'Restart';
}

const start = document.querySelector('#start');
start.addEventListener('click', setup);

const playerSelectButtons = document.querySelectorAll('.players-number');
playerSelectButtons.forEach(button => button.addEventListener('click', game.setPlayers));

const form = document.querySelector('form');
form.addEventListener('submit', game.newGame);

const gameOver = document.querySelector('#game-over');
