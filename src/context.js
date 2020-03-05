import React from 'react';
import { withSnackbar } from 'notistack';

import Cookie from './components/Cookie';
import {
  getCart,
  createCart,
  removeItemFromCart,
  changeItemQuantityCart,
  getVirtualCurrencyBalance
} from './components/StoreLoader';

const ProductContext = React.createContext();

class ProductProvider extends React.PureComponent {
  state = {
    projectId: this.props.projectId,
    logToken: Cookie(),
    user: null,
    isSideMenuShown: false,

    userBalanceVirtualCurrency: [],
    isUserBalanceFetching: false,

    virtualItems: [],
    areVirtualItemsFetching: false,

    virtualCurrencies: [],
    areVirtualCurrenciesFetching: false,

    physicalItems: [],
    arePhysicalItemsFetching: false,

    inventoryItems: [],
    areInventoryItemsFetching: false,
    isItemConsuming: false,

    entitlementItems: [],
    areEntitlementItemsFetching: false,
    isRedeeming: false,

    isVCCartShown: false,
    isVCCartProcessing: false,
    vcCart: {
      items: [],
      vcPriceSku: null
    },

    isCartShown: false,
    isCartCreating: false,
    isCartLoading: false,
    isQuantityChanging: false,
    isItemAdding: false,
    isItemRemoving: false,
    cart: {
      cartId: null,
      items: [],
      price: {
        amount: 0,
        amount_without_discount: 0,
        currency: '',
      }
    },
  };

  setStateFrom = (stateName, stateValue) => this.setState({ [stateName]: stateValue });

  showCart = () => this.setState({ isCartShown: true });
  hideCart = () => this.setState({ isCartShown: false });

  showVCCart = () => this.setState({ isVCCartShown: true });
  hideVCCart = () => this.setState({ isVCCartShown: false });

  setSideMenuVisibility = isSideMenuShown => this.setState({ isSideMenuShown });

  setEntitlementItems = entitlementItems => this.setState({ entitlementItems });
  setInventoryItems = inventoryItems => this.setState({ inventoryItems });

  setPhysicalItems = items => this.setState({
    physicalItems: items.filter(item => Boolean(item.price))
  });

  setVirtualCurrencies = items => this.setState({
    virtualCurrencies: items.filter(item => Boolean(item.price))
  });

  setVirtualItems = items => this.setState({ virtualItems: items });

  getCart = () => {
    const { enqueueSnackbar } = this.props;
    const { cart, logToken, projectId } = this.state;

    this.setState({ isCartLoading: true });
    getCart(projectId, logToken, cart.cartId)
      .then(cart => {
        this.setState({
          isCartLoading: false,
          cart: {
            cartId: cart.cart_id,
            items: cart.items
              .filter(item => Boolean(item.price))
              .sort(this.compareItems),
            price: cart.price || 0,
          },
        })
      })
      .catch(error => {
        this.setState({ isCartLoading: false });
        if (!error.__CANCEL__) {
          const errorMsg = error.response ? error.response.data.errorMessage : error.message;
          enqueueSnackbar(errorMsg, { variant: 'error' });
        }
      });
  };

  createCart = () => {
    const { enqueueSnackbar } = this.props;
    const { projectId, logToken } = this.state;

    this.setState({ isCartCreating: true });
    createCart(projectId, logToken)
      .then(cart => {
        this.setState({
          isCartCreating: false,
          cart: {
            cartId: cart.id,
            items: [],
            price: {
              amount: 0,
              amount_without_discount: 0,
              currency: '',
            }
          }
        });
      })
      .catch(error => {
        this.setState({ isCartCreating: false });
        const errorMsg = error.response ? error.response.data.errorMessage : error.message;
        enqueueSnackbar(errorMsg, { variant: 'error' });
      });
  };

  clearCart = () => {
    this.createCart();
    this.updateVirtualCurrencyBalance();
  };

  compareItems = (a, b) => a.sku > b.sku ? 1 : -1;

  buyByVC = product => {
    this.setState({
      isVCCartShown: true,
      vcCart: { items: [product] },
    });
  };

  clearVCCart = () => {
    this.setState({
      isVCCartShown: false,
      vcCart: { items: [] },
    });
  };

