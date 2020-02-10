import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';

import Hidden from '@material-ui/core/Hidden';
import styled from 'styled-components';

import { InventoryList } from './features/inventory/InventoryList';
import { PhysicalList } from './features/physical/PhysicalList';
import { ManageInventory } from './features/manage/ManageInventory';
import { VirtualList } from './features/virtual/VirtualList';
import { ServerPurchase } from './features/serverPurchase/ServerPurchase';
import { EntitlementList } from './features/entitlement/EntitlementList';
import { Cart } from './features/cart/Cart';
import { routes } from './utils/routes';
import Navbar from './components/Navbar';
import { MobileNavbar } from './components/MobileNavbar';
import Preloader from './components/Preloader.js';
import { ProductContext } from './context';
import VCPackagesList from './components/VCPackagesList';

const App = () => {
  const valueFromContext = React.useContext(ProductContext);

  return (
    <HashRouter basename='/'>
      <>
        <Navbar />
        <Hidden lgUp>
          <MobileNavbar />
        </Hidden>
        <Cart />
        {valueFromContext.isFetching
          ? <Preloader />
          : (
              <Switch>
                <Route path={routes.items} exact component={VirtualList} />
                <Route path={routes.inventory}render={() => <InventoryList {...valueFromContext} />} />
                <Route path={routes.currencies} render={() => <VCPackagesList {...valueFromContext} />} />
                <Route path={routes.physical} render={() => <PhysicalList {...valueFromContext} />} />
                <Route path={routes.entitlement} render={() => <EntitlementList {...valueFromContext} />} />
                <Route path={routes.manage} render={() => <ManageInventory {...valueFromContext} />} />
                <Route path={routes.purchase} render={() => <ServerPurchase {...valueFromContext} />} />
              </Switch>
            )
          }

        <Background getTheme={valueFromContext.getTheme}>
          <BackgroundOverlay getTheme={valueFromContext.getTheme} />
        </Background>
      </>
    </HashRouter>
  );
};

const Background = styled.div`
  background-image: url(${props => props.getTheme('backgroundUrl')});
  z-index: -1;
  background-size: cover;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

const BackgroundOverlay = styled.div`
  position: absolute;
  background-color: ${props => props.getTheme('colorBg')};
  opacity: 0.8;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

export default App;
