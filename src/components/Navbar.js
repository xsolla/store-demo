import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import styled from 'styled-components';

import MUIMenu from '@material-ui/core/Menu';
import Hidden from '@material-ui/core/Hidden';
import MUITabs from '@material-ui/core/Tabs';
import MUITab from '@material-ui/core/Tab';
import MUIIconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import CartIcon from '@material-ui/icons/ShoppingCart';
import LogoutIcon from '@material-ui/icons/ExitToAppOutlined';

import { routes, getMenuItems } from '../utils/routes';
import { device } from '../styles/devices';
import { Currency } from '../components/Currency';
import { ProductContext } from '../context';
import { eraseCookie } from './Cookie';
import XLogin from './XLogin.js';

const Navbar = ({ location }) => {
  const {
    getTheme,
    logToken,
    user,
    userBalanceVirtualCurrency,
    projectId,
    showCart,
    setSideMenuVisibility,
    isSideMenuShown,
  } = React.useContext(ProductContext);

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
  const generalMenuItems = getMenuItems([
    routes.items,
    routes.currencies,
    ...projectId === 44056 ? [routes.physical] : [],
  ])

  const userMenuItems = getMenuItems([
    routes.inventory,
    routes.entitlement,
    routes.manage,
    routes.purchase,
  ]);

  return (
    <Header getTheme={getTheme}>
      <Hidden mdDown>
        <Tabs value={location.pathname} component="nav">
          {generalMenuItems.map(x => (
            <Tab
              getTheme={getTheme}
              component={NavLink}
              label={x.label}
              value={x.route}
              to={x.route}
            />
          ))}
        </Tabs>
      </Hidden>

      <Hidden lgUp>
        <MenuButton getTheme={getTheme} onClick={toggleSideMenu}>
          <MenuIcon />
        </MenuButton>
      </Hidden>

      {isLogged && (
        <LoginPanel>
          {userBalanceVirtualCurrency.map(vc => (
            <VCCurrency key={vc.sku}>
              <Currency image={vc.image_url} value={vc.amount} />
            </VCCurrency>
          ))}

          <Hidden mdDown>
            <UserMail onClick={handleMenuOpen}>{user.email}</UserMail>
          </Hidden>
        </LoginPanel>
      )}

      <XLogin />

      {!logToken && <LoginButton>Log In</LoginButton>}
      {isLogged && projectId !== 44056 && (
       <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={logOutHandler}
        >
          <LogoutIcon size="inherit" />
        </Button>
      )}

      <CartButton
        variant="contained"
        color="secondary"
        size="small"
        onClick={showCart}
      >
        <CartIcon size="inherit" />
        <Hidden xsDown>
          cart
        </Hidden>
      </CartButton>

      <Menu
        getTheme={getTheme}
        anchorEl={menuAnchor}
        getContentAnchorEl={null}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        {userMenuItems.map(x => (
          <Link
            getTheme={getTheme}
            onClick={handleMenuClose}
            activeClassName="active"
            to={x.route}
          >
            {x.label}
          </Link>
        ))}
      </Menu>
    </Header>
  );
}

const Menu = styled(MUIMenu)`
  .MuiMenu-list {
    background-color: ${props => props.getTheme('colorBg')};
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
    font-family: ${props => props.getTheme('fontFamily')};
    font-size: 1.4rem;
    font-weight: 700;
    line-height: 1.4rem;
  }
`;

const Link = styled(NavLink)`
  display: flex;
  padding: 15px 20px;
  min-width: 200px;
  align-items: center;
  text-transform: uppercase;
  text-decoration: none;
  font-family: ${props => props.getTheme('fontFamily')};
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

const MenuButton = styled(MUIIconButton)`
  &.MuiIconButton-root {
    color: ${props => props.getTheme('colorAccentText')};
  }
`;

const VCCurrency = styled.div`
  margin-right: 10px;
`;

const LoginPanel = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;

  @media ${device.mobileL} {
    justify-content: center;
  }
`;

const LoginButton = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 0.8rem;
  line-height: 2em;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  font-family: 'Roboto';
  color: black;
  background: var(--mainWhite);
  border-radius: 4px;
  padding: 0 0.6rem;
  cursor: pointer;
`;

const CartButton = styled(Button)`

`;

const UserMail = styled.div`
  cursor: pointer;
  font-family: 'Roboto';
  text-transform: uppercase;
  color: #ff005b;
  margin: 0 1rem;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 15px;
  font-family: 'Helvetica Neue', 'Roboto', Arial, Helvetica, sans-serif;
  color: ${props => props.getTheme('colorAccentText')};
  background-color: ${props => props.getTheme('colorBg')};
`;

export default withRouter(Navbar);
