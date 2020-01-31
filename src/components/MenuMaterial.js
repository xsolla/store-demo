import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {
  MuiThemeProvider,
  createMuiTheme,
  makeStyles
} from "@material-ui/core/styles";

import { ProductContext } from "../context";

const useTabStyles = makeStyles({
  root: {
    justifyContent: "center"
  },
  scroller: {
    flexGrow: "0"
  }
});

export function MenuMaterial({
  virtualItems = [],
  activeGroup,
  changeGroupHandler = () => {
    void 0;
  }
}) {
  activeGroup = 'first' === activeGroup ? virtualItems && virtualItems[0] && virtualItems[0].id : activeGroup;

  const classes = useTabStyles();

  const handleChange = (event, data) => {
    changeGroupHandler(data["id"]);
  };

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
        value={activeGroup}
        indicatorColor="primary"
        textColor="primary"
        style={{
          color: React.useContext(ProductContext).getTheme("colorAccent")
        }}
        classes={{ root: classes.root, scroller: classes.scroller }}
        variant="scrollable"
        scrollButtons="on"
      >
        {virtualItems &&
          virtualItems.map((oneGroup) => {
            return (
              <Tab
                value={oneGroup["id"]}
                key={oneGroup["id"]}
                color="secondary"
                textColor="secondary"
                label={oneGroup["name"]}
                onClick={e => handleChange(e, oneGroup)}
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

export default MenuMaterial;
