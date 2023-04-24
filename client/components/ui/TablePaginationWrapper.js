import { TablePagination as TablePaginationMui } from '@material-ui/core';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';

const TablePaginationMuiWrapper = styled(TablePaginationMui)`
  .select-icon {
    top: 3px;
  }
  
  .select-wrapper {
    padding-right: 22px;
  }
  
  .spacer-centered {
    flex: .5;
  }  
`;

const TablePaginationWrapper = ({ children, ...remainingProps }) => (
  <TablePaginationMuiWrapper
    classes={{
    select: 'select-wrapper',
    selectIcon: 'select-icon',
    spacer: 'spacer-centered',
  }}
    {...remainingProps}
  >
    {children}
  </TablePaginationMuiWrapper>
);

TablePaginationWrapper.defaultProps = {
  children: '',
};

TablePaginationWrapper.propTypes = {
  children: PropTypes.node,
};

export default TablePaginationWrapper;
