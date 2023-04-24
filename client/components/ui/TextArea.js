import { TextField as MuiTextField } from '@material-ui/core';
import React from 'react';

const TextArea = ({ ...remainingProps }) => (
  <MuiTextField
    InputLabelProps={{ disableAnimation: true, shrink: true }}
    multiline
    rows={3}
    variant="outlined"
    {...remainingProps}
  />
);

export default TextArea;
