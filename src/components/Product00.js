import React from "react";

const propTypes = {};

const defaultProps = {};

export default class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <div>{this.props.product.name}</div>
      </React.Fragment>
    );
  }
}

Product.propTypes = propTypes;
Product.defaultProps = defaultProps;
