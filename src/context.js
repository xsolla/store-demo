import React, { Component } from "react";
import Cookie from "./components/Cookie";
import {
  changeItemQuantityCart,
  createCart,
  removeItemFromCart,
  getCart, getVirtualCurrencyBalance
} from "./components/StoreLoader";

const ProductContext = React.createContext();
//Provider
//Consumer

const theme = {
  colorText: "#D6E0E7",
  colorAccent: "#FF005B",
  colorAccentText: "#F6FAFF",
  colorBg: "#011627",
  colorSecondary: "#495C6B", //TODO: delete

  borderRadius: 8,
  backgroundUrl:
    "https://res.cloudinary.com/maiik/image/upload/v1549624607/Xsolla/HomePage_Hero_Illustration_1440_oabqmk.jpg",

  cardWidth: "300",

  boxShadow: "0 5px 12px 0px rgba(0,0,0,0.2)",
  padding: "8px",
  transitionTime: "0.3s",
  transitionEasing: "ease-in-out",
  transition: `all 0.3s ease-in-out`,
  // transition: `all ${theme['transitionTime']} ${theme['transitionTime']}`,
  transitionStyle: "0.3s ease-in-out",
  fontFamily:
    '"Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"'
};

class ProductProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projectId: props.projectId,
      logToken: Cookie(),
      userBalanceVirtualCurrency: [],

      activeGroup: "first",
      loginShown: true,
      activeModule: "virtualItems",
      virtualItems: null,
      virtualCurrencyPackages: null,
      currency: null,
      subscriptions: null,
      inventoryItems: null,

      cartShown: false,
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

      isFetching: false,

      psToken: "",

      theme: theme
    };
  }

  showCart = () => {
    this.setState({
      cartShown: !this.state.cartShown
    });
  };

  setInventoryItems = (inventoryItems) => {
    this.setState({
      inventoryItems,
      fetching: false
    })
  };

  getCart = () => {
    let cartPromise = getCart(this.state.cart.cartId, this.state.logToken);
    cartPromise.then(response => {
      if (!cartPromise.isCancel && response) {
        this.setState(prevState => ({
          cart: {
            cartId: response.data["cart_id"],
            items: response.data["items"].sort(this.compareItems),
            price: response.data["price"]
          },
          isFetching: false
        }));
      }
    });
  };

  createCart = function() {
    let cartIdPromise = createCart(this.state.logToken);
    cartIdPromise.then(response => {
      this.setState(prevState => ({
        cart: {
          cartId: response.data["id"],
          items: [],
          price: {
            amount: 0,
            amount_without_discount: 0
          }
        }
      }));
    });
  }.bind(this);

  changeTheme = newTheme => {
    let newColor = null;
    if (typeof newTheme === "string") {
      newColor = newTheme;
      this.setState({
        ...this.state,
        theme: {
          ...this.state.theme,
          colorBg: newColor
        }
      });
    } else {
      this.setState(
        {
          ...this.state,
          theme: {
            ...this.state.theme,
            ...newTheme
          }
        },
        () => {}
      );
    }
  };

  changeCardSize = newSize => {
    let newTheme = this.state.theme;
    newTheme["cardWidth"] = newSize;
    this.changeTheme(newTheme);
  };

  clearCart = () => {
    this.showCart();
    this.createCart();
    this.updateVirtualCurrencyBalance();
  };

  payStationHandler = (event, data) => {
    this.clearCart();
  };

  setPsToken = function(psToken) {
    this.setState({ psToken: psToken });
  }.bind(this);

  handleDetail = () => {
    console.log("hello from handleDetail");
  };

  setStateFrom = function(stateName, stateValue) {
    this.setState({
      ...this.state,
      [stateName]: stateValue
    });
  }.bind(this);

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
      let indexFind = this.state.cart.items.findIndex(elem => {
        return elem.sku === product.sku;
      });
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
      ).then(response => {
        this.getCart();
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
      });
    }
  };

  hideCart = function () {
    this.setState({
      cartShown: false,
      cartWithItemsBuyingByVCShown: false
    })
  }.bind(this);

  setGroups = function(virtualItems) {
    this.setState({
      virtualItems: virtualItems,
      fetching: false
    });
  }.bind(this);

  setCurrs = function(resolvedData) {
    this.setState({
      fetching: false,
      virtualItems: resolvedData["virtualItems"],
      currency: resolvedData["currency"],
      subscriptions: resolvedData["subscriptions"],
      virtualCurrencyPackages: resolvedData["virtualCurrencyPackages"],
    });
  }.bind(this);

  getTheme = (what = "all") => {
    if (what === "all") {
      return this.state.theme;
    }
    return `${this.state.theme[what]}${what === "borderRadius" ? "px" : ""}`;
  };

  setProducts = function(storeProducts) {
    this.setState({
      storeProducts: storeProducts
    });
  }.bind(this);

  componentWillUpdate(nextProps, nextState) {}

  updateVirtualCurrencyBalance = () => {
    getVirtualCurrencyBalance(this.state.logToken).then((reps) => {
      this.setState({
        userBalanceVirtualCurrency: reps.data.items
      });
    });
  };

  componentDidMount() {}

  render() {
    // (this.state.storeProducts) && this.loadFromPS()

    return (
      <ProductContext.Provider
        value={{
          // products: this.state.products, //full
          ...this.state, //all props and vals
          handleDetail: this.handleDetail,
          setPsToken: this.setPsToken,
          setGroups: this.setGroups,
          setProducts: this.setProducts,
          setStateFrom: this.setStateFrom,
          setCurrs: this.setCurrs,
          setInventoryItems: this.setInventoryItems,
          addToCart: this.addToCart,
          buyByVC: this.buyByVC,
          clearVCCart: this.clearVCCart,
          getTheme: this.getTheme.bind(this),
          changeTheme: this.changeTheme,
          changeCardSize: this.changeCardSize,
          createCart: this.createCart,
          showCart: this.showCart,
          changeItemQuantityInCart: this.changeItemQuantityInCart,
          buyCart: this.buyCart,
          payStationHandler: this.payStationHandler,
          updateVirtualCurrencyBalance: this.updateVirtualCurrencyBalance,
          hideCart: this.hideCart
        }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductContext, ProductProvider, ProductConsumer };
