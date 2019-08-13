import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledLink = styled(Link)`
  padding: 1em;
  position: relative;
  text-transform: uppercase;
  font-family: "Space Mono";
  font-size: 1em;
  background: transparent;
  color: var(--mainWhite);
  cursor: pointer;
  transition: all 0.5s ease-in-out;
  text-decoration: none;
  &:hover {
    // background: var(--lightBlue);
    text-decoration: none;
  }
`;

export default props => <StyledLink {...props} />;
