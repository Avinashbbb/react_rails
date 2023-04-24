import { Tooltip as TooltipMui } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

const TooltipSC = styled(TooltipMui)`  
  & .tooltipMui{
    background-color: red;
    padding: 0.8rem;
    font-size: 4.8rem;
    font-weight: normal;
  }
`;

const Tooltip = ({ ...remainingProps }) => (
  <TooltipSC
    {...remainingProps}
    classes={{
      tooltip: 'tooltipMui',
    }}
  />
);

export default Tooltip;
