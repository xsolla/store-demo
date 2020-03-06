import React from 'react';
import Colorer from 'color';
import styled from 'styled-components';
import { NavLink, useLocation } from 'react-router-dom';
import Drawer from '@material-ui/core/SwipeableDrawer';
import MUIIconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import MUIDivider from '@material-ui/core/Divider';
import Tabs from '@material-ui/core/Tabs';
import MUITab from '@material-ui/core/Tab';
import LogoutIcon from '@material-ui/icons/ExitToAppOutlined';

import { ProductContext } from '../context';
import { routes, getMenuItems } from '../utils/routes';
import { eraseCookie } from '../utils/cookie';

const MobileNavbar = () => {
  const {
    isSideMenuShown,
    user,
    logToken,
    projectId,
    setSideMenuVisibility,
  } = React.useContext(ProductContext);
  const location = useLocation();

  const closeMenu = () => setSideMenuVisibility(false);
  const openMenu = () => setSideMenuVisibility(true);

  const logOutHandler = () => {
    eraseCookie("xsolla_login_token", null);
    eraseCookie("xsolla_last_click_id", null);
    window.location.reload();
  };

  React.useEffect(() => closeMenu, []);

  const isLogged = logToken && user;

  const generalMenuItems = React.useMemo(() => getMenuItems([
    routes.items,
    routes.currencies,
    ...projectId === 44056 ? [routes.physical] : [],
  ]), [projectId]);

  const userMenuItems = React.useMemo(() => getMenuItems([
    routes.inventory,
    routes.entitlement,
    routes.manage,
    routes.purchase,
  ]), []);

  return (
    <Drawer
      open={isSideMenuShown}
      anchor="left"
      onOpen={openMenu}
      onClose={closeMenu}
    >
      <Content>
        <Header>
        {isLogged && projectId !== 44056 && (
          <IconButton onClick={logOutHandler}>
            <LogoutIcon size="inherit" />
          </IconButton>
          )}
          {isLogged && <UserMail>{user.email}</UserMail>}
          <IconButton onClick={closeMenu}>
            <ChevronLeftIcon />
          </IconButton>
        </Header>
        <Tabs
          value={location.pathname}
          onChange={closeMenu}
          component="nav"
          variant="scrollable"
          color="primary"
          indicatorColor="primary"
          orientation="vertical"
        
        >
        {generalMenuItems.map(x => (
          <Tab
            component={NavLink}
            label={x.label}
            value={x.route}
            to={x.route}
          />
        ))}
        <MenuDivider />
        {userMenuItems.map(x => (
          <Tab
            component={NavLink}
            label={x.label}
            value={x.route}
            to={x.route}
          />
        ))}
        </Tabs>
      </Content>
    </Drawer>
  );
};

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 320px;
  height: 100%;
  background-color: ${({ theme }) => theme.palette.background.default};
`;

const MenuDivider = styled(MUIDivider)`
  &.MuiDivider-root {
    background-color: ${({ theme }) => Colorer(theme.palette.text.primary).alpha(0.1).string()};
    margin: 5px 0;
  }
`;

const IconButton = styled(MUIIconButton)`
  &.MuiIconButton-root {
    color: ${({ theme }) => theme.palette.primary.main};
  }
`;

const Tab = styled(MUITab)`
  &.MuiTab-root {
    padding: 15px;
    font-size: 1.3rem;
    line-height: 1.3rem;
    font-weight: 700;
  }

  & .MuiTab-wrapper {
    align-items: flex-start;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 49px;
  border-bottom: 1px solid ${({ theme }) => Colorer(theme.palette.text.primary).alpha(0.1).string()};
`;

const UserMail = styled.div`
  flex-grow: 1;
  padding: 0 15px;
  text-transform: uppercase;
  font-family: Roboto;
  color: ${({ theme }) => theme.palette.primary.main};
`;

export { MobileNavbar };
