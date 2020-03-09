import React from 'react';
import Colorer from 'color';
import { Route, Switch, Redirect, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import Hidden from '@material-ui/core/Hidden';

import { InventoryList } from './features/inventory/components/InventoryList';
import { PhysicalList } from './features/physicalGoods/components/PhysicalList';
import { ManageInventory } from './features/manage/components/ManageInventory';
import { VirtualList } from './features/virtualGoods/components/VirtualList';
import { EntitlementList } from './features/entitlement/components/EntitlementList';
import { Cart } from './features/cart/components/Cart';
import { ServerPurchase } from './features/cart/components/ServerPurchase';
import { VCCart } from './features/vcCart/components/VCCart';
import { VCList } from './features/virtualCurrencies/components/VCList';
import { Navbar } from './components/Navbar';
import { MobileNavbar } from './components/MobileNavbar';
import { routes } from './utils/routes';
import { ProductContext } from './context';

const App = () => {
  const { updateVirtualCurrencyBalance } = React.useContext(ProductContext);

  const isSpecificProject = useRouteMatch({
    path: routes.specificProject,
    strict: true,
    sensitive: true,
  });

  React.useEffect(() => {
    updateVirtualCurrencyBalance();
  }, []);

  return React.useMemo(
    () => (
      <Body>
        <Navbar isSpecificProject={isSpecificProject} />
        <Hidden lgUp>{!isSpecificProject && <MobileNavbar />}</Hidden>
        <Cart />
        <VCCart />
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
    [isSpecificProject]
  );
};

const Body = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  background: ${({ theme }) =>
    `url(${theme.palette.background.imageUrl}) ${Colorer(theme.palette.background.default).alpha(
      0.8
    )}`};
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
