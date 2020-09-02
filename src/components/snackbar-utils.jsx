import React from 'react';

import {useSnackbar} from "notistack";

const InnerSnackbarUtilsConfigurator = (props) => {
  props.setUseSnackbarRef(useSnackbar());
  return null;
}

let useSnackbarRef;
const setUseSnackbarRef = (useSnackbarRefProp) => {
  useSnackbarRef = useSnackbarRefProp
}

export const SnackbarUtilsConfigurator = () => {
  return <InnerSnackbarUtilsConfigurator setUseSnackbarRef={setUseSnackbarRef} />
}

export default {
  notifyError(msg) {
    this.notify(msg, 'error')
  },
  notify(msg, variant) {
    useSnackbarRef.enqueueSnackbar(msg, {variant})
  }
}