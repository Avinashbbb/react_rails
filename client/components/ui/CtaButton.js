import { Fab, Icon } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const CButton = styled(Fab)`
  && {
    position: fixed;
    bottom: 20px;
    right: 20px;
  }
`;

const CtaButton = (props) => {
  return (
    <CButton onClick={props.onClick} style={{ marginLeft: '15px', marginRight: '5px' }}>
      <Icon>add</Icon>
    </CButton>
  );
};

CtaButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default CtaButton;