import React, { Component } from "react";
import Cookie from "./components/Cookie";
import {changeItemQuantityCart, createCart, removeItemFromCart, getPsTokenBuyCart} from "./components/StoreLoader";

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
      logToken: Cookie(),

      activeGroup: "first",
      loginShown: true,
      activeModule: "virtualItems",
      virtualItems: null,
      currency: null,
      subscriptions: null,

      cartShown: false,
      cart: [],
      cartId: null,

      psToken: "",

      theme: theme
    };
  }

  showCart = () => {
    this.setState({
      cartShown: !this.state.cartShown
    })
  };

  createCart = function() {
    let cartIdPromise = createCart(this.state.logToken);
    cartIdPromise.then(response => {
        this.setState({
          cartId: response.data["id"],
          cart: []
        });
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
  };

  payStationHandler = (event, data) => {
    this.clearCart();
  };

  buyCart = () => {
    let psTokenPromise = getPsTokenBuyCart(this.state.cartId, this.state.logToken);
    psTokenPromise.then(response => {
      this.setState({psToken: response.data["token"]});
      window.xPayStationInit(this.state.psToken);
      window.XPayStationWidget.open();
      window.XPayStationWidget.on(window.XPayStationWidget.eventTypes.STATUS_DONE, (event, data) => this.payStationHandler(event, data));
    });
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

  addToCart = product => {
    if (this.state.cart) {
      let indexFind = this.state.cart.findIndex(elem => {
        return elem.product === product;
      });
      if (indexFind !== -1) {
        // let cart = this.state.cart;
        // cart.splice(
        //     indexFind,
        //     1,
        //     {
        //       product: product,
        //       quantity: this.state.cart[indexFind].quantity + 1
        //     }
        // );
        // this.setState({
        //   cart: cart,
        //   cartShown: true
        // });
        // changeItemQuantityCart(product, cart[indexFind].quantity, this.state.cartId, this.state.logToken);
        this.setState({
          cartShown: true
        });
      } else {
        this.setState({
          cart: [...this.state.cart,  { product: product, quantity: 1 }],
          cartShown: true
        });
        changeItemQuantityCart(product, 1, this.state.cartId, this.state.logToken);
      }
    } else {
      this.setState({
        cart: [{ product: product, quantity: 1 }]
      });
      changeItemQuantityCart(product, 1, this.state.cartId, this.state.logToken);
    }
  };

  removeFromCart = product => {
    if (this.state.cart) {
      this.setState({
        cart: this.state.cart.filter(function (prod) {
          return prod.product !== product;
        })
      });
    }
  };

  changeItemQuantityInCart = (product, quantity) => {
    if (quantity <= 0) {
      removeItemFromCart(product, this.state.cartId, this.state.logToken);
      this.removeFromCart(product);
    } else {
      let indexFind = this.state.cart.findIndex(elem => {
        return elem.product === product;
      });
      let cart = this.state.cart;
      cart.splice(
          indexFind,
          1,
          {
            product: product,
            quantity: quantity
          }
      );
      this.setState({
        cart: cart
      });
      changeItemQuantityCart(product, quantity, this.state.cartId, this.state.logToken);
    }
  };

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
      subscriptions: resolvedData["subscriptions"]
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
          addToCart: this.addToCart,
          getTheme: this.getTheme.bind(this),
          changeTheme: this.changeTheme,
          changeCardSize: this.changeCardSize,
          createCart: this.createCart,
          removeFromCart: this.removeFromCart,
          showCart: this.showCart,
          changeItemQuantityInCart: this.changeItemQuantityInCart,
          buyCart: this.buyCart
        }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductContext, ProductProvider, ProductConsumer };
