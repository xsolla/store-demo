import React, { PureComponent } from "react";
import Button from "@material-ui/core/Button";
import IconAdd from "@material-ui/icons/AddBox";
import IconRem from "@material-ui/icons/IndeterminateCheckBox";
import styled  from "styled-components";
import Alert from 'react-bootstrap/Alert';

import { getVirtualItemList, rewardItems } from './ManageInventoryLoader'

import './ManageInventory.css';

export class ManageInventory extends PureComponent {
    constructor() {
        super();

        const users = [
            {
                'id': 'd342dad2-9d59-11e9-a384-42010aa8003f',
                'name': 'support@xsolla.com'
            },
            {
                'id': '7d8b1f52-7d3f-400b-acd8-46e3a4368596',
                'name': 'v.legotkin@xsolla.com'
            },
            {
                'id': '27bc1227-48a3-4da8-bb86-f8d093f68805',
                'name': 'r.ushakov@xsolla.com'
            },
            {
                'id': 'a7d10a4e-3f68-43cc-a6b2-893d2c68fd14',
                'name': 'p.sanachev@xsolla.com'
            },
        ]
        this.state = {
            isPurchasing: false,
            inventoryItem: 'helmet_1',
            quantity: 1,
            users: users,
            user: 'd342dad2-9d59-11e9-a384-42010aa8003f',
            showToast: false,
            statusToast: 'processing',
            operationDetails: null
        }
    }

    componentDidMount() {
        if (null === this.props.manageInventoryItems) {
            this.getItems();
            this.props.updateVirtualCurrencyBalance();
        }
    }

    getItems() {
        this.props.setStateFrom("fetching", true);

        getVirtualItemList(window.xProjectId)
            .then(virtualItemsList => {
                this.props.setManageInventoryItems(virtualItemsList);
            })
            .catch(() => {
            });
    }

    changeInventoryItem(event) {
        this.setState({inventoryItem: event.target.value});
    }

    changeUser(event) {
        this.setState({user: event.target.value});
    }

    setItemQuantity(quantity) {
        if(quantity >= 1) {
            this.setState({quantity: quantity});
        }
    }

    setShowToast(isVisible) {
        this.setState({showToast: isVisible});
    }

    itemOperation (type) {
        const body = {
            type: type,
            user: this.state.user,
            item : this.state.inventoryItem,
            count: this.state.quantity
        }

        this.setState({showToast: true, statusToast: 'processing', operationDetails: null});
        rewardItems(body)
            .then(response => {
                this.setState({
                    showToast: true,
                    statusToast: 'complete',
                    operationDetails: response.operations[0].items
                });
            })
            .catch(() => {
            });
    }

    rewardItem (e) {
        this.itemOperation('reward');
    }

    revokeItem() {
        this.itemOperation('revoke');
    }

    render() {
        const {manageInventoryItems} = this.props;
        const {quantity, users, showToast, statusToast, operationDetails} = this.state;

        return (
            <div className="manage-inventory__row">
                <div className="manage-inventory__alert">
                    <Alert onClose={(e) => this.setShowToast(false)} show={showToast} variant={statusToast === 'processing' ? "primary" : "success"} dismissible>
                        <Alert.Heading>{statusToast === 'processing' ? 'Operation is processing': 'Operation complete!' }</Alert.Heading>
                        <p>
                            {
                                operationDetails && operationDetails.length ?
                                    operationDetails.map(
                                        (item) => {
                                            return (
                                                <div>
                                                    <div>Item: <b>{
                                                        manageInventoryItems.filter((inventoryItem) => {
                                                            return inventoryItem.sku === item.sku
                                                        }).map((inventoryItem) => {
                                                            return inventoryItem.name;
                                                        })
                                                    }</b></div>
                                                    <div>Quantity: <b>{item.quantity === null ? 0 : item.quantity}</b></div>
                                                </div>
                                            )
                                        })
                                    :
                                    ''
                            }
                        </p>
                    </Alert>
                </div>
                <div className="">
                    <div className="manage-inventory">
                        <div className="manage-inventory__user-list">
                            <div className="manage-inventory__title">User</div>
                            <div>
                                <select value={this.state.user} onChange={(e) => this.changeUser(e)}>
                                    {
                                        users.map(
                                            (user) => {
                                                return (
                                                    <option value={user.id}>{user.name}</option>
                                                )
                                            })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="manage-inventory-item-container">
                            <div className="manage-inventory-list">
                                <div className="manage-inventory__title">Item</div>
                                <div >
                                    {
                                        manageInventoryItems && manageInventoryItems.length ?
                                            <select value={this.state.inventoryItem} onChange={(e) => this.changeInventoryItem(e)}>
                                                {
                                                    manageInventoryItems.map(
                                                        (item) => {
                                                            return (
                                                                <option value={item.sku}>{item.name}</option>
                                                            )
                                                        })
                                                }
                                            </select>
                                        :
                                        <div>
                                            Nothing to show
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="manage-inventory__quantity">
                                <div className="manage-inventory__title">Quantity</div>
                                <div className="manage-inventory__quantity-change">
                                    <IconRem
                                        style={quantity < 2 ? {
                                            opacity: 0.4
                                        } : {}}

                                        onClick={() => {
                                            this.setItemQuantity(quantity - 1);
                                        }}
                                    />
                                    <CssCartQ>{quantity}</CssCartQ>
                                    <IconAdd
                                        onClick={() => {
                                            this.setItemQuantity(quantity + 1);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="manage-inventory-actions">
                            <Button
                                type="submit"
                                variant="contained"
                                onClick={(e) => this.rewardItem(e)}
                            >Reward</Button>
                            <Button
                                variant="contained"
                                onClick={(e) => this.revokeItem(e)}
                            >Revoke</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const CssCartQ = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bolder;
  min-width: 44px;
  font-size: 1.2em;
`;