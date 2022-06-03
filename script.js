const gameBoard = (() => {
    const _board = ['X', 'O', 'O', 'X', 'X', 'X', 'O', 'O', 'O'];

    const getBoard = () => { return _board };

    return {
        getBoard
    };
})();
