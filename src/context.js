import React from 'react';
import { withSnackbar } from 'notistack';

import Cookie from './components/Cookie';
import {
  changeItemQuantityCart,
  createCart,
  removeItemFromCart,
  getCart, getVirtualCurrencyBalance
} from './components/StoreLoader';

const ProductContext = React.createContext();

class ProductProvider extends React.PureComponent {
  state = {
    projectId: this.props.projectId,
    logToken: Cookie(),
    userBalanceVirtualCurrency: [],
    isSideMenuShown: false,

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

    cartWithItemsBuyingByVCShown: false,
    cartWithItemsBuyingByVC: {
      items: [],
      vcPriceSku: null
    },

    isCartShown: false,
    isCartProcessing: false,
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

  setSideMenuVisibility = isSideMenuShown => this.setState({ isSideMenuShown });
  setEntitlementItems = entitlementItems => this.setState({ entitlementItems });
  setInventoryItems = inventoryItems => this.setState({ inventoryItems });
  setPhysicalItems = physicalItems => this.setState({ physicalItems });
  setVirtualCurrencies = virtualCurrencies => this.setState({ virtualCurrencies });
  setVirtualItems = virtualItems => this.setState({ virtualItems });

  getCart = () => {
    const { cart, logToken } = this.state;
    const cartPromise = getCart(cart.cartId, logToken);
    cartPromise.then(response => {
      if (!cartPromise.isCancel && response) {
        this.setState({
          cart: {
            cartId: response.data.cart_id,
            items: response.data.items.sort(this.compareItems),
            price: response.data.price || 0,
          },
          isCartProcessing: false
        });
      }
    });
  };

  createCart = () => {
    const cartIdPromise = createCart(this.state.logToken);
    cartIdPromise.then(response => {
      this.setState({
        cart: {
          cartId: response.data.id,
          items: [],
          price: {
            amount: 0,
            amount_without_discount: 0,
            currency: '',
          }
        }
      });
    });
  };

  clearCart = () => {
    this.showCart();
    this.createCart();
    this.updateVirtualCurrencyBalance();
  };

  payStationHandler = () => this.clearCart();

  compareItems = (a, b) => {
    if (a.sku > b.sku) {
      return 1;
    }
    if (a.sku < b.sku) {
      return -1;
    }
    return 0;
  };

  buyByVC = (product, vcSku) => {
    this.setState({
      cartWithItemsBuyingByVCShown: true,
      cartWithItemsBuyingByVC: {
        items: [product],
        vcPriceSku: vcSku
      }
    });
  };

  clearVCCart = () => {
    this.setState({
      cartWithItemsBuyingByVCShown: false,
      cartWithItemsBuyingByVC: {
        items: [],
        vcPriceSku: null
      }
    });

    this.updateVirtualCurrencyBalance();
  };

  addToCart = product => {
    const { enqueueSnackbar } = this.props;
    const { cart, logToken } = this.state;
    const isItemExist = cart.items.some(elem => elem.sku === product.sku);
    if (isItemExist) {
      this.getCart();
      this.setState({ isCartShown: true });
    } else {
      this.setState({ isCartProcessing: true });
      changeItemQuantityCart(product, 1, cart.cartId, logToken)
        .then(() => {
          this.setState({
            cart: {
              ...cart,
              items: [{ ...product, quantity: 1 }, ...cart.items].sort(this.compareItems),
              price: {
                ...cart.price,
                amount: cart.price.amount + product.price.amount,
                amount_without_discount: cart.price.amount_without_discount + product.price.amount_without_discount,
              },
            },
            isCartProcessing: false
          });
          this.showCart();
        })
        .catch(error => {
          this.setState({ isCartProcessing: false });
          const errorMsg = error.response ? error.response.data.errorMessage : error.message;
          enqueueSnackbar(errorMsg, { variant: 'error' });
        });
    }
  };

  removeFromCart = product => {
    const { cart } = this.state;
    
    this.setState({
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
  };

  changeItemQuantityInCart = (product, quantity) => {
    const { enqueueSnackbar } = this.props;
    const { cart, logToken } = this.state;

    if (quantity <= 0) {
      this.removeFromCart(product);
      removeItemFromCart(product, cart.cartId, logToken)
        .then(this.getCart);
    } else {
      const indexFind = cart.items.findIndex(elem => elem.sku === product.sku);
      const cartItems = cart.items;
      cartItems.splice(indexFind, 1, { ...product, quantity });
      this.setState({ cart: { ...cart, items: cartItems.sort(this.compareItems) } });
      changeItemQuantityCart(product, quantity, cart.cartId, logToken)
        .then(this.getCart)
        .catch(error => enqueueSnackbar(error.response.data.errorMessage, { variant: 'error' }));
    }
  };

  updateVirtualCurrencyBalance = () => {
    getVirtualCurrencyBalance(this.state.logToken).then((reps) => {
      this.setState({
        userBalanceVirtualCurrency: reps.data.items
      });
    });
  };

  render() {
    return (
      <ProductContext.Provider
        value={{
          ...this.state,
          setStateFrom: this.setStateFrom,
          payStationHandler: this.payStationHandler,
          setInventoryItems: this.setInventoryItems,
          setVirtualCurrencies: this.setVirtualCurrencies,
          setPhysicalItems: this.setPhysicalItems,
          setVirtualItems: this.setVirtualItems,
          setEntitlementItems: this.setEntitlementItems,
          addToCart: this.addToCart,
          buyByVC: this.buyByVC,
          clearVCCart: this.clearVCCart,
          createCart: this.createCart,
          showCart: this.showCart,
          changeItemQuantityInCart: this.changeItemQuantityInCart,
          updateVirtualCurrencyBalance: this.updateVirtualCurrencyBalance,
          hideCart: this.hideCart,
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
