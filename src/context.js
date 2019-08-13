import React, { Component } from "react";
import { detailProduct } from "./data";
import Cookie from "./components/Cookie";

const ProductContext = React
  .createContext
  // {setPsToken: () => {}}
  ();
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

      detailProduct: detailProduct, //TODO убрать
      psToken: "",

      theme: theme
    };
  }

  // constructor(props) {
  //   super(props);
  //   // this.dataUrl = 'https://storefront.xsolla.com/virtual-goods/?token=w9pn7QCKNLuK0X4zQ6pUqbiMaEV9GPfw';
  //   // this.dataUrl = 'https://store.xsolla.com/api/v1/project/40702/items/digital_content';
  //   // this.dataUrl = 'https://04ce9cdf-8325-47de-a11e-04d9ccbaaed2.mock.pstmn.io/api/v1/project/17558/items/digital_content';
  //   // this.dataUrl = 'https://c82d9a4f-7d0a-4a90-aef7-a891c39631e5.mock.pstmn.io/api/v1/publisher/2340/digital_content';
  //   // this.dataUrl = 'https://secure.xsolla.com/paystation2/api/virtualitems/items?access_token=mepkTkWA4JGBBMBdMBa093KJJSHjHGGK&group_id=9161';
  // }

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
    this.state.cart
      ? this.setState({
          cart: [...this.state.cart, product],
          cartShown: true
        })
      : this.setState({
          cart: [product]
        });
  };

  setGroups = function(virtualItems) {
    console.log("virtualItems ", virtualItems);
    this.setState({
      virtualItems: virtualItems,
      fetching: false
    });
  }.bind(this);

  setCurrs = function(resolvedData) {
    console.log("resolvedGroups", resolvedData["virtualItems"]);
    console.log("resolvedCurrency ", resolvedData["currency"]);
    console.log("resolvedSubscriptions ", resolvedData["subscriptions"]);
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
    console.log("virtualItems ", storeProducts);
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
          addToCart: this.props.addCart,
          getTheme: this.getTheme.bind(this),
          changeTheme: this.changeTheme,
          changeCardSize: this.changeCardSize
        }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductContext, ProductProvider, ProductConsumer };
