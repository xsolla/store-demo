import React from 'react';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from 'styled-components';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MuiThemeProvider from '@material-ui/styles/ThemeProvider';
import { useRouteMatch } from 'react-router-dom';

import cookie from './utils/cookie';
import { Api } from './api';
import ProductProvider from './context';
import { StoreProvider } from './store';
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

  const loginToken = match ? null : cookie();
  const projectID = match ? match.params.projectID : window.xProjectId;
  const api = React.useMemo(() => new Api(
    'https://store.xsolla.com/api',
    projectID,
    loginToken,
    window.XPayStationWidget,
  ), []);

  return (
    <SnackbarProvider
      anchorOrigin={notificationPosition}
      dense={isMobile}
      maxSnack={3}
      preventDuplicate={isMobile}
    >
      <MuiThemeProvider theme={mainTheme}>
        <ThemeProvider theme={mainTheme}>
          <StoreProvider api={api}>
            <ProductProvider projectId={projectID}>
              {children}
            </ProductProvider>
          </StoreProvider>
        </ThemeProvider>
      </MuiThemeProvider>
    </SnackbarProvider>
  )
};

export default Provider;