  addToCart = product => {
    const { enqueueSnackbar } = this.props;
    const { cart, logToken, projectId } = this.state;
    const isItemExist = cart.items.some(elem => elem.sku === product.sku);

    if (isItemExist) {
      this.setState({ isCartShown: true });
    } else {
      this.setState({ isItemAdding: true });
      changeItemQuantityCart(projectId, logToken, cart.cartId, product.sku, 1)
        .then(() => {
          this.setState({
            isItemAdding: false,
            cart: {
              ...cart,
              items: [{ ...product, quantity: 1 }, ...cart.items].sort(this.compareItems),
              price: {
                ...cart.price,
                amount: cart.price.amount + product.price.amount,
                amount_without_discount: cart.price.amount_without_discount + product.price.amount_without_discount,
              },
            },
          });
          this.getCart();
          this.showCart();
        })
        .catch(error => {
          this.setState({ isItemAdding: false });
          if (!error.__CANCEL__) {
            const errorMsg = error.response ? error.response.data.errorMessage : error.message;
            enqueueSnackbar(errorMsg, { variant: 'error' });
          }
        });
    }
  };

  removeFromCart = product => {
    const { enqueueSnackbar } = this.props;
    const { projectId, logToken, cart } = this.state;
    this.setState({
      isItemRemoving: true,
      cart: {
        ...cart,
        items: cart.items
          .filter(prod => prod.sku !== product.sku)
          .sort(this.compareItems),
        price: {
          ...cart.price,
          amount: cart.price.amount - product.price.amount * product.quantity,
          amount_without_discount: cart.price.amount_without_discount - product.price.amount_without_discount * product.quantity
        }
      }
    });
    removeItemFromCart(projectId, logToken, cart.cartId, product.sku)
      .then(() => {
        this.setState({ isItemRemoving: false });
        this.getCart();
      })
      .catch(error => {
        this.getCart();
        this.setState({ isItemRemoving: false });
        const errorMsg = error.response ? error.response.data.errorMessage : error.message;
        enqueueSnackbar(errorMsg, { variant: 'error' });
      });
  };

  changeItemQuantityInCart = (product, quantity) => {
    const { enqueueSnackbar } = this.props;
    const { cart, logToken, projectId } = this.state;

    const updatedItemIndex = cart.items.findIndex(item => item.sku === product.sku);
    const updatedItem = { ...product, quantity };

    this.setState({
      cart: {
        ...cart,
        items: [
          ...cart.items.slice(0, updatedItemIndex),
          updatedItem,
          ...cart.items.slice(updatedItemIndex + 1),
        ].sort(this.compareItems),
      }
    });
    changeItemQuantityCart(projectId, logToken, cart.cartId, product.sku, quantity)
      .then(this.getCart)
      .catch(error => {
        if (!error.__CANCEL__) {
          const errorMsg = error.response ? error.response.data.errorMessage : error.message;
          this.getCart();
          enqueueSnackbar(errorMsg, { variant: 'error' });
        }
      });
  };

  updateVirtualCurrencyBalance = () => {
    const { enqueueSnackbar } = this.props;
    const { projectId, logToken } = this.state;

    this.setState({ isUserBalanceFetching: true });
    getVirtualCurrencyBalance(projectId, logToken)
      .then(data => {
        this.setState({
          isUserBalanceFetching: false,
          userBalanceVirtualCurrency: data.items,
        });
      })
      .catch(error => {
        this.setState({ isUserBalanceFetching: false });
        const errorMsg = error.response ? error.response.data.errorMessage : error.message;
        enqueueSnackbar(errorMsg, { variant: 'error' });
      })
  };

  render() {
    return (
      <ProductContext.Provider
        value={{
          ...this.state,
          setStateFrom: this.setStateFrom,
          setInventoryItems: this.setInventoryItems,
          setVirtualCurrencies: this.setVirtualCurrencies,
          setPhysicalItems: this.setPhysicalItems,
          setVirtualItems: this.setVirtualItems,
          setEntitlementItems: this.setEntitlementItems,
          addToCart: this.addToCart,
          removeFromCart: this.removeFromCart,
          createCart: this.createCart,
          getCart: this.getCart,
          clearCart: this.clearCart,
          clearVCCart: this.clearVCCart,
          showVCCart: this.showVCCart,
          hideVCCart: this.hideVCCart,
          buyByVC: this.buyByVC,
          showCart: this.showCart,
          hideCart: this.hideCart,
          changeItemQuantityInCart: this.changeItemQuantityInCart,
          updateVirtualCurrencyBalance: this.updateVirtualCurrencyBalance,
          setSideMenuVisibility: this.setSideMenuVisibility,
        }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductContext, ProductConsumer };

export default withSnackbar(ProductProvider);
