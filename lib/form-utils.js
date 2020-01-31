import { defineMessages } from 'react-intl';

export const FORM_ERROR = {
  MIN: 'min',
  MAX: 'max',
  PATTERN: 'pattern',
  MIN_LENGTH: 'minLength',
  REQUIRED: 'required',
};

const msg = defineMessages({
  [FORM_ERROR.MIN]: {
    id: 'FormError.min',
    defaultMessage: 'The value is too low',
  },
  [FORM_ERROR.MAX]: {
    id: 'FormError.max',
    defaultMessage: 'The value is too high',
  },
  [FORM_ERROR.REQUIRED]: {
    id: 'FormError.required',
    defaultMessage: 'This field is required',
  },
  [FORM_ERROR.MIN_LENGTH]: {
    id: 'FormError.minLength',
    defaultMessage: 'The value is too short',
  },
  [FORM_ERROR.PATTERN]: {
    id: 'FormError.pattern',
    defaultMessage: 'This value is not formatted properly',
  },
  _fallback: {
    id: 'FormError.fallback',
    defaultMessage: 'Invalid value',
  },
});

/**
 * Translate an error as returned to a human-readable, internationalized error message.
 * Fully supports `react-hook-form` errors.
 *
 * @param {function} formatMessage react-intl's formatMessage
 * @param {object} error - as returned by react-hook-form
 */
export const i18nFormErrorMessage = (formatMessage, error) => {
  // No error
  if (!error) {
    return null;
  }

  // Known error
  const i18nMsg = msg[error.type];
  if (i18nMsg) {
    return formatMessage(i18nMsg, error);
  }

  // Won't be translated
  if (error.message) {
    return error.message;
  }

  // Fallback
  return formatMessage(msg._fallback);
};
