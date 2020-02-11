import React from "react";
import { ThemeProvider } from 'styled-components';
import Cookie from "./components/Cookie";
import {
  changeItemQuantityCart,
  createCart,
  removeItemFromCart,
  getCart, getVirtualCurrencyBalance
} from "./components/StoreLoader";

const ProductContext = React.createContext();

const theme = {
  colorText: '#D6E0E7',
  colorAccent: '#FF005B',
  colorAccentText: '#F6FAFF',
  colorBg: '#011627',
  borderRadius: 8,
  backgroundUrl: 'https://res.cloudinary.com/maiik/image/upload/v1549624607/Xsolla/HomePage_Hero_Illustration_1440_oabqmk.jpg',
  cardWidth: '300',
  boxShadow: '0 5px 12px 0px rgba(0,0,0,0.2)',
  padding: '8px',
  transitionTime: '0.3s',
  transitionEasing: 'ease-in-out',
  transition: `all 0.3s ease-in-out`,
  transitionStyle: '0.3s ease-in-out',
  fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif'
};

class ProductProvider extends React.PureComponent {
  state = {
    projectId: this.props.projectId,
    logToken: Cookie(),
    userBalanceVirtualCurrency: [],

    virtualItems: [],
    virtualItemsError: '',
    areVirtualItemsFetching: false,

    virtualCurrencies: [],
    virtualCurrenciesError: '',
    areVirtualCurrenciesFetching: false,

    physicalItems: [],
    physicalItemsError: '',
    physicalItemsFetching: false,

    entitlementItems: [],
    virtualCurrencyPackages: null,
    currency: null,
    subscriptions: null,
    inventoryItems: null,
    cartShown: false,
    isSideMenuShown: false,
    cart: {
      cartId: null,
      items: [],
      price: {
        amount: 0,
        amount_without_discount: 0,
        currency: '',
      }
    },
    cartWithItemsBuyingByVCShown: false,
    cartWithItemsBuyingByVC: {
      items: []
    },
    showCartError: false,
    cartError: false,
    isFetching: false,
    psToken: '',
    theme,
  };

  showCart = () => this.setState({ cartShown: true });
  hideCart = () => this.setState({ cartShown: false });

  showCartError = (title, message) => {
    this.setState({
      showCartError: true,
      cartError: {
        title,
        message
      }
    });
    this.getCart();
  };

  setSideMenuVisibility = isSideMenuShown => this.setState({ isSideMenuShown });

  hideCartError = () => {
    this.setState({
      showCartError: false,
      cartError: null
    });
  };

  setInventoryItems = inventoryItems => {
    this.setState({
      inventoryItems,
      isFetching: false
    })
  };

  setEntitlementItems = entitlementItems => {
    this.setState({
      entitlementItems,
      isFetching: false
    })
  };

  setPhysicalItems = physicalItems => this.setState({ physicalItems });
  setPhysicalItemsError = physicalItemsError => this.setState({ physicalItemsError });

  setVirtualItems = virtualItems => this.setState({ virtualItems });
  setVirtualItemsError = virtualItemsError => this.setState({ virtualItemsError });

  setVirtualCurrencies = virtualCurrencies => this.setState({ virtualCurrencies });
  setVirtualCurrenciesError = virtualCurrenciesError => this.setState({ virtualCurrenciesError });

  getCart = () => {
    const cartPromise = getCart(this.state.cart.cartId, this.state.logToken);
    cartPromise.then(response => {
      if (!cartPromise.isCancel && response) {
        this.setState({
          cart: {
            cartId: response.data.cart_id,
            items: response.data.items.sort(this.compareItems),
            price: response.data.price
          },
          isFetching: false
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

  setPsToken = psToken => this.setState({ psToken });

  setStateFrom = (stateName, stateValue) => this.setState({ [stateName]: stateValue });

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
    const { cart, logToken } = this.state;
    const indexFind = cart.items.findIndex(elem => elem.sku === product.sku);

    if (indexFind !== -1) {
      this.getCart();
      this.setState({ cartShown: true });
    } else {
      this.setState({
        cart: {
          ...cart,
          items: [{ ...product, quantity: 1 }, ...cart.items].sort(this.compareItems),
          price: {
            ...cart.price,
            amount: cart.price.amount + product.price.amount,
            amount_without_discount: cart.price.amount_without_discount + product.price.amount_without_discount,
          },
        }
      });
      changeItemQuantityCart(product, 1, cart.cartId, logToken)
        .then(this.getCart)
        .catch(error => this.showCartError('Change Item Quantity Error',error.response.data.errorMessage));
      this.showCart();
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
    const { cart, logToken } = this.state;

    if (quantity <= 0) {
      this.removeFromCart(product);
      removeItemFromCart(product, cart.cartId, logToken)
        .then(getCart);
    } else {
      const indexFind = cart.items.findIndex(elem => elem.sku === product.sku);
      const cartItems = cart.items;
      cartItems.splice(indexFind, 1, { ...product, quantity });
      this.setState({ cart: { ...cart, items: cartItems.sort(this.compareItems) } });
      changeItemQuantityCart(product, quantity, cart.cartId, logToken)
        .then(this.getCart)
        .catch(error => this.showCartError('Change Item Quantity Error',error.response.data.errorMessage));
    }
  };

  getTheme = (what = 'all') => what === 'all' 
    ? this.state.theme
    : `${this.state.theme[what]}${what === 'borderRadius' ? 'px' : ''}`;

  setProducts = storeProducts => this.setState({ storeProducts });

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
          ...this.state, //all props and vals
          setPsToken: this.setPsToken,
          setProducts: this.setProducts,
          setStateFrom: this.setStateFrom,
          setInventoryItems: this.setInventoryItems,
          setEntitlementItems: this.setEntitlementItems,
          setPhysicalItems: this.setPhysicalItems,
          setPhysicalItemsError: this.setPhysicalItemsError,
          addToCart: this.addToCart,
          buyByVC: this.buyByVC,
          clearVCCart: this.clearVCCart,
          getTheme: this.getTheme,
          createCart: this.createCart,
          showCart: this.showCart,
          changeItemQuantityInCart: this.changeItemQuantityInCart,
          buyCart: this.buyCart,
          payStationHandler: this.payStationHandler,
          updateVirtualCurrencyBalance: this.updateVirtualCurrencyBalance,
          hideCart: this.hideCart,
          setVirtualItems: this.setVirtualItems,
          hideCartError: this.hideCartError,
          setVirtualItemsError: this.setVirtualItemsError,
          setSideMenuVisibility: this.setSideMenuVisibility,
          virtualCurrenciesError: this.virtualCurrenciesError,
          setVirtualCurrencies: this.setVirtualCurrencies,
        }}
      >
        <ThemeProvider theme={theme}>
          {this.props.children}
        </ThemeProvider>
      </ProductContext.Provider>
    );
  }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductContext, ProductProvider, ProductConsumer };
