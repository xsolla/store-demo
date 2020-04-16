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
import { getCookie, setCookie } from "./utils/cookie";
import { useGetParamsMatch } from "./utils/useGetParamsMatch";
import { snakeToCamel } from "./utils/converters";

const notificationPosition = {
  vertical: 'bottom',
  horizontal: 'right',
};

const Provider = ({ children }) => {
  const isMobile = useMediaQuery(`@media ${device.mobileL}`);
  const matchSpecificProject = useRouteMatch({
    path: routes.specificProject,
    strict: true,
    sensitive: true,
  });

  const matchSpecificProjectAndLogin = useGetParamsMatch(['project_id', 'login_id'], snakeToCamel);
  const match = matchSpecificProject || matchSpecificProjectAndLogin;

  const projectId = Number((match && match.params.projectId) || getCookie("project_id") || config.projectId);
  if (Number(getCookie("project_id")) !== projectId && !matchSpecificProject && projectId !== config.projectId) {
      setCookie("project_id", projectId);
  }

  const storeMode = matchSpecificProject ? 'public' : 'demo';

  const api = React.useMemo(
    () =>
      new Api({
        baseURL: 'https://store.xsolla.com/api',
        projectId,
        paymentWidget: window.XPayStationWidget,
        isPhysicalGoodDemo: !!matchSpecificProject
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
