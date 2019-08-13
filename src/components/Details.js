import React, { Component } from "react";
import styled from "styled-components";

export default class Details extends Component {
  render() {
    return (
      <CssDetails0>
        <h3>Hello from Details</h3>
      </CssDetails0>
    );
  }
}

const CssDetails0 = styled.div`
  position: absolute;
  z-index: 1000;
`;
