import React from "react";
import { ProductContext } from "../context";

export default function StoreSbSize({
  handleSize = newColor => {
    void 0;
  }
}) {
  const [state, setState] = React.useState({
    background: "#fff",
    cardWidth: 300
  });

  const changeTheme = React.useContext(ProductContext).changeTheme;
  const oldTheme = React.useContext(ProductContext).getTheme();
  const changeCardSize = React.useContext(ProductContext).changeCardSize;

  return (
    <div className="">
      <input
        type="range"
        min="100"
        max="800"
        value={oldTheme.cardWidth}
        // value={state.cardWidth}
        onChange={e => {
          changeCardSize(e.target.value);
          // setState({
          //   cardWidth: `${e.target.value}px`
          // })
        }}
      />
    </div>
  );
}
