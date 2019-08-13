import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {
  makeStyles,
  useStyles,
  MuiThemeProvider,
  createMuiTheme
} from "@material-ui/core/styles";
import styled from "styled-components";

import { ProductContext } from "../context";

export function MenuMaterial({
  value = 0,
  virtualItems = [],
  activeGroup = activeGroup === "first" ? virtualItems[0]["id"] : activeGroup,
  changeGroupHandler = () => {
    void 0;
  },
  changeGlobalHandler = () => {
    void 0;
  }
}) {
  const [state, setState] = React.useState({
    value: 0,
    virtualItems: virtualItems,
    activeGroup: activeGroup === "first" ? virtualItems[0]["id"] : activeGroup
  });

  const handleChange = (event, data, value) => {
    setState({
      value: value,
      activeGroup: data["id"]
    });
    changeGroupHandler(data["id"]);
    changeGlobalHandler(data["id"]);
    // setStateFrom('activeGroup', data['id'])
  };

  // const classes = useStyles();
  return (
    <MuiThemeProvider
      theme={createMuiTheme({
        palette: {
          primary: {
            main: React.useContext(ProductContext).getTheme("colorAccent")
          }
        }
      })}
    >
      <Tabs
        value={state.value}
        indicatorColor="primary"
        textColor="primary"
        style={{
          color: React.useContext(ProductContext).getTheme("colorAccent")
          // backgroundColor: React.useContext(ProductContext).getTheme('colorBg'),
        }}
        centered
      >
        {virtualItems &&
          virtualItems.map((oneGroup, key) => {
            return (
              <Tab
                key={oneGroup["id"]}
                // textColor={React.useContext(ProductContext).getTheme('colorAccent')}
                color="secondary"
                textColor="secondary"
                label={oneGroup["name"]}
                onClick={e => handleChange(e, oneGroup, key)}
                style={{
                  color: React.useContext(ProductContext).getTheme("colorText")
                }}
              />
            );
          })}
      </Tabs>
    </MuiThemeProvider>
  );
}

const CssTabs = styled(Tabs)`
  background-color: ${props => props.colorBg};
`;

export default MenuMaterial;
