import React from 'react';
import PropTypes from 'prop-types';
import { useIntl, defineMessages } from 'react-intl';
import { get, set } from 'lodash';
import { isEmail } from 'validator';

import { PayoutMethodType } from '../../lib/constants/payout-method';
import { i18nFormErrorMessage, FORM_ERROR } from '../../lib/form-utils';
import StyledInputField from '../StyledInputField';
import StyledInput from '../StyledInput';
import { Box } from '@rebass/grid';
import StyledCheckbox from '../StyledCheckbox';
import StyledTextarea from '../StyledTextarea';

const msg = defineMessages({
  email: {
    id: 'Email',
    defaultMessage: 'Email',
  },
  content: {
    id: 'PayoutMethod.Other.content',
    defaultMessage: 'Info',
  },
  savePayout: {
    id: 'ExpenseForm.SavePayout',
    defaultMessage: 'Save this info for future payouts',
  },
});

/** Use this function to validate the payout method */
export const validatePayoutMethod = payoutMethod => {
  const errors = {};

  if (payoutMethod.type === PayoutMethodType.PAYPAL) {
    const email = get(payoutMethod, 'data.email');
    if (!email) {
      set(errors, 'data.email', { type: FORM_ERROR.REQUIRED });
    } else if (!isEmail(email)) {
      set(errors, 'data.email', { type: FORM_ERROR.PATTERN });
    }
  } else if (payoutMethod.type === PayoutMethodType.OTHER) {
    const content = get(payoutMethod, 'data.content');
    if (!content) {
      set(errors, 'data.content', { type: FORM_ERROR.MIN_LENGTH });
    }
  }

  return errors;
};

/**
 * A form to fill infos for a new payout method or to edit an existing one.
 * This component is **fully controlled**, you need to call `validatePayoutMethod`
 * to proceed with the validation and pass the result with the `errors` prop.
 */
const PayoutMethodForm = ({ payoutMethod, onChange, errors, ...props }) => {
  const { formatMessage } = useIntl();
  const isNew = !payoutMethod.id;
  const setValue = (field, value) => onChange({ ...payoutMethod, [field]: value });
  const setDataValue = (field, value) => setValue('data', { ...payoutMethod.data, [field]: value });
  const getError = field => i18nFormErrorMessage(formatMessage, get(errors, field));
  console.log(props);
  return (
    <Box>
      {payoutMethod.type === PayoutMethodType.PAYPAL && (
        <StyledInputField
          type="email"
          htmlFor={isNew ? 'paypal-new' : `paypal-${payoutMethod.id}`}
          error={getError('data.email')}
          label={formatMessage(msg.email)}
          disabled={!isNew}
        >
          {inputProps => (
            <StyledInput
              placeholder="i.e. yourname@yourhost.com"
              defaultValue={get(payoutMethod, 'data.email')}
              onChange={e => setDataValue('email', e.target.value)}
              {...inputProps}
            />
          )}
        </StyledInputField>
      )}
      {payoutMethod.type === PayoutMethodType.OTHER && (
        <StyledInputField
          htmlFor={isNew ? 'other-new' : `other-${payoutMethod.id}`}
          label={formatMessage(msg.content)}
          disabled={!isNew}
          error={getError('data.content')}
        >
          {({ id, name }) => (
            <StyledTextarea
              id={id}
              name={name}
              defaultValue={get(payoutMethod, 'data.content')}
              minHeight={100}
              onChange={e => setDataValue('content', e.target.value)}
            />
          )}
        </StyledInputField>
      )}
      {isNew && (
        <Box mt={3}>
          <StyledCheckbox
            label={formatMessage(msg.savePayout)}
            defaultChecked
            onChange={e => setValue('isSaved', e.target.value)}
          />
        </Box>
      )}
    </Box>
  );
};

PayoutMethodForm.propTypes = {
  /** Set this to nil to create a new one */
  payoutMethod: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    type: PropTypes.oneOf(Object.values(PayoutMethodType)).isRequired,
    data: PropTypes.object,
  }).isRequired,
  /** Updates the payment method with the given value */
  onChange: PropTypes.func.isRequired,
  /** Contains errors for the form */
  errors: PropTypes.object,
};

export default PayoutMethodForm;
