import { useState } from 'react';

function Square({ value, onSquareClick, is2light }) {
  return (
    <button className={is2light ? "square highlight" : "square"} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay({ value: nextSquares, pos: i });
  }

  const result = calculateWinner(squares);
  let status;
  let winner_line = null;
  if (result) {
    if (result === "draw") {
      status = "DRAW!!!"
    }
    else {
      status = 'Winner: ' + result.winner;
      winner_line = result.line.slice();
    }
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      {Array.from({ length: 3 }, (_, i) => (
        <div className="board-row" key={i}>
          {Array.from({ length: 3 }, (_, j) => {
            const n = 3 * i + j;
            const isHighlighted = winner_line !== null && winner_line.includes(n);
            return (
              <Square
                key={n}
                value={squares[n]}
                onSquareClick={() => handleClick(n)}
                is2light={isHighlighted}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{ value: Array(9).fill(null), pos: -1 }]);
  const [isReverse, setReverse] = useState(false);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].value;

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move === 0) {
      description = 'Go to game start';
    }
    else {
      if (move === currentMove) {
        description = "You are at move #" + move + `(${parseInt(squares.pos/3)}, ${squares.pos%3})`;
      } else {
        description = 'Go to move #' + move + `(${parseInt(squares.pos/3)}, ${squares.pos%3})`;
      }
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  function handleReverse(iReverse) {
    setReverse(!iReverse);
  }

  function handleResetHistory(){
    setHistory([{ value: Array(9).fill(null), pos: -1 }]);
    setCurrentMove(0);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        {isReverse ? (
          <ol>{moves.reverse()}</ol>
        ) : (
          <ol>{moves}</ol>
        )}
        {isReverse ? (
          <button onClick={() => handleReverse(isReverse)}>Click to sort in ascending order</button>
        ) : (
          <button onClick={() => handleReverse(isReverse)}>Click to sort in descending order</button>
        )}
        <button onClick={()=> handleResetHistory()}>Reset history</button>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: lines[i]
      };
    }
  }
  if (!squares.includes(null)) {
    return "draw";
  }
  return null;
}