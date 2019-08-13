import styled from "styled-components";

export const ButtonContainer = styled.div`
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
