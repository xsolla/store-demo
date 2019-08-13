import React, { useState, useEffect } from "react";
import { SketchPicker } from "react-color";
import { ProductContext } from "../context";
import ColorRandomizer from "../sb/ColorRandomizer";
import ColorThemer from "../sb/ColorThemer";

export default function StoreSbColor({
  changeOneColor = false //if false, changes all colors
}) {
  const [state, setState] = useState();

  const changeTheme = React.useContext(ProductContext).changeTheme;
  const oldTheme = React.useContext(ProductContext).getTheme();

  useEffect(() => {
    return () => {
      setState(oldTheme[changeOneColor]);
    };
  }, [oldTheme[changeOneColor]]);

  return (
    <div>
      <p>
        <SketchPicker
          color={state}
          onChange={newColor => {
            setState(newColor.hex);

            if (changeOneColor) {
              oldTheme[changeOneColor] = newColor.hex;
              changeTheme(oldTheme);
            } else {
              changeTheme(ColorThemer(oldTheme, newColor.hex));
            }
          }}
        />
      </p>
      <hr />
      <p>
        <label className="xsb_sett_label w-form-label">Get lucky</label>
      </p>
      <ColorRandomizer />
    </div>
  );
}
