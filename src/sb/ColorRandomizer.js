import React, { Component } from "react";

import Colorer from "color";
import styled from "styled-components";
import { ProductContext } from "../context";

import { colorRotater } from "./ColorThemer";

export default function ColorRandomizer() {
  const oldTheme = React.useContext(ProductContext).getTheme();
  const changeTheme = React.useContext(ProductContext).changeTheme;

  const [stateTheme, setStateTheme] = React.useState({
    ...React.useContext(ProductContext).getTheme()
  });

  const [state, setState] = React.useState({
    rotating: false, //needed for animation of the trigger
    scaling: 1
  });

  const timeout = null;

  const setColorRotate = (newAngle, e, saveOrNot) => {
    changeTheme(colorRotater(oldTheme));

    if (timeout) clearTimeout(timeout);
    if (state.scaling !== 0.5) {
      setState({
        ...state,
        rotating: Number(state.rotating) + 180,
        scaling: 0.5
      });
      const timeout = setTimeout(() => {
        // setGlobalColors('rotate', newAngle, saveOrNot);
        setState({
          ...state,
          colorAngle: newAngle,
          rotating: state.rotating + 180,
          scaling: 1
        });
      }, 100);
    }
  };

  return (
    <div className="x22_li">
      <CssColoredShadow color={state.color} className="x_sectionhover">
        <div className="xth_random0">
          <div className="x_randomize_0">
            <div
              className="x_randomize"
              // className={
              //   state.rotating ? "x_randomize x_randomize--rotated" : "x_randomize"
              // }
              style={{
                transform: `rotateZ(${state.rotating}deg)
                  scale(${state.scaling})
                  `
                // opacity: state.scaling
              }}
              onMouseMove={e => {
                let mouse = e.nativeEvent.clientX;
                setStateTheme({
                  ...state,
                  // rotating:  e.nativeEvent.clientX
                  rotating: state.rotating + 20,
                  color: Colorer("red")
                    .rgb()
                    .rotate(state.rotating + 20)
                    .negate()
                    .hex()
                });
              }}
              onMouseDown={e => setColorRotate(29)}
            >
              <div
                className="xicon_white"
                style={{
                  color: stateTheme.colorAccentText,
                  backgroundColor: stateTheme.colorAccent
                }}
              >
                refresh
              </div>
            </div>
          </div>
        </div>
      </CssColoredShadow>
      {/* <div className="xth_name">Randomize</div> */}
    </div>
  );
}

const CssColoredShadow = styled.div`
  border-radius: 2px;
  overflow: hidden;
  background-color: ${props =>
    props["color"] ? `${props["color"]}` : `#011627`};
  box-shadow: ${props =>
    props["color"]
      ? `0 5px 17px -6px ${props["color"]}`
      : `0 5px 17px -6px rgba(0, 0, 0, .51)`};

  &:hover {
    box-shadow: ${props =>
      props["color"]
        ? `0 8px 20px -6px ${props["color"]};`
        : `0 8px 20px -6px #000;`};
  }
`;
