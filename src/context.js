import React from 'react';
import { withSnackbar } from 'notistack';

import cookie from './utils/cookie';
import { getVirtualCurrencyBalance } from './components/StoreLoader';

const ProductContext = React.createContext();

class ProductProvider extends React.PureComponent {
  state = {
    projectId: this.props.projectId,
    logToken: cookie(),
    user: null,
    isSideMenuShown: false,

    userBalanceVirtualCurrency: [],
    isUserBalanceFetching: false,
  };

  setStateFrom = (stateName, stateValue) => this.setState({ [stateName]: stateValue });
  setSideMenuVisibility = isSideMenuShown => this.setState({ isSideMenuShown });

  updateVirtualCurrencyBalance = () => {
    const { enqueueSnackbar } = this.props;
    const { projectId, logToken } = this.state;

    this.setState({ isUserBalanceFetching: true });
    getVirtualCurrencyBalance(projectId, logToken)
      .then(data => {
        this.setState({
          isUserBalanceFetching: false,
          userBalanceVirtualCurrency: data.items,
        });
      })
      .catch(error => {
        this.setState({ isUserBalanceFetching: false });
        const errorMsg = error.response ? error.response.data.errorMessage : error.message;
        enqueueSnackbar(errorMsg, { variant: 'error' });
      })
  };

  render() {
    return (
      <ProductContext.Provider
        value={{
          ...this.state,
          setStateFrom: this.setStateFrom,
          updateVirtualCurrencyBalance: this.updateVirtualCurrencyBalance,
          setSideMenuVisibility: this.setSideMenuVisibility,
        }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductContext, ProductConsumer };

export default withSnackbar(ProductProvider);
