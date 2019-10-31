import React, { PureComponent } from "react";

import {PhysicalItem} from './PhysicalItem';
import {getPsTokenByItem} from '../StoreLoader';
import {getPhysicalGoods} from './PhysicalListLoader';
// import physicalItems from './PhysicalList.json';

import './PhysicalList.css';
import {getInventory} from "../inventory/InventoryLoader";

export class PhysicalList extends PureComponent {
  constructor() {
    super();
    
    this.state = {
      isPurchasing: false
    }
  }
  
  componentDidMount() {
    if (this.props.logToken && null === this.props.physicalItems) {
      this.updateCatalogue();
      this.props.updateVirtualCurrencyBalance();
    }
  }
  
  componentWillUnmount() {
    if (null !== this.props.physicalItems) {
      this.props.setPhysicalItems(null);
    }
  }
  
  updateCatalogue() {
    getPhysicalGoods(window.xProjectId, this.props.logToken)
        .then(physicalItems => {
          this.props.setPhysicalItems(physicalItems);
        })
        .catch(() => {
          this.props.setPhysicalItems([]);
        });
  }
  
  buyItem(item) {
    if (this.state.isPurchasing) {
      return;
    }
    
    const {logToken} = this.props;
    this.setState({
      isPurchasing: true
    })
    getPsTokenByItem(item, logToken)
      .then(response => {
        window.xPayStationInit(response.data["token"]);
        window.XPayStationWidget.open();
        window.XPayStationWidget.on(
          window.XPayStationWidget.eventTypes.CLOSE,
          () => {
            this.setState({
              isPurchasing: false
            });
          }
        );
      })
      .catch(e => {
        this.setState({
          isPurchasing: false
        })
      });
  };
  
  render() {
    const {physicalItems} = this.props;
    
    return (
      <div>
        <div className="">
          <div className="physical-list">
            {
              physicalItems && physicalItems.length &&
                physicalItems
                  .map(
                    (oneProduct, key) => {
                      return (
                        <PhysicalItem
                          key={oneProduct.sku}
                          order={key}
                          initClass="initialFlow1"
                          title={oneProduct.name}
                          description={oneProduct.description}
                          imageUrl={oneProduct.image_url}
                          quantity={oneProduct.quantity}
                          currency={oneProduct.price.currency}
                          price={oneProduct.price.amount}
                          handleBuyByRealCurrency={() => this.buyItem(oneProduct)}
                        />
                      );
                    }
                  )
            }
          </div>
        </div>
      </div>
    );
  }
}
