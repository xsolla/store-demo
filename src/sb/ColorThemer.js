import React from "react";
import Colorer from "color";

export function colorRotater(oldTheme, rotateAngle = 29) {
  // const oldTheme = useContext(ProductContext).getTheme();
  let newTextColor = Colorer(oldTheme.colorText)
    .rotate(rotateAngle)
    .hex();
  return ColorThemer(oldTheme, newTextColor);
}

export default function ColorThemer(oldTheme, textColor) {
  let rotateAngle = 29;
  // const changeTheme = useContext(ProductContext).changeTheme;
  // const oldTheme = useContext(ProductContext).getTheme();
  // let colorSource = Colorer(oldTheme.colorAccent).saturate(0.1).hex();

  let colorSource = Colorer(textColor)
    .rgb()
    .saturate(0.5)
    .hex();

  let colorAccent = Colorer(colorSource)
    .rgb()
    .hex();

  let colorText = Colorer(colorAccent)
    .negate()
    .rotate(rotateAngle + 90)
    .hex();

  // colorAccent: Colorer(colorSource).rgb().rotate(rotateAngle).hex(),
  // colorBg: Colorer(colorSource).rgb().rotate(rotateAngle - 80).negate().hex(),
  // colorBg: Colorer(oldTheme.colorText).rgb().rotate(rotateAngle - 80).negate().hex(),
  let colorBg = Colorer(colorAccent).isDark()
    ? Colorer(oldTheme.colorText)
        .rgb()
        .rotate(rotateAngle)
        .negate()
        .lighten(0.3)
        .saturate(0.8)
        .hex()
    : Colorer(oldTheme.colorText)
        .rgb()
        .rotate(rotateAngle - 80)
        .negate()
        .blacken(0.9)
        .saturate(0.8)
        .hex();
  let colorAccentText = Colorer(colorAccent).isDark() ? "#FFF" : "#000";
  // debugger;

  let colorTextAlpha = Colorer(colorText)
    .alpha(0.5)
    .string();
  console.log("colorTextAlpha = ", colorTextAlpha);

  const newColorTheme = {
    colorText: colorText,
    colorAccent: colorAccent,
    colorBg: colorBg,
    colorAccentText: colorAccentText
  };
  return newColorTheme;
}
