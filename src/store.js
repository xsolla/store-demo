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

const StateContext = React.createContext();
const ActionsContext = React.createContext();

const useStore = (mapState = () => ({}), mapActions = () => ({})) => {
  const state = mapState(React.useContext(StateContext));
  const actions = mapActions(React.useContext(ActionsContext));

  return {
    ...state,
    ...actions,
  };
};

const StoreProvider = ({ children, api }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [cartState, cartActions] = useCart(api, enqueueSnackbar);
  const [vcCartState, vcCartActions] = useVCCart(api, enqueueSnackbar);
  const [physicalGoodsState, physicalGoodsActions] = usePhysicalGoods(api, enqueueSnackbar);
  const [entitlementState, entitlementActions] = useEntitlement(api, enqueueSnackbar);
  const [virtualGoodsState, virtualGoodsActions] = useVirtualGoods(api, enqueueSnackbar);
  const [virtualCurrenciesState, virtualCurrenciesActions] = useVirtualCurrencies(
    api,
    enqueueSnackbar
  );
  const [inventoryState, inventoryActions] = useInventory(api, enqueueSnackbar);
  const [manageInventoryState, manageInventoryActions] = useManageInventory(api, enqueueSnackbar);

  return (
    <StateContext.Provider
      value={{
        cart: cartState,
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
