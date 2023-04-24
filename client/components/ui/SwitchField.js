import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const SwitchField = (props) => (
  <FormControlLabel
    control={
      <Switch
        checked={props.checked}
        onChange={props.onChange}
        value={props.value}
      />
    }
    label={props.label}
  />
);

export default SwitchField;
