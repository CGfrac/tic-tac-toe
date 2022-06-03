const gameBoard = (() => {
    const _board = Array(9).fill('');

    const getBoard = () => { return _board };

    return {
        getBoard
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

displayController.drawboard();
