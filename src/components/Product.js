import React from "react";

import styled, { css } from "styled-components";

import {makeStyles, withStyles} from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import IconAdd from "@material-ui/icons/AddBox";
import IconRem from "@material-ui/icons/IndeterminateCheckBox";
import red from "@material-ui/core/colors/red";
import ShoppingCart from "@material-ui/icons/ShoppingCart";
import IconDelete from "@material-ui/icons/Delete";
import AvatarVC from "@material-ui/core/Avatar";
import { ProductContext } from "../context";
import Colorer from "color";
import Button from "@material-ui/core/Button";
import Avatar from "./Navbar";

const styles = theme => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  cardTitle: {},
  card: {
    // minWidth: '300px',
    // height: 300,
    // marginBottom: 4 * 8,
  },
  h1: {
    fontWeight: "bold",
    fontSize: "1.2em",
    marginBottom: 1 * 8,
    color: "var(--mainDark)"
  },
  p: {
    flexGrow: 1,
    color: "var(--mainDark)"
  },
  price: {
    flexGrow: 1,
    // paddingLeft: 1 * 8,
    fontWeight: "600",
    color: "var(--mainBlue)"
  },
  media: {
    marginTop: 1 * 8,
    height: 0,
    paddingTop: "56.25%", // 16:9
    backgroundSize: "contain"
    // backgroundSize: 'cover',
    // backgroundColor: 'var(--lightBlue)',
  },
  actions: {
    display: "flex"
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  }
});

const useStyles = makeStyles({
  currencies: {
    height: 24,
    width: 24,
    marginRight: 4
  }
});

const RecipeReviewCard = ({
  addToCart = () => {
    void 0;
  },
  removeFromCart = () => {
    void 0;
  },
  changeItemQuantityInCart = () => {
    void 0;
  },
  buyByVC = () => {
    void 0;
  },
  activeGroup,
  product,
  order,
  cardType = null,
  initClass,
  image_url,
  title,
  currency,
  price,
  description,
  getTheme = () => {
    void 0;
  },
  quantity
}) => {
  const [state, setState] = React.useState({
    expanded: false,
    favorited: false,
    cardShown: false
  });

  const classes = useStyles();

  let [cartState, setCartState] = React.useState(
    cardType === "cart" ? quantity : 0
  );

  const handleCartClick = () => {
    addToCart(product);
  };

  const handleBuyByVirtualCurrency = (vcSku) => {
    buyByVC(product, vcSku);
  };

  const calcPrice = (price, q) => {
    return Math.round(price * q * 100) / 100;
  };

  React.useEffect(() => {
    // debugger;
    if (!state.cardShown) {
      setTimeout(() => {
        setState({
          cardShown: true //TODO: зачем это
        });
      }, order * 100);
    }
  });

  const hasVirtualCurrencyPrice = product.virtual_prices && product.virtual_prices.length > 0;

  return (
    <CssCardAppear className={!state.cardShown ? initClass : ""}>
      <CssCard cardType={cardType} getTheme={getTheme}>
        <CssCardMedia
          style={{}}
          image={image_url}
          theme={
            cardType === "cart" || cardType === "buy_by_vc"
              ? {
                  width: 140,
                  height: 140
                }
              : {}
          }
        />
        <CssCardContent>
          <CssCardH1>{title}</CssCardH1>
          <CssDescEllipsis>{description}</CssDescEllipsis>
        </CssCardContent>

        {cardType !== "cart" && cardType !== "buy_by_vc" && (
          <CssCardVCActions cardType={cardType} getTheme={getTheme}>
            {
              hasVirtualCurrencyPrice &&
              <AvatarVC src={product.virtual_prices[0].image_url} className={classes.currencies}/>
            }
            <CssTypographyPrice getTheme={getTheme}>
              {
                hasVirtualCurrencyPrice ?
                    product.virtual_prices[0].amount : `${currency} ${Math.round(price * 100) / 100}`
              }
            </CssTypographyPrice>
            <Button
                getTheme={getTheme}
                variant="contained"
                onClick={
                  hasVirtualCurrencyPrice ? handleBuyByVirtualCurrency.bind(this, product.virtual_prices[0].sku) : handleCartClick
                }
            >
              {
                hasVirtualCurrencyPrice ?
                    `Buy now` : <ShoppingCart />
              }
            </Button>
          </CssCardVCActions>
        )}

        {cardType === "cart" && (
          <CssCardActions cardType={cardType} getTheme={getTheme}>
            <CssCartQs>
              {quantity <= 1 && (
                <IconDelete
                  style={{
                    opacity: 0.4
                  }}
                  onClick={() => {
                    changeItemQuantityInCart(product, quantity - 1);
                  }}
                />
              )}

              {quantity > 1 && (
                <IconRem
                  style={{
                    opacity: 0.4
                  }}
                  onClick={() => {
                    changeItemQuantityInCart(product, quantity - 1);
                  }}
                />
              )}
              <CssCartQ>{quantity}</CssCartQ>
              <IconAdd
                onClick={() => {
                  changeItemQuantityInCart(product, quantity + 1);
                }}
              />
            </CssCartQs>
            <div>
              <CssTypographyPrice getTheme={getTheme}>
                {currency} {calcPrice(price, quantity)}
              </CssTypographyPrice>
            </div>

            {quantity > 1 && (
              <CssTypographyPriceSm getTheme={getTheme}>
                {currency} {Math.round(price * 100) / 100} for one item
              </CssTypographyPriceSm>
            )}
          </CssCardActions>
        )}

        <Collapse in={state.expanded} timeout="auto" unmountOnExit>
          <CardContent>{description}</CardContent>
        </Collapse>
      </CssCard>
    </CssCardAppear>
  );
};

