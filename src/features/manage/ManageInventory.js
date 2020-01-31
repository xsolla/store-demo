import React, {PureComponent} from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Alert from 'react-bootstrap/Alert';

import {getVirtualCurrencyList, getVirtualItemList, rewardItems} from './ManageInventoryLoader'

import './ManageInventory.css';
import MenuMaterial from "../../components/MenuMaterial";

export class ManageInventory extends PureComponent {
    constructor(props) {
        super(props);

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
        ];
        this.state = {
            fetching: false,
            isPurchasing: false,
            inventoryItem: null,
            quantity: 1,
            users: users,
            user: 'd342dad2-9d59-11e9-a384-42010aa8003f',
            showToast: false,
            statusToast: 'processing',
            operationDetails: null,
            manageInventoryGroups: [],
            activeInventoryGroup: 'first',
            manageInventoryItems: null,
            manageInventoryCurrencies: null,
        }
    }

    componentDidMount() {
        if (null === this.state.manageInventoryItems) {
            this.getItems();
            this.props.updateVirtualCurrencyBalance();
        }
        if (null === this.state.manageInventoryCurrencies) {
            this.getCurrencies();
        }
    }

    changeGroupHandler = group => {
        const {manageInventoryGroups} = this.state;
        this.setState({activeInventoryGroup: group});
        const activeGroup = manageInventoryGroups.find(g => g['id'] === group);
        const itemSku = activeGroup && activeGroup.items.length > 0 ? activeGroup.items[0].sku : 'helmet_1';
        this.setState({inventoryItem: itemSku});
        this.setItemQuantity(1);
    };


    getItems() {
        this.setState({fetching: true});

        getVirtualItemList(window.xProjectId)
            .then(virtualItemsList => {
                this.setManageInventoryItems(virtualItemsList);
            })
            .catch(() => {
            });
    }

    getCurrencies() {
        this.setState({fetching: true});

        getVirtualCurrencyList(window.xProjectId)
            .then(virtualCurrencyList => {
                this.setManageInventoryCurrencies(virtualCurrencyList);
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
        if (parseInt(quantity) >= 1) {
            this.setState({quantity: parseInt(quantity)});
        }
    }

    setShowToast(isVisible) {
        this.setState({showToast: isVisible});
    }

    setManageInventoryItems = (manageInventoryItems) => {
        this.setState({
            manageInventoryItems,
            fetching: false,
            manageInventoryGroups: [
                ...this.state.manageInventoryGroups,
                {
                    id: 1,
                    name: 'items',
                    items: manageInventoryItems,
                    singleItemName: 'Item'
                }
            ],
        })
    };

    setManageInventoryCurrencies = (manageInventoryCurrencies) => {
        this.setState({
            manageInventoryCurrencies,
            fetching: false,
            manageInventoryGroups: [
                ...this.state.manageInventoryGroups,
                {
                    id: 2,
                    name: 'currencies',
                    items: manageInventoryCurrencies,
                    singleItemName: 'Currency'
                }
            ],
        })
    };

    itemOperation(type) {
        let {user, activeInventoryGroup, quantity, inventoryItem, manageInventoryGroups} = this.state;
        if (inventoryItem === null && manageInventoryGroups && manageInventoryGroups.length) {
            const group = activeInventoryGroup !== 'first'
                ? manageInventoryGroups.find(group => group['id'] === activeInventoryGroup)
                : manageInventoryGroups[0];
            inventoryItem = group && group.items.length > 0 ? group.items[0].sku : 'helmet_1';
        }

        const body = {
            type: type,
            user: user,
            item: inventoryItem,
            count: quantity
        }
        this.setState({showToast: true, statusToast: 'processing', operationDetails: null});
        rewardItems(body)
            .then(response => {
                this.setState({
                    showToast: true,
                    statusToast: 'complete',
                    operationDetails: response.operations[0].items
                });
                this.props.updateVirtualCurrencyBalance();
            })
            .catch(() => {
            });
    }

    rewardItem(e) {
        this.itemOperation('reward');
    }

    revokeItem() {
        this.itemOperation('revoke');
    }

    render() {
        const {quantity, users, showToast, statusToast, operationDetails, manageInventoryGroups, activeInventoryGroup} = this.state;
        const group = activeInventoryGroup !== 'first'
            ? manageInventoryGroups.find(group => group['id'] === activeInventoryGroup)
            : manageInventoryGroups[0];
        return (
            <div className="manage-inventory__row">
                <div className="manage-inventory__alert">
                    <Alert onClose={(e) => this.setShowToast(false)} show={showToast}
                           variant={statusToast === 'processing' ? "primary" : "success"} dismissible>
                        <Alert.Heading>{statusToast === 'processing' ? 'Operation is processing' : 'Operation complete!'}</Alert.Heading>
                        <p>
                            {
                                group && group.items.length && operationDetails && operationDetails.length ?
                                    operationDetails.map(
                                        (item) => {
                                            return (
                                                <div>
                                                    <div>Item: <b>{
                                                        group.items.filter((inventoryItem) => {
                                                            return inventoryItem.sku === item.sku
                                                        }).map((inventoryItem) => {
                                                            return inventoryItem.name;
                                                        })
                                                    }</b></div>
                                                    <div>Quantity: <b>{item.quantity === null ? 0 : item.quantity}</b>
                                                    </div>
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
                                                    <option key={user.id} value={user.id}>{user.name}</option>
                                                )
                                            })
                                    }
                                </select>
                            </div>
                        </div>
                        <MenuMaterial
                            virtualItems={manageInventoryGroups}
                            activeGroup={activeInventoryGroup}
                            changeGroupHandler={this.changeGroupHandler}
                        />

                        <div className="manage-inventory-item-container">
                            <div className="manage-inventory-list">
                                <div
                                    className="manage-inventory__title">{group ? group.singleItemName : 'Item'}</div>
                                <div>
                                    {group && group.items.length > 0
                                        ? <select value={this.state.inventoryItem}
                                                  onChange={(e) => this.changeInventoryItem(e)}>
                                            {
                                                group.items.map(
                                                    (item) => {
                                                        return (
                                                            <option key={item.sku}
                                                                    value={item.sku}>{item.name}</option>
                                                        )
                                                    })
                                            }
                                        </select>
                                        : <div>
                                            Nothing to show
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="manage-inventory__quantity">
                                <div className="manage-inventory__quantity-change">
                                    <TextField
                                        label={"Quantity"}
                                        type={"number"}
                                        inputProps={{style: {color: 'white'}, min: "0", step: "1"}}
                                        defaultValue={quantity}
                                        InputLabelProps={{
                                            className: "manage-inventory__quantity-input-label"
                                        }}
                                        onChange={(e) => this.setItemQuantity(e.target.value)}
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
