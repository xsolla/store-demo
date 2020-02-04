import React from "react";
import styled, { css } from "styled-components";
import Colorer from "color";
import Dotdotdot from 'react-dotdotdot'

import { makeStyles } from "@material-ui/core/styles";
import Collapse from "@material-ui/core/Collapse";
import CardContent from "@material-ui/core/CardContent";
import ShoppingCart from "@material-ui/icons/ShoppingCart";
import AvatarVC from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
  currencies: {
    height: 24,
    width: 24,
    marginRight: 4
  }
});

const ProductCard = ({
  product,
  order,
  addToCart,
  buyByVC,
  getTheme,
}) => {
  const classes = useStyles();
  const hasVirtualCurrencyPrice = product.virtual_prices && product.virtual_prices.length > 0;
  const [isHovered, setHovered] = React.useState(false);
  const [cardShown, setCardShown] = React.useState(false);

  const handleCartClick = () => addToCart(product);
  const handleBuyByVirtualCurrency = () => buyByVC(product, product.sku);
  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);

  React.useEffect(() => {
    if (!cardShown) {
      setTimeout(() => setCardShown(true), order * 100);
    }
  });

  return (
    <CssCardAppear hovered={isHovered} getTheme={getTheme} shown={cardShown}>
      <CssCard
        getTheme={getTheme}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <CssCardMedia image={product.image_url}/>
        <CssCardContent>
          <CssCardH1>{product.name}</CssCardH1>
          <Collapse in={isHovered} timeout="auto" collapsedHeight="50px">
            {isHovered ? (
              product.description
            ) : (
              <Dotdotdot animate clamp={2}>
                {product.description}
              </Dotdotdot>
            )}
          </Collapse>
        </CssCardContent>
        <CssCardVCActions getTheme={getTheme}>
          {hasVirtualCurrencyPrice && <AvatarVC src={product.virtual_prices[0].image_url} className={classes.currencies}/>}
          <CssTypographyPrice getTheme={getTheme}>
            {hasVirtualCurrencyPrice
              ? product.virtual_prices[0].amount
              : `${product.price.currency} ${Math.round(product.price.amount * 100) / 100}`
            }
          </CssTypographyPrice>
          <Button
            getTheme={getTheme}
            variant="contained"
            onClick={hasVirtualCurrencyPrice ? handleBuyByVirtualCurrency : handleCartClick}
          >
            {hasVirtualCurrencyPrice ? 'Buy now' : <ShoppingCart />}
          </Button>
        </CssCardVCActions>
      </CssCard>
    </CssCardAppear>
  );
};

const CssCardAppear = styled.div`
  position: relative;
  width: ${props => `${props.getTheme("cardWidth")}px`};
  height: ${props => `${props.getTheme("cardWidth")}px`};
  padding: ${props => props.getTheme("padding")};
  margin: 16px;
  transition: transform 350ms ease-out, opacity 150ms ease-out;
  ${props => !props.shown && css`
    opacity: 0;
    transform: translateY(20px) scale(1);`
  }
`;

const CssCard = styled.div`
  position: absolute;
  z-index: ${props => props.hovered ? 1 : 0};
  color: ${props => props.getTheme("colorText")};
  display: flex;
  flex-direction: column;
  width: ${props => `${props.getTheme("cardWidth")}px`};
  min-height: ${props => `${props.getTheme("cardWidth")}px`};
  flex-shrink: 0;
  flex-grow: 1;
  flex-base: 50%;
  background: transparent;
  transition: box-shadow, background ${props => props.getTheme("transitionStyle")};
  border-radius: ${props => props.getTheme("borderRadius")};
  padding: ${props => props.getTheme("padding")};

  &:hover {
    background: ${props => props.getTheme("colorBg")};
    box-shadow: ${props => props.getTheme("boxShadow")};
  }
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
  margin-top: 8px;
  min-height: 120px;
  flex-grow: 1;
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

export default ProductCard;
