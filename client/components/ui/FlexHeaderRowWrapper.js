import styled from 'styled-components';

const FlexHeaderRowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  
  ${({ theme }) => `
    ${theme.app.breakpoint.md} {
      flex-direction: row;
      justify-content: space-between;
    }
  `}
`;

export default FlexHeaderRowWrapper;
