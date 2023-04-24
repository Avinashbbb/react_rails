import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import PageContainer from './ui/PageContainer';

const Wrapper = styled.div`
  background: ${props => props.theme.app.headerWrapperBgColor};
`;

const List = styled.ul`
  margin: 0;
  padding: 15px 0 10px 0;
  color: ${props => props.theme.app.curentFontColor};
  list-style: none;
  
  li{
    margin: 0 11px 0 0;
    padding: 0;
    display: inline;
    
    &::before {
      content: "/";
      margin-right: 10px;
    }
    
    &:first-child::before {
      content: "";
      margin-left: 0;
      margin-right: 0;
    }
  
  a{
    color: ${props => props.theme.app.mainColor};
    text-decoration: none;
  }
`;

const Breadcrumbs = ({ children }) => (
  <Wrapper>
    <PageContainer>
      <List >
        {children}
      </List>
    </PageContainer>
  </Wrapper>
);

Breadcrumbs.defaultProps = {
  children: '',
};

Breadcrumbs.propTypes = {
  children: PropTypes.node,
};

export default Breadcrumbs;