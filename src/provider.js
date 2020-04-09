import React from 'react';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from 'styled-components';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MuiThemeProvider from '@material-ui/styles/ThemeProvider';
import { useRouteMatch } from 'react-router-dom';

import { Api } from './api';
import { StoreProvider } from './store';
import { mainTheme } from './styles/theme';
import { device } from './styles/devices';
import { routes } from './utils/routes';
import { getStoreMode } from './utils/getStoreMode';
import config from './appConfig.json';

const notificationPosition = {
  vertical: 'bottom',
  horizontal: 'right',
};

const Provider = ({ children }) => {
  const isMobile = useMediaQuery(`@media ${device.mobileL}`);
  const match = useRouteMatch({
    path: routes.specificProject,
    strict: true,
    sensitive: true,
  });

  const projectId = match ? match.params.projectId : config.projectId;
  const storeMode = getStoreMode(projectId, config.projectId);

  const api = React.useMemo(
    () =>
      new Api({
        baseURL: 'https://store.xsolla.com/api',
        projectId,
        isDemo: storeMode === 'demo',
        isPublic: storeMode === 'public',
        paymentWidget: window.XPayStationWidget,
        loginWidget: window.XL,
      }),
    []
  );

  return (
    <SnackbarProvider
      anchorOrigin={notificationPosition}
      dense={isMobile}
      maxSnack={3}
      preventDuplicate={isMobile}>
      <MuiThemeProvider theme={mainTheme}>
        <ThemeProvider theme={mainTheme}>
          <StoreProvider storeMode={storeMode} api={api}>
            {children}
          </StoreProvider>
        </ThemeProvider>
      </MuiThemeProvider>
    </SnackbarProvider>
  );
};

export default Provider;
