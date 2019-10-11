import React, {Component} from "react";

import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import Collapse from "@material-ui/core/Collapse";

import './PhysicalItem.css';

export class PhysicalItem extends Component {
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
      price,
      currency,
      handleBuyByRealCurrency
    } = this.props;
    
    return (
      <div className={`physical-item ${!this.state.cardShown ? initClass : ""}`}>
        <div className="physical-item-card">
          <div
            className="physical-item-card-media"
            style={{
              backgroundImage: `url(${imageUrl})`
            }}
          />
          
          <div className="physical-item-card-content">
            <div className="physical-item-card-content-title">{title}</div>
            <div className="physical-item-card-content-description">{description}</div>
          </div>
  
          <div className="physical-item-card-actions">
            <div className="physical-item-card-actions-price">
              {currency} {Math.round(price * 100) / 100}
            </div>
            <Button
              variant="contained"
              onClick={handleBuyByRealCurrency}
            >
              Buy now
            </Button>
          </div>
          
          <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
            <CardContent>{description}</CardContent>
          </Collapse>
        </div>
      </div>
    );
  }
}
