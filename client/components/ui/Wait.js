import { CircularProgress } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100px;
`;

const Wait = ({ ...props }) => (
  <Wrapper>
    <CircularProgress
      {...props}
    />
  </Wrapper>
);

export default Wait;
