import React from "react";
import styled from "styled-components";

import { ProductContext } from "../../context";
import MenuMaterial from "../../components/MenuMaterial";
import StoreLoader from "../../components/StoreLoader";
import { VirtualItem } from './VirtualItem';

const VirtualList = () => {
  const {
    logToken,
    virtualItems,
    activeModule,
    activeGroup,
    getTheme,
    addToCart,
    buyByVC,
    setStateFrom,
    setCurrs,
    fetching,
    updateVirtualCurrencyBalance,
  } = React.useContext(ProductContext);

  const handleGroupChange = newActive => setStateFrom("activeGroup", newActive);

  React.useEffect(() => {
    if (!fetching && logToken && virtualItems.length === 0) {
      setStateFrom("fetching", true);
      StoreLoader(window.xProjectId, logToken).then(setCurrs);
      updateVirtualCurrencyBalance();
    }
  });

  return (
    <CssStore color={getTheme("colorText")}>
      {activeModule === "virtualItems" && virtualItems.length > 0 && (
        <div>
          <CssMenu>
            <MenuMaterial
              virtualItems={virtualItems}
              activeGroup={activeGroup}
              changeGroupHandler={handleGroupChange}
            />
          </CssMenu>
          {virtualItems.map((group, key) => {
            if (
              (activeGroup === "first" && key === 0) ||
              activeGroup === "all" ||
              activeGroup === group.id ||
              activeGroup === group.name
            ) {
              return (
                <div key={group.name}>
                  <СssTitle color={getTheme("colorText")}>
                    {group.name}
                  </СssTitle>
                  <СssGroup>
                    {group.products && group.products.map((product, key) => (
                      <VirtualItem
                        key={product.sku}
                        product={product}
                        order={key}
                        addToCart={addToCart}
                        getTheme={getTheme}
                        buyByVC={buyByVC}
                      />
                    ))}
                  </СssGroup>
                </div>
              );
            }
          })}
        </div>
      )}
    </CssStore>
  );
}

const CssStore = styled.div`
  color: ${props => props.color};
  position: relative;
  background-color: transparent;
  z-index: 4;
`;

const CssMenu = styled.div`
  flex-grow: 1;
  margin: 24px 0;
`;

const СssGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  place-content: center;
`;

const СssTitle = styled.div`
  color: ${props => props.color};
  padding-top: 2em;
  min-height: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  font-size: 1.2em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export { VirtualList };
