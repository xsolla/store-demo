import React from 'react';
import Colorer from 'color';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import styled, { css } from 'styled-components';
import Hidden from '@material-ui/core/Hidden';

import { InventoryList } from './features/inventory/InventoryList';
import { PhysicalList } from './features/physical/PhysicalList';
import { ManageInventory } from './features/manage/ManageInventory';
import { VirtualList } from './features/virtual/VirtualList';
import { ServerPurchase } from './features/serverPurchase/ServerPurchase';
import { EntitlementList } from './features/entitlement/EntitlementList';
import { Cart } from './features/cart/Cart';
import { VCCart } from './features/cart/VCCart';
import { VCList } from './features/virtualCurrenciesList/VCList';
import { Navbar } from './components/Navbar';
import { MobileNavbar } from './components/MobileNavbar';
import { routes } from './utils/routes';
import { ProductContext } from './context';

const App = () => {
  const { updateVirtualCurrencyBalance, clearCart, projectId } = React.useContext(ProductContext);

  const isSpecificProject = useRouteMatch({
    path: routes.specificProject,
    strict: true,
    sensitive: true
  });

  React.useEffect(() => {
    clearCart();
  }, [projectId]);

  React.useEffect(() => {
    updateVirtualCurrencyBalance();
  }, []);

  return React.useMemo(() => (
    <Body hasBackground={!isSpecificProject}>
      <Navbar isSpecificProject={isSpecificProject} />
      <Hidden lgUp>
        <MobileNavbar />
      </Hidden>
      <Cart />
      {!isSpecificProject && <VCCart />}
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
        </Switch>
      </Content>
    </Body>
  ), [isSpecificProject]);
};

const Body = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  ${({ theme, hasBackground }) => hasBackground
  ? css`
    background: ${({ theme }) =>
      `url(${theme.palette.background.imageUrl}) ${Colorer(theme.palette.background.default).alpha(0.8)}`
    };
    background-attachment: fixed;
    background-size: cover;
    background-blend-mode: darken;
  `
  : css`
    background-color: ${theme.palette.background.default};
  `};
`;

const Content = styled.div`
  position: relative;
  height: 100%;
  overflow-y: auto;
`;

export default App;
