import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

const ModalTwoChoices = ({
  cancelButtonText,
  children,
  firstChoiceButtonText,
  onCancel,
  onClickFirstChoice,
  onClickSecondChoice,
  onClickThirdChoice,
  open,
  secondChoiceButtonText, thirdChoiceButtonText,
  title, disabledButton,
}) => (
  <Dialog onClose={onCancel} open={open} maxWidth={'md'}>
    <DialogTitle>{title}</DialogTitle>

    <DialogContent>
      <DialogContentText>{children}</DialogContentText>
    </DialogContent>

    <DialogActions>
      <Button onClick={onClickFirstChoice} variant="contained" autoFocus disabled={disabledButton}>
        <FormattedMessage id={firstChoiceButtonText} />
      </Button>

      <Button onClick={onClickSecondChoice} variant="contained" autoFocus disabled={disabledButton}>
        <FormattedMessage id={secondChoiceButtonText} />
      </Button>

      <Button onClick={onClickThirdChoice} variant="contained" autoFocus disabled={disabledButton}>
        <FormattedMessage id={thirdChoiceButtonText} />
      </Button>

      <Button onClick={onCancel}>
        <FormattedMessage id={cancelButtonText} />
      </Button>
    </DialogActions>
  </Dialog>
);

ModalTwoChoices.defaultProps = {
  cancelButtonText: 'cancel',
};

ModalTwoChoices.propTypes = {
  cancelButtonText: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  firstChoiceButtonText: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onClickFirstChoice: PropTypes.func.isRequired,
  onClickSecondChoice: PropTypes.func.isRequired,
  onClickThirdChoice: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  secondChoiceButtonText: PropTypes.string.isRequired,
  thirdChoiceButtonText: PropTypes.string.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
};

export default ModalTwoChoices;
