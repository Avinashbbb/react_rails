import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin: 10px 20px;
  padding-top: 25px;
`;

const Page = ({ children }) => (
  <Wrapper>
    {children}
  </Wrapper>
);

Page.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Page;
