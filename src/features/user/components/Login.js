import React from 'react';

import { useStore } from '../../../store';

const mapState = state => ({
  user: state.user.userInfo,
});

const mapActions = actions => ({
  getUser: actions.user.getUser,
});

const Login = React.memo(() => {
  const { getUser } = useStore(mapState, mapActions);

  React.useEffect(() => {
    getUser();
  }, []);

  return null;
});

export { Login };
