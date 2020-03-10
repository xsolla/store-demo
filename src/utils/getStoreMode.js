import { DEMO_PROJECT_ID } from './constants';

export const getStoreMode = (projectId, appProjectId) => {
  if (process.env.REACT_APP_STORE_MODE === 'virtual') {
    return 'virtual';
  }

  if (process.env.REACT_APP_STORE_MODE === 'physical') {
    return 'physical';
  }

  if (projectId !== appProjectId) {
    return 'public';
  }

  if (DEMO_PROJECT_ID === appProjectId) {
    return 'demo';
  }

  throw new Error('Unknown type of store');
};