const CssCartQs = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;
const CssCartQ = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bolder;
  min-width: 44px;
  font-size: 1.2em;
`;

const CssCardAppear = styled.div`
  position: relative;

  /* transition: all ${props => props.order + "s"} ease-in-out; */
  transition: transform 350ms ease-out, opacity 150ms ease-out;
  &.initialFlow1 {
    opacity: 0;
    transform: translateY(20px) scale(1);
  }
`;

// const CssCard = styled(Card)`
// Карточка не корзина
// Карточка корзина
const CssCard = styled.div`
  color: ${props => props.getTheme("colorText")};
  ${props =>
    !props.cardType &&
    css`
    display: flex;
    flex-direction: column;
    max-width: ${props => `${props.getTheme("cardWidth")}px`};
    min-width: ${props => `${props.getTheme("cardWidth")}px`};
    height: ${props => `${props.getTheme("cardWidth")}px`};
    /* height: 360px; */
    margin: ${2 * 8}px;
    flex-shrink: 0;
    flex-grow: 1;
    flex-base: 50%;
    background: transparent;
    /* boxShadow: none; */
    /* color: var(--mainWhite); */
    transition: box-shadow ${props => props.getTheme("transitionStyle")};
    border-radius: ${props => props.getTheme("borderRadius")}
    padding: ${props => props.getTheme("padding")};
  `}

  ${props =>
    props.cardType &&
    css`
      display: grid;
      grid-template-columns: 20% 50% 30%;
      grid-template-rows: 160px;
      place-content: center;
    `}
  &:hover {
    ${props => {
      return (
        !props.cardType &&
        css`
          box-shadow: ${props => props.getTheme("boxShadow")};
        `
      );
    }}
  }
`;

const CssDescEllipsis = styled.div`
  display: block; /* Fallback for non-webkit */
  display: -webkit-box;
  /* max-height: 120px; */
  width: 100%;
  display: block; /* Fallback for non-webkit */
  display: -webkit-box;
  max-width: 400px;
  margin: 0 auto;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CssCardContent = styled(CardContent)`
  min-height: 66px;
  overflow: hidden;
  flex-grow: 0;
  padding-bottom: 0 !important;
  margin-bottom: 8px;
`;

const CssCardH1 = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

// Кнопки не корзина
// Кнопки корзина
// const CssCardActions = styled(CardActions)`
const CssCardActions = styled.div`
  ${props =>
    !props.cardType &&
    css`
      display: flex;
      align-items: center;
      border-top: 1px solid
        ${props =>
          Colorer(props.getTheme("colorText"))
            .alpha(0.1)
            .string()};
      padding: 8px 0 0 0;
      margin: 0px 16px 0 16px;
    `}
  ${props =>
    props.cardType &&
    css`
      padding: 16px 0;
      width: 160px;
      display: grid;
      grid-template-columns: auto;
      grid-row-gap: 8px;
      place-content: start start;
    `}
`;

const CssCardVCActions = styled.div`
  ${props =>
    !props.cardType &&
    css`
      display: flex;
      align-items: center;
      border-top: 1px solid
        ${props =>
        Colorer(props.getTheme("colorText"))
            .alpha(0.1)
            .string()};
      padding: 8px 0 0 0;
      margin: 0px 16px 0 16px;
    `}
  ${props =>
    props.cardType &&
    css`
      padding: 16px 0;
      width: 160px;
      display: grid;
      grid-template-columns: auto;
      grid-row-gap: 8px;
      place-content: start start;
    `}
`;

const CssCardMedia = styled.div`
  display: block;
  /* height: 0; */
  margin-top: 8px;
  min-height: 120px;
  flex-grow: 1;
  /* padding-top: 56.25%; */
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${props => props.image});
`;

const CssTypographyPrice = styled.div`
  flex-grow: 1;
  color: ${props => props.getTheme("colorAccent")};
  font-weight: 600;
`;

const CssTypographyPriceSm = styled.div`
  flex-grow: 1;
  font-size: 0.8em;
  /* color: ${props => props.getTheme("colorAccent")}; */
  /* font-weight: 600; */
  opacity: 0.3;
`;

export default withStyles(styles)(RecipeReviewCard);
