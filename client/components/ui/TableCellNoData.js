import { TableCell as TableCellMU, TableRow } from '@material-ui/core';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

const TableCellSC = styled(TableCellMU)`
  && {
    background: ${({ theme }) => theme.app.backgroundLightColor}
    text-align: center;
  }
`;

const TableCellNoData = () => (
  <TableRow>
    <TableCellSC colspan="100">
      <FormattedMessage id="no_data" />
    </TableCellSC>
  </TableRow>
);

export default TableCellNoData;
