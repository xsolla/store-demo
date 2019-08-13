import React from "react";
import styled from "styled-components";
const propTypes = {};

const defaultProps = {};

export default class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      virtualItems: this.props.virtualItems,
      activeGroup:
        this.props.activeGroup === "first"
          ? this.props.virtualItems[0]["id"]
          : this.props.activeGroup
    };
  }

  menuHandler = (e, data) => {
    this.setState({
      activeGroup: data["id"]
    });
    this.props.changeGroupHandler(data["id"]);
    this.props.setStateFrom("activeGroup", data["id"]);
  };

  render() {
    return (
      <React.Fragment>
        <CssMenuUl>
          {this.state.virtualItems &&
            this.state.virtualItems.map((oneGroup, key) => {
              return (
                <CssMenuLi
                  className={
                    this.state.activeGroup &&
                    this.state.activeGroup === oneGroup["id"]
                      ? "active"
                      : ""
                  }
                  key={oneGroup["id"]}
                  onClick={e => this.menuHandler(e, oneGroup)}
                >
                  {oneGroup["name"]}
                </CssMenuLi>
              );
            })}
        </CssMenuUl>
      </React.Fragment>
    );
  }
}

Menu.propTypes = propTypes;
Menu.defaultProps = defaultProps;

const CssMenuUl = styled.ul`
  margin: 2em 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
`;
const CssMenuLi = styled.li`
  display: flex;
  padding: 0.6em 1em;
  transition: opacity 200ms;
  cursor: pointer;
  &.active {
    color: var(--mainWhite);
    background: var(--mainBlue);
  }
  &:hover {
    background: rgba(255, 0, 0, 0.2);
  }
`;
