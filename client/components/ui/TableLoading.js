import React, { Fragment } from 'react';
import styled, { keyframes } from 'styled-components';

const trHeight = '60px;';

const placeHolderShimmer = keyframes`
    0%{
      background-position: -468px 0
  }
    100%{
      background-position: 468px 0
  }
`;

const RowOdd = styled.tr`
  td {
    height: ${trHeight}; 
    animation-duration: 1.25s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: ${placeHolderShimmer};
    animation-timing-function: linear;
    background: #F6F6F6;
    background: linear-gradient(to right, #F7F7F7 8%, #f3f3f3 18%, #F7F7F7 33%);
    background-size: 1200px 104px;
    border-top: solid 1px #e0e0e0; 
  }
`;

const RowEven = styled.tr`
  td {
    height: ${trHeight}; 
    border-top: solid 1px #e0e0e0;      
  }
`;

const TableLoading = () => (
  [1, 2, 3, 4, 5].map(() => (
    <Fragment>
      <RowEven>
        <td height="200" colSpan="99" />
      </RowEven>

      <RowOdd>
        <td height="200" colSpan="99" />
      </RowOdd>
    </Fragment>
  ))
);

export default TableLoading;
