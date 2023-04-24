import React from 'react';
import { FormattedMessage } from 'react-intl';

export const getErrorMessage = function getErrorMessage(name, type = 'required'){

  const messageType = type === 'required' ? 'blank' : 'invalid';


  if (this.state.errors[name]) {
    return <FormattedMessage id={`errors.${messageType}`} />;
  }

  return '';
};

export const handleChangeFields = function handleChangeFields(name) {
  return ({ target }) => {
    this.setState({
      errors: {
        ...this.state.errors,
        [name]: false,
      },
      [name]: target.value,
    });
  };
};
