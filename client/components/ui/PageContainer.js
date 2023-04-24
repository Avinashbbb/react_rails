import styled from 'styled-components';

const PageContainer = styled.div`
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
  width: 100%;
  font-size: 0.85rem;
  z-index: 1200;

  ${({ theme }) => `
      ${theme.app.breakpoint.md} {
        width: 750px;
      }
      
      ${theme.app.breakpoint.lg} {
        width: 970px;
      }
      
      ${theme.app.breakpoint.xl} {
        width: 1170px;
      }            
  `}
`;

export default PageContainer;
