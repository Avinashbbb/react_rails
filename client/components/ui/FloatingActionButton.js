import { Fab as FabMui } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Tooltip from './Tooltip';

const Wrapper = styled.span`
    position: ${props => props.position ? props.position : "absolute"};
    right: 25px;
    top: -28px;
    z-index: 2;
`;

const FloatingActionButton = ({ position, children, tooltipLabel, ...remainingProps }) => (
  <Tooltip title={tooltipLabel}>
    <Wrapper position={position ? position : null}>
      <FabMui {...remainingProps}>
        {children}
      </FabMui>
    </Wrapper>
  </Tooltip>
);

FloatingActionButton.defaultProps = {
  children: '',
  tooltipLabel: '',
};

FloatingActionButton.propTypes = {
  children: PropTypes.node,
  tooltipLabel: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
};

export default FloatingActionButton;
