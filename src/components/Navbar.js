import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import MUIMenu from '@material-ui/core/Menu';
import Hidden from '@material-ui/core/Hidden';
import MUITabs from '@material-ui/core/Tabs';
import MUITab from '@material-ui/core/Tab';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import CartIcon from '@material-ui/icons/ShoppingCart';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import LogoutIcon from '@material-ui/icons/ExitToAppOutlined';
import RedeemIcon from '@material-ui/icons/Redeem';
import XLogin from './XLogin';

import { routes, getRoutes } from '../routes';
import { device } from '../styles/devices';
import { eraseCookie } from '../utils/cookie';
import { withRedeemModalWindow } from '../redux/container/redeem-modal-container';

const NavbarComponent = React.memo(
  ({ isPublic, isLogged, isLogoutHide, userEmail, onMenuOpen, onCartOpen, onRedeemOpen, renderUserBalances, openRedeemModal }) => {
    const { pathname } = useLocation();

    const [menuAnchor, setMenuAnchor] = React.useState(null);
    const handleMenuClose = () => setMenuAnchor(null);
    const handleMenuOpen = event => setMenuAnchor(event.currentTarget);

    const logOutHandler = React.useCallback(() => {
      eraseCookie('xsolla_login_token', null);
      eraseCookie('xsolla_last_click_id', null);
      window.location.reload();
    }, []);

    const generalMenuItems = React.useMemo(
      () => getRoutes([routes.items, routes.currencies, routes.physical, routes.games]),
      []
    );

    const userMenuItems = React.useMemo(
      () => getRoutes([routes.inventory, routes.entitlement, routes.manage, routes.purchase]),
      []
    );

    const isLocationExistsInTabs = React.useMemo(() => generalMenuItems.some(x => x.route === pathname), [
      generalMenuItems,
      pathname,
    ]);

      return React.useMemo(
      () => (
        <Header>
          <XLogin />
          {!isPublic && (
            <>
              <Hidden mdDown>
                <Tabs
                  value={isLocationExistsInTabs ? pathname : false}
                  textColor="primary"
                  indicatorColor="primary"
                  component="nav">
                  {generalMenuItems.map(x => (
                    <Tab key={x.route} component={NavLink} label={x.label} value={x.route} to={x.route} />
                  ))}
                </Tabs>
              </Hidden>

              <Hidden lgUp>
                <IconButton color="primary" onClick={onMenuOpen}>
                  <MenuIcon />
                </IconButton>
              </Hidden>

              {isLogged && (
                <LoginPanel>
                  {renderUserBalances()}
                  <Hidden mdDown>
                    <UserMail
                      endIcon={Boolean(menuAnchor) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      onClick={handleMenuOpen}>
                      {userEmail}
                    </UserMail>
                  </Hidden>
                </LoginPanel>
              )}

              {isLogoutHide && isLogged && (
                <LogoutButton color="primary" variant="text" size="small" onClick={logOutHandler}>
                  <LogoutIcon size="inherit" />
                </LogoutButton>
              )}

              <Menu
                anchorEl={menuAnchor}
                getContentAnchorEl={null}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}>
                {userMenuItems.map(x => (
                  <Link key={x.route} onClick={handleMenuClose} activeClassName="active" to={x.route}>
                    {x.label}
                  </Link>
                ))}
              </Menu>
            </>
          )}

          <MenuButtons>
              <Button variant="contained" color="primary" size="small" onClick={openRedeemModal}>
                 <RedeemIcon size="inherit" />
                 <Hidden xsDown>redeem</Hidden>
              </Button>

              <Button variant="contained" color="primary" size="small" onClick={onCartOpen}>
                <CartIcon size="inherit" />
                <Hidden xsDown>cart</Hidden>
              </Button>
          </MenuButtons>
        </Header>
      ),
      [
        isPublic,
        isLocationExistsInTabs,
        pathname,
        generalMenuItems,
        onMenuOpen,
        isLogged,
        renderUserBalances,
        menuAnchor,
        userEmail,
        isLogoutHide,
        logOutHandler,
        userMenuItems,
        onCartOpen,
        onRedeemOpen
      ]
    );
  }
);

const Menu = styled(MUIMenu)`
  .MuiMenu-list {
    background-color: ${({ theme }) => theme.palette.background.default};
  }
`;

const Tabs = styled(MUITabs)`
  &.MuiTabs-root {
    height: 100%;
    flex-grow: 1;
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

const MenuButtons = styled.div`
  button:not(:last-child) {
    margin-right: 1rem;
  }
`;

const LoginPanel = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 1rem;
  align-items: center;
  justify-content: end;
  flex-grow: 1;
  margin: 0 1rem;

  @media ${device.mobileL} {
    justify-content: center;
  }
`;

const UserMail = styled(Button)`
  && {
    font-family: 'Roboto' sans-serif;
    text-transform: uppercase;
    color: ${({ theme }) => theme.palette.primary.main};
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

export const Navbar = withRedeemModalWindow(NavbarComponent);
