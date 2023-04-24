import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
    height: 25px;
    width: 25px;
    border-radius: 25px;
    font-size: 0.7rem;
    font-weight: bold;
    text-align: center;
    line-height: 25px;
 
    ${({ color, theme }) => `
      color: ${theme.app.badgeFlowColor[color]};
      border: solid 1px ${theme.app.badgeFlowColor[color]};
    `}   
`;

const BadgeFlow = ({ children, color, ...remainingProps }) => (
  <Wrapper color={color} {...remainingProps}>
    {children}
  </Wrapper>
);

BadgeFlow.defaultProps = {
  color: 1,
};

BadgeFlow.propTypes = {
  children: PropTypes.string.isRequired,
  color: PropTypes.oneOf([
    1,
    2,
    3,
    4,
    5,
  ]),
};

export default BadgeFlow;
