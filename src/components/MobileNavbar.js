import React from 'react';
import styled from 'styled-components';
import { NavLink, withRouter } from 'react-router-dom';
import Drawer from '@material-ui/core/SwipeableDrawer';
import MUIIconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import MUIDivider from '@material-ui/core/Divider';
import MUITabs from '@material-ui/core/Tabs';
import MUITab from '@material-ui/core/Tab';
import LogoutIcon from '@material-ui/icons/ExitToAppOutlined';

import { ProductContext } from '../context';
import { routes, getMenuItems } from '../utils/routes';
import { eraseCookie } from './Cookie';

const MobileNavbarComponent = ({ location }) => {
  const {
    getTheme,
    isSideMenuShown,
    user,
    logToken,
    projectId,
    setSideMenuVisibility,
  } = React.useContext(ProductContext);
  const closeMenu = () => setSideMenuVisibility(false);
  const openMenu = () => setSideMenuVisibility(true);

  const logOutHandler = () => {
    eraseCookie("xsolla_login_token", null);
    eraseCookie("xsolla_last_click_id", null);
    window.location.reload();
  };

  React.useEffect(() => closeMenu, []);

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
    <Drawer open={isSideMenuShown} anchor="left" onClose={closeMenu} onOpen={openMenu}>
      <Content getTheme={getTheme}>
        <Header>
        {isLogged && projectId !== 44056 && (
          <IconButton getTheme={getTheme} onClick={logOutHandler}>
            <LogoutIcon size="inherit" />
          </IconButton>
          )}
          <UserMail getTheme={getTheme}>{user.email}</UserMail>
          <IconButton getTheme={getTheme} onClick={closeMenu}>
            <ChevronLeftIcon />
          </IconButton>
        </Header>
        <Divider getTheme={getTheme} />
          <Tabs
            value={location.pathname}
            component="nav"
            variant="scrollable"
            orientation="vertical"
            getTheme={getTheme}
          >
          {generalMenuItems.map(x => (
            <Tab
              getTheme={getTheme}
              component={NavLink}
              label={x.label}
              value={x.route}
              to={x.route}
            />
          ))}
          <MenuDivider getTheme={getTheme} />
          {userMenuItems.map(x => (
            <Tab
              getTheme={getTheme}
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
  background-color: ${props => props.getTheme('colorBg')};
`;

const Divider = styled(MUIDivider)`
  &.MuiDivider-root {
    background-color: ${props => props.getTheme('colorAccentText')};
    opacity: 0.1;
    margin-bottom: 5px;
  }
`;

const MenuDivider = styled(Divider)`
  &.MuiDivider-root {
    margin: 5px 0;
  }
`;

const IconButton = styled(MUIIconButton)`
  &.MuiIconButton-root {
    color: ${props => props.getTheme('colorAccentText')};
  }
`;

const Tabs = styled(MUITabs)`
  color: ${props => props.getTheme('colorAccent')};
`;

const Tab = styled(MUITab)`
  &.MuiTab-root {
    color: ${props => props.getTheme('colorAccentText')};
    padding: 15px;
    font-family: ${props => props.getTheme('fontFamily')};
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
`;

const UserMail = styled.div`
  flex-grow: 1;
  padding: 0 15px;
  text-transform: uppercase;
  font-family: Roboto;
  color: ${props => props.getTheme('colorAccent')};
`;

export const MobileNavbar = withRouter(MobileNavbarComponent);
