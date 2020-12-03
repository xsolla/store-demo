import React from 'react';
import styled from 'styled-components';
import ShoppingCart from '@material-ui/icons/ShoppingCart';

import { ProductCard } from '../../../components/ProductCard';
import { Currency } from '../../../components/Currency';
import { formatRealAmount } from "../../../utils/formatCurrency";


export const Bundle = React.memo(
  ({ product: bundle, order, isLoading, addToCart, buyByVC, isPurchased }) => {
    const handleBuyByVC = React.useCallback(() => buyByVC(bundle), [bundle, buyByVC]);
    const handleItemAdd = React.useCallback(() => addToCart(bundle), [bundle, addToCart]);
    const buttonAction = React.useMemo(
      () => (bundle.virtualPrice ? handleBuyByVC : handleItemAdd),
      [bundle, handleBuyByVC, handleItemAdd]
    );
    const buttonContent = React.useMemo(
      () => (bundle.virtualPrice ? 'Buy now' : <ShoppingCart />),
      [bundle]
    );

    const Price = React.useMemo(() => {
      if (isPurchased) {
        return <Purchased>Purchased</Purchased>;
      }

      if (bundle.virtualPrice) {
        const { imageUrl, amount } = bundle.virtualPrice;

        return (
          <Currency image={imageUrl} value={amount}/>
        );
      }

      if (bundle.price) {
        const { totalContentPrice } = bundle;
        const formattedOldPrice = formatRealAmount(totalContentPrice.amount);
        const formattedBundlePrice = formatRealAmount(bundle.price.amount);
        const formattedPrice = <span>{formattedBundlePrice} <s>{formattedOldPrice}</s></span>;

        return (
          <Currency currency={bundle.price.currency} value={formattedPrice}/>
        );
      }
    }, [bundle, isPurchased]);

    const renderBundleContent = (contentItems) => {
      const items = contentItems.map(({sku, name, quantity}) => (
        <li key={sku}>{name} x {quantity}</li>
      ));
      return (<ul>{items}</ul>);
    };

    const description = (
      <div>
        {bundle.description}
        {renderBundleContent(bundle.content)}
      </div>
    );
    return (
      <ProductCard
        image={bundle.imageUrl}
        name={[bundle.name]}
        order={order}
        value={Price}
        isLoading={isLoading}
        description={description}
        actionButtonContent={buttonContent}
        attributes={bundle.attributes}
        onAction={!isPurchased ? buttonAction : undefined}
      />
    );
  }
);

const Purchased = styled.div`
  color: ${({ theme }) => theme.palette.text.primary};
  opacity: 0.8;
`;
