import React, { Fragment, Component } from "react";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import cx from "classnames";

const GlobalStyles = createGlobalStyle`
  @import url("https://fonts.googleapis.com/css?family=Permanent+Marker&display=swap");
  body{
    font-family: Permanent Marker;
  }
`;

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e1e1e1;
`;

const Tilesheet = styled.div`
  background: white;
`;

const Row = styled.div`
  display: flex;
  border-top: 1px solid #999;
  &:last-child {
    border-bottom: 1px solid #999;
  }
`;

const pulse = keyframes`
  0% { background-color: white}

  50% {
    background-color: lightblue;
  }

  100%{ background-color: white;}
`;

const Square = styled.div`
  width: 64px;
  height: 64px;
  border-right: 1px solid #999;
  &:first-child {
    border-left: 1px solid #999;
  }

  &.waiting {
    cursor: pointer;
  }

  &.available {
    animation: ${pulse} 0.8s linear infinite;
    cursor: pointer;
  }

  span {
    font-size: 32px;
    line-height: 64px;
    text-align: center;
    display: block;
    color: ${props => (props.active ? "#cc0000" : "#000000")};
  }
`;

const GameOver = ({ resetFn }) => {
  return (
    <Wrapper>
      <Tilesheet>
        <h1>Game Over</h1>
        <button onClick={resetFn}>Começar denovo</button>
      </Tilesheet>
    </Wrapper>
  );
};

const Cell = ({
  started,
  children,
  x,
  y,
  onClick,
  curr,
  chackAvailability
}) => {
  const isActive = chackAvailability(x, y);
  const squareClasses = cx({
    available: started && isActive && !children,
    waiting: !started
  });
  return (
    <Square
      className={squareClasses}
      active={parseInt(children) === curr}
      onClick={() => {
        if (!started || (isActive && !children)) {
          onClick(x, y);
        }
      }}
    >
      <span>{children}</span>
    </Square>
  );
};

class App extends Component {
  constructor(props) {
    super(props);
    const table = this.buildArray(10, 10);
    this.initialState = {
      started: false,
      gameOver: false,
      curr: 0,
      table
    };
    this.state = this.initialState;
  }

  componentDidUpdate() {
    const { started, gameOver } = this.state;
    if (gameOver) return;
    const available = document.querySelectorAll(".available");
    if (started && !available.length) {
      this.setState({ gameOver: true });
    }
  }

  buildArray(w, h) {
    const base = [];
    for (let i = 0, max = w; i < max; i += 1) {
      const a = new Array(h).fill(null);
      base.push(a);
    }
    return base;
  }

  handlechackAvailability = (x, y) => {
    const { lastX, lastY } = this.state;

    // check for cardinal position
    if (
      ((x - 3 === lastX || x + 3 === lastX) && y === lastY) ||
      ((y - 3 === lastY || y + 3 === lastY) && x === lastX)
    ) {
      return true;
    }

    // check for intercardinal position
    if (
      (x - 2 === lastX || x + 2 === lastX) &&
      (y - 2 === lastY || y + 2 === lastY)
    ) {
      return true;
    }

    return false;
  };

  handleClick = (x, y) => {
    const { table, curr, started } = this.state;
    const newCurr = curr + 1;
    table[x][y] = newCurr;
    const newState = { table, curr: newCurr, lastX: x, lastY: y };
    if (!started) {
      newState.started = true;
    }
    this.setState(newState);
  };

  reset = () => {
    const table = this.buildArray(10, 10);
    const newState = { ...this.initialState, table };
    this.setState(newState);
  };

  render() {
    const { gameOver, table, curr, started } = this.state;
    if (gameOver) {
      return <GameOver resetFn={this.reset} />;
    }

    return (
      <Fragment>
        <GlobalStyles />
        <Wrapper>
          <Tilesheet>
            {table.map((row, x) => {
              return (
                <Row key={`row-${x}`}>
                  {row.map((cell, y) => {
                    return (
                      <Cell
                        started={started}
                        onClick={this.handleClick}
                        chackAvailability={this.handlechackAvailability}
                        key={`cell-${y}`}
                        x={x}
                        y={y}
                        curr={curr}
                      >
                        {cell}
                      </Cell>
                    );
                  })}
                </Row>
              );
            })}
          </Tilesheet>
        </Wrapper>
      </Fragment>
    );
  }
}

export default App;
