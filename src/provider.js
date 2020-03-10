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
  const isSpecificProject = Boolean(match);
  const isDemo = Number(process.env.REACT_APP_DEMO_PROJECT_ID) === config.projectId;
  const api = React.useMemo(
    () =>
      new Api(
        'https://store.xsolla.com/api',
        projectId,
        isSpecificProject,
        window.XPayStationWidget,
        window.XL
      ),
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
          <StoreProvider isPublic={isSpecificProject} isDemo={isDemo} api={api}>
            {children}
          </StoreProvider>
        </ThemeProvider>
      </MuiThemeProvider>
    </SnackbarProvider>
  );
};

export default Provider;
