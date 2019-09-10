import React, { PureComponent } from "react";

import {InventoryItem} from './InventoryItem';
import {getInventory} from './InventoryLoader';

import './InventoryList.css';

export class InventoryList extends PureComponent {
  componentDidMount() {
    if (this.props.logToken && null === this.props.inventoryItems) {
      this.updateInventory();
    }
  }

  componentWillUnmount() {
    if (null !== this.props.inventoryItems) {
      this.props.setInventoryItems(null);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.cart.cartId !== this.props.cart.cartId
        && prevProps.cart.items.length > 0) {
      this.updateInventory();
    }
  }

  updateInventory() {
    this.props.setStateFrom("fetching", true);
    getInventory(window.xProjectId, this.props.logToken)
        .then(inventoryItems => {
          this.props.setInventoryItems(inventoryItems);
        })
        .catch(() => {
          this.props.setInventoryItems([]);
        });
  }

  render() {
    const {inventoryItems} = this.props;

    return (
      <div>
        <div className="">
          <div className="inventory-list">
            {
              inventoryItems && inventoryItems.length
                ?
                inventoryItems.map(
                  (oneProduct, key) => {
                    return (
                      <InventoryItem
                        key={oneProduct.sku}
                        order={key}
                        initClass="initialFlow1"
                        title={oneProduct.name}
                        description={oneProduct.description}
                        imageUrl={oneProduct.image_url}
                        quantity={oneProduct.quantity}
                      />
                    );
                  })
                :
                <div>
                  Oops, you have nothing bought yet!
                </div>
            }
          </div>
        </div>
      </div>
    );
  }
}
