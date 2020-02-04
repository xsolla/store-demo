import React, {PureComponent} from "react";

import './ServerPurchase.css';
import Product from "../../components/Product";
import {CssCartList, CssSubtotal} from "../../components/Cart";
import {getFormattedCurrency} from "../../components/formatCurrency";
import Button from "@material-ui/core/Button";
import {purchaseItems} from "./ServerPurchaseLoader";
import Alert from "react-bootstrap/Alert";

export class ServerPurchase extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            showToast: false,
            statusToast: 'processing',
            operations: null
        }
    }

    calculateSubtotal = cart => {
        let subtotal = 0;
        cart.forEach(function (element) {
            subtotal += element.price.amount * element.quantity;
        });
        return Math.round(subtotal * 100) / 100;
    };

    generateUUID() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    setShowToast(isVisible) {
        this.setState({showToast: isVisible});
    }

    purchase() {
        let {cart} = this.props;

        const body = {
            type: "purchase",
            user: "d342dad2-9d59-11e9-a384-42010aa8003f",
            platform: "playstation_network",
            purchase: {
                amount: cart.price.amount,
                currency: cart.price.currency,
                external_purchase_id: this.generateUUID(),
                external_purchase_date: (new Date()).toISOString()
            },
            items: cart.items.map((cartItem) => {
                return {
                    sku: cartItem.sku,
                    quantity: cartItem.quantity
                }
            })
        };
        this.setState({showToast: true, statusToast: 'processing', operationDetails: null});
        purchaseItems(body)
            .then(response => {
                this.setState({
                    showToast: true,
                    statusToast: 'complete',
                    operations: response.operations
                });
            })
            .catch(() => {
            });
    }

    render() {
        const {cart, logToken, removeFromCart, changeItemQuantityInCart, isFetching} = this.props;
        const {operations, showToast, statusToast} = this.state;

        return (
            <div>
                <div className="server-purchase__alert">
                    <Alert onClose={(e) => this.setShowToast(false)} show={showToast}
                           variant={statusToast === 'processing' ? "primary" : "success"} dismissible>
                        <Alert.Heading>{statusToast === 'processing' ? 'Operation is processing' : 'Operation complete!'}</Alert.Heading>
                        {
                            operations && operations.length ?
                                operations.map(
                                    (operation) => {
                                        return operation.items.map(
                                            (item, index) => {
                                                return (
                                                    <div key={index}>
                                                        <div>Item: <b>{item.sku}</b></div>
                                                        <div>Quantity: <b>{item.quantity === null ? 0 : item.quantity}</b>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        )
                                    })
                                :
                                ''
                        }
                    </Alert>
                </div>
                <div className="server-purchase">
                    <CssCartList>
                        {cart && cart.items.map((oneCartItem, i) => {
                            return (
                                <div key={`cartitem${i}`}>
                                    <Product
                                        product={oneCartItem}
                                        key={oneCartItem.sku}
                                        order={i}
                                        initClass="initialFlow1"
                                        sku={oneCartItem.sku}
                                        title={oneCartItem.name}
                                        description={oneCartItem.description}
                                        price={oneCartItem.price.amount}
                                        image_url={oneCartItem.image_url}
                                        currency={oneCartItem.price.currency}
                                        cardType="cart"
                                        cartId={cart.cartId}
                                        logToken={logToken}
                                        removeFromCart={removeFromCart}
                                        changeItemQuantityInCart={changeItemQuantityInCart}
                                        quantity={oneCartItem.quantity}
                                    />
                                </div>
                            );
                        })}
                        {cart && cart.items.length <= 0 && <div>Oops, you have empty cart!</div>}
                    </CssCartList>
                    <div className=""/>
                    {cart && cart.items.length > 0 && (
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <CssSubtotal style={{paddingTop: "7px"}}>
                                Subtotal:
                                <div
                                    style={{
                                        minWidth: 80,
                                        textAlign: "right"
                                    }}
                                >
                                    {isFetching &&
                                    getFormattedCurrency(
                                        this.calculateSubtotal(cart.items),
                                        cart.items[0].price.currency
                                    ).formattedCurrency}
                                    {!isFetching &&
                                    getFormattedCurrency(
                                        cart.price.amount,
                                        cart.price.currency
                                    ).formattedCurrency}
                                </div>
                            </CssSubtotal>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    this.purchase(cart)
                                }}
                            >
                                Grant purchase
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
