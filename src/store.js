import React from 'react';
import { useSnackbar } from 'notistack';

import { usePhysicalGoods } from './features/physicalGoods/store';
import { useVirtualGoods } from './features/virtualGoods/store';
import { useVirtualCurrencies } from './features/virtualCurrencies/store';
import { useInventory } from './features/inventory/store';
import { useEntitlement } from './features/entitlement/store';
import { useCart } from './features/cart/store';
import { useVCCart } from './features/vcCart/store';
import { useManageInventory } from './features/manage/store';
import { useUser } from './features/user/store';

const StateContext = React.createContext();
const ActionsContext = React.createContext();

const useStore = (mapState, mapActions) => {
  const globalState = React.useContext(StateContext);
  const globalActions = React.useContext(ActionsContext);

  const state = typeof mapState === 'function' ? mapState(globalState) : {};
  const actions = typeof mapActions === 'function' ? mapActions(globalActions) : {};

  return {
    ...state,
    ...actions,
  };
};

const StoreProvider = ({ storeMode, children, api }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [userState, userActions] = useUser(api, enqueueSnackbar);
  const [cartState, cartActions] = useCart(api, enqueueSnackbar, userActions.loadBalances);
  const [vcCartState, vcCartActions] = useVCCart(api, enqueueSnackbar, userActions.loadBalances);
  const [physicalGoodsState, physicalGoodsActions] = usePhysicalGoods(api, enqueueSnackbar);
  const [entitlementState, entitlementActions] = useEntitlement(api, enqueueSnackbar);
  const [virtualGoodsState, virtualGoodsActions] = useVirtualGoods(api, enqueueSnackbar);
  const [virtualCurrenciesState, virtualCurrenciesActions] = useVirtualCurrencies(api, enqueueSnackbar);
  const [inventoryState, inventoryActions] = useInventory(api, enqueueSnackbar);
  const [manageInventoryState, manageInventoryActions] = useManageInventory(
    api,
    enqueueSnackbar,
    userActions.loadBalances
  );

  const config = React.useMemo(
    () => ({
      storeMode,
    }),
    [storeMode]
  );

  return (
    <StateContext.Provider
      value={{
        config,
        cart: cartState,
        user: userState,
        vcCart: vcCartState,
        physicalGoods: physicalGoodsState,
        entitlement: entitlementState,
        virtualGoods: virtualGoodsState,
        virtualCurrencies: virtualCurrenciesState,
        inventory: inventoryState,
        manageInventory: manageInventoryState,
      }}>
      <ActionsContext.Provider
        value={{
          cart: cartActions,
          user: userActions,
          vcCart: vcCartActions,
          physicalGoods: physicalGoodsActions,
          entitlement: entitlementActions,
          virtualGoods: virtualGoodsActions,
          virtualCurrencies: virtualCurrenciesActions,
          inventory: inventoryActions,
          manageInventory: manageInventoryActions,
        }}>
        {children}
      </ActionsContext.Provider>
    </StateContext.Provider>
  );
};

export { StoreProvider, useStore };
