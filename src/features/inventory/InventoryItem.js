import React, {Component} from "react";

import CardContent from "@material-ui/core/CardContent";
import Collapse from "@material-ui/core/Collapse";

import './InventoryItem.css';

export class InventoryItem extends Component {
  constructor() {
    super();
    this.state = {
      expanded: false,
      cardShown: false
    }
  }
  
  componentDidMount() {
    const {
      order
    } = this.props;
    
    if (!this.state.cardShown) {
      setTimeout(() => {
        this.setState({
          cardShown: true
        });
      }, order * 100);
    }
  }
  
  render() {
    const {
      initClass,
      imageUrl,
      title,
      description,
      quantity
    } = this.props;
    
    return (
      <div className={`inventory-item ${!this.state.cardShown ? initClass : ""}`}>
        <div className="inventory-item-card">
          <div
            className="inventory-item-card-media"
            style={{
              backgroundImage: `url(${imageUrl})`
            }}
          />
  
          <div className="inventory-item-card-content">
            <div className="inventory-item-card-content-title">{title}</div>
            <div className="inventory-item-card-content-description">{description}</div>
          </div>
          
          <div className="inventory-item-card-actions">
            <div className="inventory-item-card-actions-quantity">
              {`Quantity: ${quantity}`}
            </div>
          </div>
  
          <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
            <CardContent>{description}</CardContent>
          </Collapse>
        </div>
      </div>
    );
  }
}
