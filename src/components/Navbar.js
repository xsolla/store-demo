import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import MUIMenu from '@material-ui/core/Menu';
import Hidden from '@material-ui/core/Hidden';
import MUITabs from '@material-ui/core/Tabs';
import MUITab from '@material-ui/core/Tab';
import IconButton from '@material-ui/core/IconButton';
import Loader from '@material-ui/core/CircularProgress';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import CartIcon from '@material-ui/icons/ShoppingCart';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import LogoutIcon from '@material-ui/icons/ExitToAppOutlined';

import { routes, getMenuItems } from '../utils/routes';
import { device } from '../styles/devices';
import { Currency } from '../components/Currency';
import { ProductContext } from '../context';
import { eraseCookie } from './Cookie';
import XLogin from './XLogin.js';

const Navbar = ({ isSpecificProject }) => {
  const {
    logToken,
    user,
    userBalanceVirtualCurrency,
    projectId,
    showCart,
    setSideMenuVisibility,
    isUserBalanceFetching,
    isSideMenuShown,
  } = React.useContext(ProductContext);
  const { pathname } = useLocation();

  const [menuAnchor, setMenuAnchor] = React.useState(null);
  const handleMenuClose = () => setMenuAnchor(null);
  const handleMenuOpen = event => setMenuAnchor(event.currentTarget);

  const toggleSideMenu = () => setSideMenuVisibility(!isSideMenuShown);

  const logOutHandler = () => {
    eraseCookie("xsolla_login_token", null);
    eraseCookie("xsolla_last_click_id", null);
    window.location.reload();
  };

  const isLogged = logToken && user;

  const generalMenuItems = React.useMemo(() => getMenuItems([
    routes.items,
    routes.currencies,
    ...projectId === 44056 ? [routes.physical] : [],
  ]), [routes, projectId]);

  const isLocationExistsInTabs = React.useMemo(
    () => generalMenuItems.some(x => x.route === pathname),
    [generalMenuItems, pathname]
  );

  const userMenuItems = React.useMemo(() => getMenuItems([
    routes.inventory,
    routes.entitlement,
    routes.manage,
    routes.purchase,
  ]), [routes]);

  return React.useMemo(() => (
    <Header>
      {!isSpecificProject && (
        <>
          <Hidden mdDown>
            <Tabs
              value={isLocationExistsInTabs ? pathname : false}
              textColor="primary"
              indicatorColor="primary"
              component="nav"
            >
              {generalMenuItems.map(x => (
                <Tab
                  key={x.route}
                  component={NavLink}
                  label={x.label}
                  value={x.route}
                  to={x.route}
                />
              ))}
            </Tabs>
          </Hidden>

          <Hidden lgUp>
            <IconButton color="primary" onClick={toggleSideMenu}>
              <MenuIcon />
            </IconButton>
          </Hidden>

          {isLogged && (
            <LoginPanel>
              {isUserBalanceFetching
                ? <Loader size={24} color="primary"/>
                : userBalanceVirtualCurrency.map(vc => (
                  <VCCurrency key={vc.sku}>
                    <Currency image={vc.image_url} value={vc.amount} />
                  </VCCurrency>
                ))
              }

              <Hidden mdDown>
                <UserMail
                  endIcon={Boolean(menuAnchor) ? <ExpandLessIcon /> : <ExpandMoreIcon/>}
                  onClick={handleMenuOpen}
                >
                  {user.email}
                </UserMail>
              </Hidden>
            </LoginPanel>
          )}

          <XLogin />

          {!logToken && (
            <LoginButton
              variant="outlined"
              color="secondary"
              size="small"
            >
              Log In
            </LoginButton>
          )}
          {isLogged && projectId !== 44056 && (
          <LogoutButton
              variant="outlined"
              size="small"
              onClick={logOutHandler}
            >
              <LogoutIcon size="inherit" />
            </LogoutButton>
          )}

          <Menu
            anchorEl={menuAnchor}
            getContentAnchorEl={null}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
          >
            {userMenuItems.map(x => (
              <Link
                key={x.route}
                onClick={handleMenuClose}
                activeClassName="active"
                to={x.route}
              >
                {x.label}
              </Link>
            ))}
          </Menu>
        </>
      )}

      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={showCart}
      >
        <CartIcon size="inherit" />
        <Hidden xsDown>
          cart
        </Hidden>
      </Button>
    </Header>
  ), [
    pathname, 
    isLogged, 
    userBalanceVirtualCurrency, 
    userMenuItems, 
    projectId, 
    menuAnchor, 
    isSpecificProject
  ]);
}

const Menu = styled(MUIMenu)`
  .MuiMenu-list {
    background-color: ${({ theme }) => theme.palette.background.default};
  }
`;

const Tabs = styled(MUITabs)`
  &.MuiTabs-root {
    height: 100%
  }
`;

const Tab = styled(MUITab)`
  &.MuiTab-root {
    text-transform: uppercase;
    font-size: 1.4rem;
    font-weight: 700;
    line-height: 1.4rem;
    min-width: 50px;
  }
`;

const Link = styled(NavLink)`
  display: flex;
  padding: 15px 20px;
  min-width: 200px;
  align-items: center;
  text-transform: uppercase;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1.2rem;
  height: 100%;
  color: #d6e0e7;
  border: none;

  &:hover {
    color: #ff005b;
    text-decoration: none;
  }

  &.active {
    color: #ff005b;
  }
`;

const LogoutButton = styled(Button)`
  &.MuiButton-root {
    margin-right: 10px;
  }
`;

const VCCurrency = styled.div`
  color: ${({ theme }) => theme.palette.text.primary};
  margin-right: 10px;
`;

const LoginPanel = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-grow: 1;

  @media ${device.mobileL} {
    justify-content: center;
  }
`;

const LoginButton = styled(Button)`
  &.MuiButton-root {
    margin-right: 10px;
    font-size: 0.8rem;
  }
`;

const UserMail = styled(Button)`
  && {
    font-family: 'Roboto';
    text-transform: uppercase;
    color: ${({ theme }) => theme.palette.primary.main};
    margin: 0 1rem;
  }
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 50px;
  padding: 0 15px;
  font-family: 'Helvetica Neue', 'Roboto', Arial, Helvetica, sans-serif;
  background-color: ${({ theme }) => theme.palette.background.default};
`;

export { Navbar };
