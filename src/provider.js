import React from 'react';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from 'styled-components';
import { HashRouter } from 'react-router-dom';

import ProductProvider from './context';
import { theme } from './styles/theme';

const notificationPosition = {
  vertical: 'bottom',
  horizontal: 'right',
};

const Provider = ({ children }) => (
  <SnackbarProvider
    anchorOrigin={notificationPosition}
    maxSnack={3}
    preventDuplicate
  >
    <ThemeProvider theme={theme}>
      <ProductProvider projectId={window.xProjectId}>
        <HashRouter basename='/'>
          {children}
        </HashRouter>
      </ProductProvider>
    </ThemeProvider>
  </SnackbarProvider>
);

export { Provider };
