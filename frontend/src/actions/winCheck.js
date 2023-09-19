const checkForWin = (cells, player) => {
  const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (const condition of winConditions) {
    const [a, b, c] = condition;
    if (cells[a] === player && cells[b] === player && cells[c] === player) {
      return true;
    }
  }
  return false;
};

export default checkForWin