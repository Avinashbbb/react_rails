import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin-right: 5px;
  padding: 2px 7px;
  background: #E9E9E9;
  border: solid 1px #E9E9E9;
  border-radius: 4px;
  font-size: 0.8rem;

  ${({ color, theme }) => (color === 'dark') && `
    background: ${theme.app.curentFontColor};
    color: white;
  `}
`;

const SimpleBadge = ({ children, color, ...remainingProps }) => (
  <Wrapper color={color} {...remainingProps}>
    {children}
  </Wrapper>
);

SimpleBadge.defaultProps = {
  color: 'light',
};

SimpleBadge.propTypes = {
  children: PropTypes.string.isRequired,
  color: PropTypes.oneOf([
    'light',
    'dark',
  ]),
};

export default SimpleBadge;
