import React, { PureComponent } from "react";

import {InventoryItem} from './InventoryItem';
import {getInventory} from './InventoryLoader';
import { init } from 'store-js-sdk/src/init';

import './InventoryList.css';
import {Inventory} from "store-js-sdk/src/inventory/inventory";

export class InventoryList extends PureComponent {
  componentDidMount() {
      if (this.props.logToken && null === this.props.inventoryItems) {
        this.updateInventory();
        this.props.updateVirtualCurrencyBalance();
      }
  }

  componentWillUnmount() {
    if (null !== this.props.inventoryItems) {
      this.props.setInventoryItems(null);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
        (prevProps.cart.cartId !== this.props.cart.cartId
        && prevProps.cart.items.length > 0)
        || (
            this.props.cartWithItemsBuyingByVC.items.length !== prevProps.cartWithItemsBuyingByVC.items.length
        )
    ) {
      this.updateInventory();
    }
  }

  updateInventory() {
    this.props.setStateFrom("fetching", true);

    let token = this.props.logToken;
    init({
      projectId: window.xProjectId,
      version: 'v2'
    });

    getInventory(window.xProjectId, this.props.logToken)
        .then(inventoryItems => {
          this.props.setInventoryItems(inventoryItems);
        })
        .catch(() => {
          this.props.setInventoryItems([]);
        });
  }

  consumeItem(item) {
    let token = this.props.logToken;

    init({
      projectId: window.xProjectId,
      version: 'v2'
    });

    const inventory = new Inventory(token);

    inventory.consumeItem(item.sku, 1, item.instance_id)
        .finally(() => {
          this.props.setStateFrom("fetching", true);
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
                inventoryItems
                    .filter(product => product.type === 'virtual_good')
                    .map(
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
                            remainingUses={oneProduct.remaining_uses}
                            handleConsumeItem={() => this.consumeItem(oneProduct)}
                          />
                        );
                      }
                    )
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
