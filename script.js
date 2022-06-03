const gameBoard = (() => {
    const _board = ['X', 'O', 'O', 'X', 'X', 'X', 'O', 'O', 'O'];

    const getBoard = () => { return _board };

    return {
        getBoard
    };
})();

const displayController = (() => {
    const drawboard = () => {
        const boardArray = gameBoard.getBoard();
        const boardContainer = document.querySelector('#board');

        for (const item of boardArray) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            const cellContent = document.createElement('span');
            cellContent.textContent = item;

            cell.appendChild(cellContent);
            boardContainer.appendChild(cell);
        }
    }

    return {
        drawboard
    };
})();

displayController.drawboard();
