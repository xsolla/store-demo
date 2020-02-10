import React from "react";
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
  constructor(props) {
    super(props);

    this.state = {
      projectId: props.projectId,
      logToken: Cookie(),
      userBalanceVirtualCurrency: [],
      activeGroup: 'first',
      loginShown: true,
      activeModule: 'virtualItems',
      virtualItems: [],
      virtualCurrencyPackages: null,
      currency: null,
      subscriptions: null,
      inventoryItems: null,
      entitlementItems: null,
      physicalItems: null,
      cartShown: false,
      isSideMenuShown: false,
      cart: {
        cartId: null,
        items: [],
        price: {
          amount: 0,
          amount_without_discount: 0
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
  }

  showCart = () => this.setState({ cartShown: !this.state.cartShown });

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
      fetching: false
    })
  };

  setEntitlementItems = entitlementItems => {
    this.setState({
      entitlementItems,
      fetching: false
    })
  };

  setPhysicalItems = physicalItems => {
    this.setState({
      physicalItems,
      fetching: false
    })
  };

  getCart = () => {
    const cartPromise = getCart(this.state.cart.cartId, this.state.logToken);
    cartPromise.then(response => {
      if (!cartPromise.isCancel && response) {
        this.setState({
          cart: {
            cartId: response.data["cart_id"],
            items: response.data["items"].sort(this.compareItems),
            price: response.data["price"]
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
          cartId: response.data["id"],
          items: [],
          price: {
            amount: 0,
            amount_without_discount: 0
          }
        }
      });
    });
  };

  changeTheme = newTheme => {
    if (typeof newTheme === "string") {
      this.setState({
        theme: {
          ...this.state.theme,
          colorBg: newTheme
        }
      });
    } else {
      this.setState(
        {
          theme: {
            ...this.state.theme,
            ...newTheme
          }
        },
      );
    }
  };

  changeCardSize = newSize => {
    const newTheme = this.state.theme;
    newTheme["cardWidth"] = newSize;
    this.changeTheme(newTheme);
  };

  clearCart = () => {
    this.showCart();
    this.createCart();
    this.updateVirtualCurrencyBalance();
  };

  payStationHandler = () => {
    this.clearCart();
  };

  setPsToken = psToken => {
    this.setState({ psToken });
  };

  handleDetail = () => {
    console.log("hello from handleDetail");
  };

  setStateFrom = (stateName, stateValue) => {
    this.setState({ [stateName]: stateValue });
  };

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
    if (this.state.cart) {
      const indexFind = this.state.cart.items.findIndex(elem => elem.sku === product.sku);
      if (indexFind !== -1) {
        this.getCart();
        this.setState({
          cartShown: true
        });
      } else {
        this.setState({
          isFetching: true,
          cart: {
            ...this.state.cart,
            items: [{ ...product, quantity: 1 }, ...this.state.cart.items].sort(
              this.compareItems
            ),
            price: {
              ...this.state.cart.price,
              amount:
                this.state.cart.price &&
                this.state.cart.price.amount + product.price.amount,
              amount_without_discount:
                this.state.cart.price &&
                this.state.cart.price.amount_without_discount +
                  product.price.amount_without_discount
            }
          }
        });
        changeItemQuantityCart(
          product,
          1,
          this.state.cart.cartId,
          this.state.logToken
        ).then(response => {
          this.getCart();
        }).catch(error => {
          this.showCartError('Change Item Quantity Error',error.response.data.errorMessage);
        });
        this.showCart();
      }
    } else {
      this.setState({ isFetching: true });
      changeItemQuantityCart(
        product,
        1,
        this.state.cart.cartId,
        this.state.logToken
      ).then(getCart
      ).catch(error => {
        this.showCartError('Change Item Quantity Error',error.response.data.errorMessage);
      });
      this.showCart();
    }
  };

  removeFromCart = product => {
    if (this.state.cart) {
      this.setState({
        isFetching: true,
        cart: {
          ...this.state.cart,
          items: this.state.cart.items
            .filter(function(prod) {
              return prod.sku !== product.sku;
            })
            .sort(this.compareItems),
          price: {
            ...this.state.cart.price,
            amount:
              this.state.cart.price.amount -
              product.price.amount * product.quantity,
            amount_without_discount:
              this.state.cart.price.amount_without_discount -
              product.price.amount_without_discount * product.quantity
          }
        }
      });
    }
  };

  changeItemQuantityInCart = (product, quantity) => {
    if (quantity <= 0) {
      this.removeFromCart(product);
      removeItemFromCart(
        product,
        this.state.cart.cartId,
        this.state.logToken
      ).then(() => {
        this.getCart();
      });
    } else {
      let indexFind = this.state.cart.items.findIndex(elem => {
        return elem.sku === product.sku;
      });
      let cartItems = this.state.cart.items;
      cartItems.splice(indexFind, 1, {
        ...product,
        quantity: quantity
      });
      this.setState({
        isFetching: true,
        cart: {
          ...this.state.cart,
          items: cartItems.sort(this.compareItems)
        }
      });
      changeItemQuantityCart(
        product,
        quantity,
        this.state.cart.cartId,
        this.state.logToken
      ).then(() => {
        this.getCart();
      }).catch(error => {
        this.showCartError('Change Item Quantity Error',error.response.data.errorMessage);
      });
    }
  };

  hideCart = () => {
    this.setState({
      cartShown: false,
      cartWithItemsBuyingByVCShown: false
    })
  };

  setGroups = virtualItems => this.setState({ virtualItems, fetching: false });

  setCurrs = resolvedData => {
    this.setState({
      fetching: false,
      virtualItems: resolvedData['virtualItems'],
      currency: resolvedData['currency'],
      subscriptions: resolvedData['subscriptions'],
      virtualCurrencyPackages: resolvedData['virtualCurrencyPackages'],
    });
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
          handleDetail: this.handleDetail,
          setPsToken: this.setPsToken,
          setGroups: this.setGroups,
          setProducts: this.setProducts,
          setStateFrom: this.setStateFrom,
          setCurrs: this.setCurrs,
          setInventoryItems: this.setInventoryItems,
          setEntitlementItems: this.setEntitlementItems,
          setPhysicalItems: this.setPhysicalItems,
          addToCart: this.addToCart,
          buyByVC: this.buyByVC,
          clearVCCart: this.clearVCCart,
          getTheme: this.getTheme,
          changeTheme: this.changeTheme,
          changeCardSize: this.changeCardSize,
          createCart: this.createCart,
          showCart: this.showCart,
          changeItemQuantityInCart: this.changeItemQuantityInCart,
          buyCart: this.buyCart,
          payStationHandler: this.payStationHandler,
          updateVirtualCurrencyBalance: this.updateVirtualCurrencyBalance,
          hideCart: this.hideCart,
          hideCartError: this.hideCartError,
          setSideMenuVisibility: this.setSideMenuVisibility,
        }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductContext, ProductProvider, ProductConsumer };
