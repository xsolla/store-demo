import React from 'react';
import Colorer from 'color';
import { Route, Switch, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import Hidden from '@material-ui/core/Hidden';

import { InventoryList } from './features/inventory/components/InventoryList';
import { PhysicalList } from './features/physicalGoods/components/PhysicalList';
import { ManageInventory } from './features/manage/components/ManageInventory';
import { VirtualList } from './features/virtualGoods/components/VirtualList';
import { EntitlementList } from './features/entitlement/components/EntitlementList';
import { Cart } from './features/cart/components/Cart';
import { Login } from './features/user/components/Login';
import { UserBalances } from './features/user/components/Balances';
import { ServerPurchase } from './features/cart/components/ServerPurchase';
import { VCCart } from './features/vcCart/components/VCCart';
import { VCList } from './features/virtualCurrencies/components/VCList';
import { Navbar } from './components/Navbar';
import { MobileNavbar } from './components/MobileNavbar';
import { routes } from './utils/routes';
import { useStore } from './store';

const mapState = state => ({
  user: state.user.userInfo,
  isPublic: state.config.storeMode === 'public',
  isDemo: state.config.storeMode === 'demo',
});

const mapActions = actions => ({
  showCart: actions.cart.show,
});

const App = React.memo(() => {
  const [isSideMenuOpen, setMenuVisibility] = React.useState(false);
  const openMenu = React.useCallback(() => setMenuVisibility(true), []);
  const closeMenu = React.useCallback(() => setMenuVisibility(false), []);

  const { user, isPublic, isDemo, showCart } = useStore(mapState, mapActions);
  const renderUserBalances = React.useCallback(() => <UserBalances />, []);

  return React.useMemo(
    () => (
      <Body>
        <Navbar
          isPublic={isPublic}
          isLogoutShown={isDemo}
          isLogged={Boolean(user)}
          userEmail={user ? user.email : ''}
          onMenuOpen={openMenu}
          onCartOpen={showCart}
          renderUserBalances={renderUserBalances}
        />
        {!isPublic && (
          <Hidden lgUp>
            <MobileNavbar
              isLogged={Boolean(user)}
              userEmail={user ? user.email : ''}
              isOpen={isSideMenuOpen}
              onOpen={openMenu}
              onClose={closeMenu}
            />
          </Hidden>
        )}
        <Cart />
        <VCCart />
        <Login />
        <Content>
          <Switch>
            <Route path={routes.items} exact component={VirtualList} />
            <Route path={routes.currencies} component={VCList} />
            <Route path={routes.physical} component={PhysicalList} />
            <Route path={routes.inventory} component={InventoryList} />
            <Route path={routes.manage} component={ManageInventory} />
            <Route path={routes.entitlement} component={EntitlementList} />
            <Route path={routes.purchase} component={ServerPurchase} />
            <Route path={routes.specificProject} component={PhysicalList} />
            <Redirect to={routes.items} />
          </Switch>
        </Content>
      </Body>
    ),
    [isPublic, isDemo, user, openMenu, showCart, renderUserBalances, isSideMenuOpen, closeMenu]
  );
});

const Body = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  background: ${({ theme }) =>
    `url(${theme.palette.background.imageUrl}) ${Colorer(theme.palette.background.default).alpha(0.8)}`};
  background-attachment: fixed;
  background-size: cover;
  background-blend-mode: darken;
`;

const Content = styled.div`
  position: relative;
  height: 100%;
  overflow-y: auto;
`;

export default App;
