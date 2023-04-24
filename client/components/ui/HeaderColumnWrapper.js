import styled from 'styled-components';

const HeaderColumnWrapper = styled.div`
  line-height: 1.45;
  margin-bottom: 25px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  ${({ theme }) => `
    ${theme.app.breakpoint.md} {
      margin-bottom: 0;
    }
  `}  
`;

export default HeaderColumnWrapper;
