import React from 'react';
import {SnackbarProvider} from 'notistack';
import {ThemeProvider} from 'styled-components';
import MuiThemeProvider from '@material-ui/styles/ThemeProvider';
import {useRouteMatch} from 'react-router-dom';

import {Api} from './api';
import {StoreProvider} from './store';
import {mainTheme} from './styles/theme';
import {isMobile} from './styles/devices';
import {routes} from './routes';
import config from './appConfig.json';
import {getCookie, setCookie} from "./utils/cookie";
import {useGetParamsMatch} from "./utils/useGetParamsMatch";
import {snakeToCamel} from "./utils/converters";
import {SnackbarUtilsConfigurator} from "./components/snackbar-utils";

const notificationPosition = {
  vertical: 'bottom',
  horizontal: 'right',
};

const Provider = ({children, reduxStore}) => {
  const matchSpecificProject = useRouteMatch({
    path: routes.specificProject,
    strict: true,
    sensitive: true,
  });

  const matchSpecificProjectAndLogin = useGetParamsMatch(['project_id', 'login_id'], snakeToCamel);
  const match = matchSpecificProject || matchSpecificProjectAndLogin;

  const projectId = Number((match && match.params.projectId) || getCookie("project_id") || config.projectId);

  if (matchSpecificProjectAndLogin) {
    setCookie("project_id", projectId);
  }

  const storeMode = matchSpecificProject ? 'public' : 'demo';

  const api = React.useMemo(
    () =>
      new Api({
        baseURL: config.apiUrl,
        projectId,
        paymentWidget: window.XPayStationWidget,
        isPhysicalGoodDemo: !!matchSpecificProject,
        reduxStore: reduxStore
      }),
    [projectId, window.XPayStationWidget, matchSpecificProject]
  );

  return (
    <SnackbarProvider
      anchorOrigin={notificationPosition}
      dense={isMobile()}
      maxSnack={3}
      preventDuplicate={isMobile()}>
      <SnackbarUtilsConfigurator />
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
