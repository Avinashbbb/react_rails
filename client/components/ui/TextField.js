import { TextField as MuiTextField } from '@material-ui/core';
import React from 'react';

const TextField = ({ ...remainingProps }) => (
  <MuiTextField InputLabelProps={{ disableAnimation: true, shrink: true }} variant="outlined" {...remainingProps} />
);

export default TextField;
