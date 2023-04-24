import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import PageContainer from './PageContainer';

const ActionTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: initial;
  
  button {
    margin-right: 5px;
  }
`;

const HeaderWrapper = styled.div` 
  color: ${props => props.theme.app.darkBlueFontColor};
  padding: 10px 20px 30px 20px;
`;

const Subtitle = styled.div`
  margin-top: -10px;
  margin-bottom: 15px;
`;

const Title = styled.div`
  position: relative;
  font-weight: bold;
  font-size: 1.8em;
  margin-bottom: 15px;
`;

const TitleButtonWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const renderSubtitle = (text) => {
  if (text === '') {
    return null;
  }
  return <Subtitle>{text}</Subtitle>;
};

const PageHeader = ({
  children, getBadge, subtitleText, titleText,
}) => (
  <HeaderWrapper>
    <PageContainer>
      <ActionTitleWrapper>
        <TitleButtonWrapper>
          <Title>{titleText} {getBadge()}</Title>
        </TitleButtonWrapper>
        {renderSubtitle(subtitleText)}
      </ActionTitleWrapper>
      {children}
    </PageContainer>
  </HeaderWrapper>
);

PageHeader.defaultProps = {
  children: '',
  getBadge: f => f,
  subtitleText: '',
  titleText: '',
};

PageHeader.propTypes = {
  getBadge: PropTypes.func,
  children: PropTypes.node,
  subtitleText: PropTypes.string,
  titleText: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
};

export default PageHeader;
