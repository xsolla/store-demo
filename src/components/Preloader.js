import React from 'react';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';

const Preloader = ({ size }) => (
  <CssPreloader>
    <CircularProgress size={size} color='primary' />
  </CssPreloader>
);

export { Preloader };

const CssPreloader = styled.div`
  z-index: 9;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
`;
