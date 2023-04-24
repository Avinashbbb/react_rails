import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

const ModalWarning = ({
  children, onCancel, onSubmit, open, title,
}) => (
  <Dialog onClose={onCancel} open={open}>
    <DialogTitle>{title}</DialogTitle>

    <DialogContent>
      <DialogContentText>{children}</DialogContentText>
    </DialogContent>

    <DialogActions>
      <Button onClick={onCancel}>
        <FormattedMessage id="cancel" />
      </Button>

      <Button onClick={onSubmit} variant="contained" autoFocus>
        <FormattedMessage id="continue" />
      </Button>
    </DialogActions>
  </Dialog>
);

ModalWarning.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
};

export default ModalWarning;
