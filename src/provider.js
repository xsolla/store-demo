import React from 'react';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from 'styled-components';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MuiThemeProvider from '@material-ui/styles/ThemeProvider';
import { useRouteMatch } from 'react-router-dom';

import ProductProvider from './context';
import { mainTheme } from './styles/theme';
import { device } from './styles/devices';
import { routes } from './utils/routes';

const notificationPosition = {
  vertical: 'bottom',
  horizontal: 'right',
};

const Provider = ({ children }) => {
  const isMobile = useMediaQuery(`@media ${device.mobileL}`);

  const match = useRouteMatch({
    path: routes.specificProject,
    strict: true,
    sensitive: true
  });

  return (
    <SnackbarProvider
      anchorOrigin={notificationPosition}
      dense={isMobile}
      maxSnack={3}
      preventDuplicate={isMobile}
    >
      <MuiThemeProvider theme={mainTheme}>
        <ThemeProvider theme={mainTheme}>
          <ProductProvider projectId={match ? match.params.projectID : window.xProjectId}>
            {children}
          </ProductProvider>
        </ThemeProvider>
      </MuiThemeProvider>
    </SnackbarProvider>
  )
};

export default Provider;
