import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import styled from 'styled-components';
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
  const { updateVirtualCurrencyBalance } = React.useContext(ProductContext);

  React.useEffect(() => {
    updateVirtualCurrencyBalance();
  }, []);

  return (
    <>
      <Navbar />
      <Hidden lgUp>
        <MobileNavbar />
      </Hidden>
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
          <Redirect to={routes.items} />
        </Switch>
      </Content>

      <Background>
        <BackgroundOverlay />
      </Background>
    </>
  );
};

const Content = styled.div`
  position: relative;
  height: 100%;
  overflow-y: auto;
`;

const Background = styled.div`
  background-image: url(${props => props.theme.backgroundUrl});
  z-index: -1;
  background-size: cover;
  position: fixed;
  height: 100vh;
  width: 100vw;
  left: 0;
  top: 0;
`;

const BackgroundOverlay = styled.div`
  position: absolute;
  background-color: ${props => props.theme.colorBg};
  opacity: 0.8;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

export default App;
