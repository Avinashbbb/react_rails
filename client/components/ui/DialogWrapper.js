import { Dialog } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const DialogMuiWrapper = styled(Dialog)`
  .paper-root {
    flex: 1 1 auto;  
  }
  
  .paper-width-sm {    
    max-width: ${({ width }) => `${width}`};
  }
`;

const DialogWrapper = ({ children, width, ...remainingProps }) => (
  <DialogMuiWrapper disableBackdropClick width={width} classes={{ paper: 'paper-root', paperWidthSm: 'paper-width-sm' }} scroll="paper" {...remainingProps}>
    {children}
  </DialogMuiWrapper>
);

DialogWrapper.defaultProps = {
  children: '',
  width: '625px',
};

DialogWrapper.propTypes = {
  children: PropTypes.node,
  width: PropTypes.string,
};

export default DialogWrapper;
