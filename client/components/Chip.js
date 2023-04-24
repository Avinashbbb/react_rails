import { Chip as ChipMui } from '@material-ui/core';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Chip = styled(ChipMui)`
  && {
    height: 20px;
    border-style: solid;
    border-width: 1px;
    font-size: 0.7rem;
    
    ${({ color, theme }) => `
      background-color: ${theme.app[`chip${color}`].bkg};
      border-color: ${theme.app[`chip${color}`].border};
      color: ${theme.app[`chip${color}`].color}; 
    `}   
  }
`;

Chip.defaultProps = {
  color: 'default',
};

Chip.propTypes = {
  color: PropTypes.oneOf([
    'default',
    'green',
    'blue',
    'yellow',
    'purple',
    'orange',
  ]),
};

export default Chip;
