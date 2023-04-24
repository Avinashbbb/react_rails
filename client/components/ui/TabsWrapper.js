import React from 'react';
import styled from 'styled-components';
import { Tabs as TabsMui } from '@material-ui/core';
import PropTypes from 'prop-types';

import PageContainer from './PageContainer';

const BgWrapper = styled.div`
  background: ${props => props.theme.app.bodyBackground};
`;

const TabsWrapper = ({ children, ...remainingProps }) => (
  <BgWrapper>
    <PageContainer>
      <TabsMui {...remainingProps}>
        {children}
      </TabsMui>
    </PageContainer>
  </BgWrapper>
);

TabsWrapper.defaultProps = {
  children: '',
};

TabsWrapper.propTypes = {
  children: PropTypes.node,
};

export default TabsWrapper;
