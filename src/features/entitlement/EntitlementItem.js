import React, {Component} from "react";

import CardContent from "@material-ui/core/CardContent";
import Collapse from "@material-ui/core/Collapse";

import './EntitlementItem.css';
import Button from "@material-ui/core/Button";

export class EntitlementItem extends Component {
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
      description
    } = this.props;

    return (
      <div className={`entitlement-item ${!this.state.cardShown ? initClass : ""}`}>
        <div className="entitlement-item-card">
          <div
            className="entitlement-item-card-media"
            style={{
              backgroundImage: `url(${imageUrl})`
            }}
          />
          <div className="entitlement-item-card-content">
            <div className="entitlement-item-card-content-title">{title}</div>
            <div className="entitlement-item-card-content-description">{description}</div>
          </div>
          <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
            <CardContent>{description}</CardContent>
          </Collapse>
        </div>
      </div>
    );
  }
}
