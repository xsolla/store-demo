import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import styled from "styled-components";

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2
  }
});

function Preloader(props) {
  const { classes } = props;
  return (
    <CssPreloader>
      <CircularProgress className={classes.progress} />
      {/* <CircularProgress className={classes.progress} color="secondary" /> */}
    </CssPreloader>
  );
}

Preloader.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Preloader);

const CssPreloader = styled.div`
  z-index: 9;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: white;
`;
