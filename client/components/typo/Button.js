import { Button as ButtonMui } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Wrapper = styled.span`
`;

const ButtonSC = styled(ButtonMui)`
  && {
    padding: 10px 20px;
    color: ${({ theme }) => theme.app.brandColor};

   
    ${({ color, variant }) => (variant === 'contained' && color === 'primary' && `
      color: white;
    `)}
     
    ${({ color, theme, variant }) => (variant === 'contained' && color === 'secondary' && `
      background-color: inherit;
      box-shadow: none;
      border: solid 1px ${theme.app.brandColor};
      &:hover{
        background-color: #ffffff70;
      } 
    `)}
    
    & .material-icons{
      margin-right: 5px; 
      font-size: 1.2rem;
    }
  )};
        

  }
`;

const Button = ({ children, ...remainingProps }) => (
  <Wrapper>
    <ButtonSC {...remainingProps}>
      {children}
    </ButtonSC>
  </Wrapper>
);

Button.defaultProps = {
  children: '',
};

Button.propTypes = {
  children: PropTypes.node,
};

export default Button;
