import React, {PureComponent} from "react";

import {getPsTokenByItem} from '../StoreLoader';
import {getPhysicalGoods} from './PhysicalListLoader';

import './PhysicalList.css';
import Product from "../../components/Product";
import {ProductConsumer} from "../../context";

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
                let options = {
                    'height': 680
                };
                window.xPayStationInit(response.data["token"], options);
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
                <ProductConsumer>
                    {
                        valueFromContext =>
                            <div className="">
                                <div className="physical-list">
                                    {
                                        physicalItems && physicalItems.length &&
                                        physicalItems
                                            .map(
                                                (oneProduct, key) => {
                                                    return (
                                                        <Product
                                                            ref={this.ProductRef}
                                                            key={oneProduct.sku}
                                                            order={key}
                                                            initClass="initialFlow1"
                                                            sku={oneProduct.sku}
                                                            title={oneProduct.name}
                                                            description={
                                                                oneProduct.description
                                                            }
                                                            price={oneProduct.price.amount}
                                                            image_url={oneProduct.image_url}
                                                            currency={
                                                                oneProduct.price.currency
                                                            }
                                                            product={oneProduct}
                                                            addToCart={
                                                                valueFromContext.addToCart
                                                            }
                                                            getTheme={valueFromContext.getTheme.bind(
                                                                this
                                                            )}
                                                            cartId={valueFromContext.cartId}
                                                            logToken={
                                                                valueFromContext.logToken
                                                            }
                                                            changeItemQuantityInCart={
                                                                valueFromContext.changeItemQuantityInCart
                                                            }
                                                            activeGroup={this.props.activeGroup}
                                                            buyByVC={
                                                                valueFromContext.buyByVC
                                                            }
                                                        />
                                                    );
                                                }
                                            )
                                    }
                                </div>
                            </div>
                    }
                </ProductConsumer>
            </div>
        );
    }
}
