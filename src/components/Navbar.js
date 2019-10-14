import React from "react";
import { NavLink } from 'react-router-dom';

import "react-interactions/dist/main.css";
import styled from "styled-components";
import { eraseCookie } from "./Cookie";
import { makeStyles } from '@material-ui/core/styles';
import XLogin from "./XLogin.js";
import { ProductContext } from "../context";

import '../styles/Navbar.css';
import Avatar from "@material-ui/core/Avatar";


const useStyles = makeStyles({
  currencies: {
    marginLeft: 10,
    marginRight: 4,
    height: 18,
    width: 18,
  }
});

export default function Navbar({
  showCart = () => {
    void 0;
  }
}) {
  const valueFromContext = React.useContext(ProductContext);
  const classes = useStyles();

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

  return (
    <NavWrapper
      style={{
        zIndex: 100,
        color: valueFromContext.getTheme("colorAccentText"),
        backgroundColor: '#011627'
      }}
    >
      <div className="navbar-links">
        <NavLink activeClassName="navbar-link_active" exact to="/">
          <span className="navbar-link">Items</span>
        </NavLink>
        <NavLink activeClassName="navbar-link_active" to="/crystals">
          <span className="navbar-link">Currencies</span>
        </NavLink>
        {
          valueFromContext.projectId === 44056 &&
          <NavLink activeClassName="navbar-link_active" to="/physical">
            <span className="navbar-link">Merchandise</span>
          </NavLink>
        }
        <NavLink activeClassName="navbar-link_active" to="/inventory">
          <span className="navbar-link">Inventory</span>
        </NavLink>
      </div>

      <NavUl>
        <li style={{ display: "flex", justifyContent: "center" }}>
          <CssLoginPanel>
            {!valueFromContext.logToken && (
              <CssLoginButton onClick={logInButtonHandler}>
                Log In
              </CssLoginButton>
            )}
            {valueFromContext.logToken && valueFromContext.user && (
              <CssLogin>
                {
                  valueFromContext.userBalanceVirtualCurrency && valueFromContext.userBalanceVirtualCurrency.map((vc) => {
                    return (
                          <>
                            <Avatar src={vc.image_url} className={classes.currencies}/>
                            {
                              vc.amount
                            }
                          </>
                    );
                  })
                }
                <CssLoginEmail>{valueFromContext.user.email}</CssLoginEmail>
              </CssLogin>
            )}
          </CssLoginPanel>

          <XLogin />
        </li>
      </NavUl>

      {
        valueFromContext.logToken && valueFromContext.user && 44056 !== valueFromContext.projectId &&
        <div className="navbar-logout" onClick={logOutHandler}>
          <span className="mr-10">
            <i className="fas fa-sign-out-alt"></i>
          </span>
        </div>
      }
      <div className="navbar-cart" onClick={e => showCart(e)}>
        <span className="mr-10">
          <i className="fas fa-cart-plus"></i> cart
        </span>
      </div>
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
`;

const CssLoginEmail = styled.div`
  font-family: "Roboto";
  color: #ff005b;
  margin: 0 1rem;
`;

const NavWrapper = styled.div`
  font-family: "Helvetica Neue", "Roboto", Arial, Helvetica, sans-serif;
  color: var(--mainWhite);
  position: relative;
  display: flex;
  align-items: center;
  z-index: 10;
`;

const CssLogin = styled.div`
  display: flex;
  flex-direction: row;
  font-family: "Helvetica Neue", "Roboto", Arial, Helvetica, sans-serif;
`;

const NavUl = styled.ul`
  display: flex;
  flex-grow: 1;
  flex-direction: row;
  align-items: stretch;
  justify-content: flex-end;
  color: var(--mainWhite);
  list-style-type: none;
  position: relative;
  z-index: 10;
  margin-bottom: 0;
`;
