import React from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { Select, MenuItem } from '@material-ui/core';
import { withRedeemForm } from '../../../redux/container/redeem-form-container';
import { Body, Content, Image, ItemQuantity, Name, SelectBonus } from './style/redeem-item-style';

const RedeemItem = ({item}) => {
    return (
        <Body>
            <Image image={item.image_url} />
            <Content>
                <Name>{item.name}</Name>
                <ItemQuantity>Quantity: {item.quantity}</ItemQuantity>
            </Content>
        </Body>
    );
};


class SelectableItemComponent extends React.PureComponent {
  getItemsForSelect(selectableItems) {
    let selectedItems = []
    selectableItems.forEach((item) => {
      selectedItems.push(
        <MenuItem key={item.sku} value={item.sku}>
          {item.drm_name}
        </MenuItem>
      );
    });

    return selectedItems;
  }

  selectChangeHandler(event) {
    event.preventDefault();
    const {unitItem, setSelectedReward, selectedReward} = this.props;

    let select = JSON.parse(JSON.stringify(selectedReward));
    select[unitItem.sku] = event.target.value
    setSelectedReward(select)
  }

  getSelectedReward() {
    const {selectedReward, setSelectedReward, initialRewards} = this.props;
    let select = {};
    if (Object.keys(selectedReward).length === 0) {
      setSelectedReward(initialRewards);
      select = initialRewards;
    } else {
      select = selectedReward;
    }

    return select
  }

  render() {
    const {unitItem, quantity} = this.props;

    const selectedReward = this.getSelectedReward();
    const selectableItems = unitItem.unit_items

    return (
      <Body>
        <Image image={unitItem.image_url} />
        <Content>
          <Name>{unitItem.name}</Name>
          <ItemQuantity>Quantity: {quantity}</ItemQuantity>
        </Content>
        <SelectBonus>
          <div>Choose your DRM:</div>
          <Select
            id="selectable_items"
            value={selectedReward[unitItem.sku]}
            onChange={this.selectChangeHandler.bind(this)}
            IconComponent={() => (<ExpandMoreIcon/>)}
            variant={"standard"}
          >
            {this.getItemsForSelect(selectableItems)}
          </Select>
        </SelectBonus>
      </Body>
    )
  }
}

const SelectableItem = withRedeemForm(SelectableItemComponent);
export { RedeemItem, SelectableItem };
