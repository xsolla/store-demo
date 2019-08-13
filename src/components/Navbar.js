import React from "react";
import { ButtonContainer } from "./Button";
import "react-interactions/dist/main.css";
import styled from "styled-components";
import { eraseCookie } from "./Cookie";
import XLogin from "./XLogin.js";
import { ProductContext } from "../context";

export default function Navbar() {
  const [state, setState] = React.useState({
    shown: false
  });

  const logOutHandler = () => {
    eraseCookie("xsolla_login_token", null);
    eraseCookie("xsolla_last_click_id", null);
    window.location.reload();
  };

  const logInButtonHandler = () => {
    setState({ shown: true });
  };

  const showCart = () => {
    React.useContext(ProductContext).setStateFrom("cartShown", true);
  };

  return (
    <NavWrapper
      style={{
        zIndex: 100,
        color: React.useContext(ProductContext).getTheme("colorAccentText"),
        backgroundColor: React.useContext(ProductContext).getTheme(
          "colorAccent"
        )
      }}
      // className="navbar navbar-expand-sm  px-sm-5"
    >
      {/* https://www.iconfinder.com/icons/1243689/call_phone_icon Creative Commons (Attribution 3.0 Unported); https://www.iconfinder.com/Makoto_msk */}
      {/* <Link to='/' className="navbar-nav align-items-center">
                  <img src={logo} alt="store" className="navbar-brand" />
                  <Tap scale fade waves light/>
                </Link> */}
      {/* <Link style={{display:'flex', justifyContent:'center'}} to='/' className='link'> */}
      {/* <CssName>Xsolla Store</CssName> */}
      {/* </Link> */}

      {/* <Link style={{ justifyContent:'center'}} to="/cart"> */}

      {/* </Link> */}
      <NavUl>
        <li style={{ display: "flex", justifyContent: "center" }}>
          <CssLoginPanel>
            {!React.useContext(ProductContext).logToken && (
              <CssLoginButton onClick={logInButtonHandler}>
                Log In
              </CssLoginButton>
            )}
            {React.useContext(ProductContext).logToken &&
              React.useContext(ProductContext).user && (
                <CssLogin>
                  <CssLoginEmail>
                    {React.useContext(ProductContext).user.email}
                  </CssLoginEmail>
                  <CssLoginButton
                    onClick={logOutHandler}
                    style={{
                      color: React.useContext(ProductContext).getTheme(
                        "colorAccent"
                      ),
                      backgroundColor: React.useContext(
                        ProductContext
                      ).getTheme("colorAccentText")
                    }}
                  >
                    Log Out
                  </CssLoginButton>
                </CssLogin>
              )}
          </CssLoginPanel>

          <XLogin />
        </li>
      </NavUl>

      <ButtonContainer onClick={e => showCart(e)}>
        <span className="mr-10">
          <i className="fas fa-cart-plus"></i> cart
        </span>
      </ButtonContainer>
    </NavWrapper>
  );
}

const CssLoginPanel = styled.div`
  flex-grow: 1;
  text-transform: uppercase;
  font-family: "Roboto";
  color: "var(--mainWhite)";
`;

const CssLoginButton = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 0.8rem;
  line-height: 2em;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  font-family: "Roboto";
  color: black;
  background: var(--mainWhite);
  border-radius: 4px;
  padding: 0 0.6rem;
  cursor: pointer;
  /* border: 1px solid red; */
`;

const CssLoginEmail = styled.div`
  /* font-size:0.8rem; */
  font-family: "Roboto";
  color: "var(--mainWhite)";
  /* background: 'var(--mainDark)'; */
  /* color: 'var(--mainLight)'; */
  margin: 0 1rem;
`;

const NavWrapper = styled.div`
  font-family: "Helvetica Neue", "Roboto", Arial, Helvetica, sans-serif;
  color: var(--mainWhite);
  /* background-color: var(--mainBlue); */
  position: relative;
  display: flex;
  /* flex-grow:1; */
  /* flex-direction: row; */
  align-items: center;
  z-index: 10;
`;

const CssLogin = styled.div`
  /* text-align:center; */
  display: flex;
  flex-direction: row;
  /* padding: 0 1em; */
`;

const NavUl = styled.ul`
  display: flex;
  flex-grow: 1;
  flex-direction: row;
  align-items: stretch;
  justify-content: flex-end;
  color: var(--mainWhite);
  list-style-type: none;
  /* background-color: var(--mainBlue); */
  position: relative;
  z-index: 10;
  margin-bottom: 0;
`;

const CssName = styled.div`
  color: var(--mainWhite);
  opacity: 0.5;
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: center;
  flex-flow: column nowrap;
  text-transform: uppercase;
  flex-grow: 1;
  font-size: 1.4rem;
  line-height: 1.4rem;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
`;
