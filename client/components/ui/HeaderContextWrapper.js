import styled from 'styled-components';

const HeaderContextWrapper = styled.div`
  min-height: 160px;
  background: ${props => props.theme.app.headerWrapperBgColor};
`;

export default HeaderContextWrapper;
