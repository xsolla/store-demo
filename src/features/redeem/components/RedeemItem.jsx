import React from "react";
import styled from "styled-components";
import {device} from "../../../styles/devices";
import {Select, MenuItem} from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {withRedeemForm} from "../../../redux/container/redeem-form-container";

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
        <MenuItem key={item.sku} value={item.sku} disableGutters={true}>
          {item.drm_name}
        </MenuItem>
      );
    });

    return selectedItems;
  }

  selectChangeHandler(event) {
    event.preventDefault();
    const {unitItem, setSelectedReward} = this.props;
    let select = {};
    select[unitItem.sku] = event.target.value

    setSelectedReward(select)
  }

  render() {
    const {unitItem, quantity, selectedReward} = this.props;

    const selectableItems = unitItem.unit_items;
    const selectedItem = selectedReward && selectedReward[unitItem.sku];
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
            label="DRM"
            value={selectedItem ? selectedItem : selectableItems[0].sku}
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


const Body = styled.div`
  display: grid;
  grid-template-columns: 0.7fr 1.3fr 1fr;
  color: ${({ theme }) => theme.palette.text.primary};
  overflow: hidden;
  height: 130px;

  @media ${device.mobileL} {
    height: 185px;
    grid-template-columns: 0.9fr 1.1fr;
    grid-template-rows: 120px 1fr;
  }
`;

const Image = styled.div`
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${props => props.image});
`;

const Content = styled.div`
  padding: 10px;
`;

const Name = styled.div`
  font-weight: bolder;
  margin-bottom: 5px;
`;

const ItemQuantity = styled.div`
  color: ${({ theme }) => theme.palette.primary.main};
  font-weight: 600;
`;

const SelectBonus = styled.div`
  font-weight: bolder;
  padding: 10px;
`
export const SelectableItem = withRedeemForm(SelectableItemComponent);

export { RedeemItem };
