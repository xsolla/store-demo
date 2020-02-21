import React from 'react';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from 'styled-components';
import { useMediaQuery } from '@material-ui/core';
import { HashRouter } from 'react-router-dom';

import ProductProvider from './context';
import { theme } from './styles/theme';
import { device } from './styles/devices';

const notificationPosition = {
  vertical: 'bottom',
  horizontal: 'right',
};

const Provider = ({ children }) => {
  const isMobile = useMediaQuery(`@media ${device.mobileL}`);

  return (
    <SnackbarProvider
      anchorOrigin={notificationPosition}
      dense={isMobile}
      maxSnack={3}
      preventDuplicate={isMobile}
    >
      <ThemeProvider theme={theme}>
        <ProductProvider projectId={window.xProjectId}>
          <HashRouter basename='/'>
            {children}
          </HashRouter>
        </ProductProvider>
      </ThemeProvider>
    </SnackbarProvider>
  )
};

export default Provider;
