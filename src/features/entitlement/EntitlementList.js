import React, {PureComponent} from "react";

import {EntitlementItem} from './EntitlementItem';
import {getEntitlement, redeem} from './EntitlementLoader';
import {init} from 'store-js-sdk/src/init';

import './EntitlementList.css';
import './EntitlementRedeem.css';
import Button from "@material-ui/core/Button";
import {CircularProgress} from "@material-ui/core";

export class EntitlementList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            code: '',
            sku: '',
            hasRedeemError: false,
            isFetching: false
        };

        this.handleChangeCode = this.handleChangeCode.bind(this);
        this.handleChangeSku = this.handleChangeSku.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if (this.props.logToken && null === this.props.entitlementItems) {
            this.updateEntitlement();
            this.props.setStateFrom("fetching", true);
        }
    }

    componentWillUnmount() {
        if (null !== this.props.entitlementItems) {
            this.props.setEntitlementItems(null);
        }
    }

    updateEntitlement() {
        init({
            projectId: window.xProjectId,
            version: 'v2'
        });

        this.props.setStateFrom("fetching", true);

        getEntitlement(window.xProjectId, this.props.logToken)
            .then(items => {
                this.props.setEntitlementItems(items);
            })
            .catch(() => {
                this.props.setEntitlementItems([]);
            });
    }

    handleChangeCode(event) {
        this.setState({code: event.target.value});
    }

    handleChangeSku(event) {
        this.setState({sku: event.target.value});
    }

    handleSubmit(event) {
        this.setState({
            ...this.state,
            isFetching: true
        });

        redeem(window.xProjectId, this.props.logToken, this.state.code, this.state.sku)
            .then((e, k) => {
                this.updateEntitlement();
                this.setState({
                    ...this.state,
                    hasRedeemError: false,
                    isFetching: false
                });
            })
            .catch(() => {
                console.log('error');
                this.setState({
                    ...this.state,
                    hasRedeemError: true,
                    isFetching: false
                });
            });

        event.preventDefault();
    }

    render() {
        const {entitlementItems} = this.props;

        return (
            <div className="">
                <form className="entitlement-redeem-form"
                      onSubmit={this.handleSubmit}
                >
                    <input
                        className="entitlement-redeem-input"
                        type="text"
                        size="40"
                        placeholder={"Enter your code"}
                        onChange={this.handleChangeCode} value={this.state.code}
                    />
                    <input
                        className="entitlement-redeem-input"
                        type="text"
                        size="40"
                        placeholder={"Enter sku of your game"}
                        onChange={this.handleChangeSku} value={this.state.sku}
                    />
                    {
                        this.state.hasRedeemError && !this.state.isFetching && <span className="entitlement-redeem-error">Wrong code</span>
                    }
                    {
                        this.state.isFetching &&
                        <div className="entitlement-redeem-loader">
                            <CircularProgress />
                        </div>
                    }
                    <Button
                        type="submit"
                        className="entitlement-redeem-button"
                        variant="contained"
                    >
                        Redeem Code
                    </Button>
                </form>
                <div className="entitlement-list">
                    {
                        entitlementItems && entitlementItems.length
                            ?
                            entitlementItems
                                .map(
                                    (oneProduct, key) => {
                                        return (
                                            <EntitlementItem
                                                key={oneProduct.digital_content_sku}
                                                order={key}
                                                initClass="initialFlow1"
                                                title={oneProduct.name}
                                                description={oneProduct.description}
                                                imageUrl={oneProduct.image_url}
                                            />
                                        );
                                    }
                                )
                            :
                            <div>
                                Oops, you have no games yet!
                            </div>
                    }
                </div>
            </div>
        );
    }
}
