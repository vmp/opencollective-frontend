import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { useForm, Controller } from 'react-hook-form';
import { Box, Flex } from '@rebass/grid';
import { isEmpty, size, get } from 'lodash';

import expenseTypes from '../../lib/constants/expenseTypes';
import { PayoutMethodType } from '../../lib/constants/payout-method';
import { P } from '../Text';
import ExpenseTypeRadioSelect from './ExpenseTypeRadioSelect';
import StyledInput from '../StyledInput';
import StyledHr from '../StyledHr';
import ExpenseFormAttachments from './ExpenseFormAttachments';
import StyledInputField from '../StyledInputField';
import CollectivePicker from '../CollectivePicker';
import StyledButton from '../StyledButton';
import PayoutMethodSelect from './PayoutMethodSelect';
import StyledTextarea from '../StyledTextarea';
import PayoutMethodForm, { validatePayoutMethod } from './PayoutMethodForm';

const msg = defineMessages({
  descriptionPlaceholder: {
    id: `ExpenseForm.DescriptionPlaceholder`,
    defaultMessage: 'Enter expense title',
  },
  fromCollectiveLabel: {
    id: `ExpenseForm.FromCollectiveLabel`,
    defaultMessage: 'Who is being paid for this expense?',
  },
  payoutOptionLabel: {
    id: `ExpenseForm.PayoutOptionLabel`,
    defaultMessage: 'Choose payout option',
  },
  complementaryInfo: {
    id: 'ExpenseForm.ComplementaryInfo',
    defaultMessage: 'Complementary info',
  },
});

const ExpenseForm = ({ onSubmit, collective, expense, payoutProfiles }) => {
  const { formatMessage } = useIntl();
  const [payoutProfile, setPayoutProfile] = React.useState(payoutProfiles && payoutProfiles[0]);
  const [payoutMethod, setPayoutMethod] = React.useState(null);
  const formAPI = useForm({ defaultValues: expense });
  const { register, handleSubmit, triggerValidation, errors, watch, control } = formAPI;
  const expenseType = watch('type');
  const expenseDescription = watch('description');
  const attachments = watch('attachments');
  const hasBaseFormFieldsCompleted = expenseType && expenseDescription && !errors.description;
  const stepOneCompleted = hasBaseFormFieldsCompleted && size(attachments) > 0;
  const stepTwoCompleted = payoutProfile && payoutMethod;

  // Set default payout profile when loaded
  React.useEffect(() => {
    if (!payoutProfile && size(payoutProfiles) > 0) {
      setPayoutProfile(payoutProfiles[0]);
    }
  }, [payoutProfiles]);

  console.log('errors', errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <P fontSize="LeadParagraph" fontWeight="bold" mb={3}>
        <FormattedMessage id="ExpenseForm.Type" defaultMessage="Which type of expense is it? " />
      </P>
      <ExpenseTypeRadioSelect
        name="type"
        inputRef={register({ required: true })}
        onChange={() => triggerValidation('type')}
      />
      {expenseType && (
        <Box mt={4} width="100%">
          <StyledInput
            name="description"
            ref={register({ required: true, minLength: 1, maxLength: 255 })}
            onChange={() => triggerValidation('description')}
            placeholder={formatMessage(msg.descriptionPlaceholder)}
            width="100%"
            fontSize="H4"
            border="0"
            error={errors.description}
            px={0}
            withOutline
          />
          <StyledHr mt={3} borderColor="black.300" />
          <P color={hasBaseFormFieldsCompleted ? 'black.900' : 'black.300'} fontSize="LeadParagraph" my={24}>
            <FormattedMessage id="ExpenseForm.Step1" defaultMessage="1. Upload one or multiple receipts" />
          </P>
          {hasBaseFormFieldsCompleted && (
            <Box>
              <ExpenseFormAttachments
                defaultCurrency={collective.currency}
                register={register}
                control={control}
                watch={watch}
                errors={errors}
                name="attachments"
                requireFile={expenseType === expenseTypes.RECEIPT}
              />
            </Box>
          )}
          <StyledHr borderColor="black.300" />
          <P fontSize="LeadParagraph" mt={24} mb={3} color={stepOneCompleted ? 'black.900' : 'black.300'}>
            <FormattedMessage id="ExpenseForm.Step2" defaultMessage="2. Payee & payout information" />
          </P>
          {stepOneCompleted && (
            <Box>
              <Flex justifyContent="space-between" flexWrap="wrap">
                <StyledInputField
                  name="fromCollective"
                  label={formatMessage(msg.fromCollectiveLabel)}
                  htmlFor="payout-profile"
                  flex="1"
                  mr={4}
                  mt={2}
                >
                  {({ id }) => (
                    <CollectivePicker
                      inputId={id}
                      collectives={payoutProfiles}
                      getDefaultOptions={build => payoutProfile && build(payoutProfile)}
                      onChange={({ value }) => {
                        setPayoutProfile(value);
                        setPayoutMethod(null);
                      }}
                    />
                  )}
                </StyledInputField>
                <StyledInputField
                  label={formatMessage(msg.payoutOptionLabel)}
                  htmlFor="payout-method"
                  flex="1"
                  mr={4}
                  mt={2}
                >
                  {({ id }) => (
                    <PayoutMethodSelect
                      inputId={id}
                      onChange={({ value }) => setPayoutMethod(value)}
                      payoutMethods={get(payoutProfile, 'payoutMethods', [])}
                      disabled={!payoutProfile}
                    />
                  )}
                </StyledInputField>
              </Flex>
              {payoutMethod && (
                <Flex justifyContent="space-between" mt={3}>
                  <Box mr={4} mt={2} flex="1">
                    <Controller
                      name="PayoutMethod"
                      control={control}
                      rules={{ required: true, validate: validatePayoutMethod }}
                      defaultValue={payoutMethod}
                      valueName="payoutMethod"
                      as={<PayoutMethodForm />}
                    />
                  </Box>
                  <StyledInputField
                    htmlFor="privateInfo"
                    label={formatMessage(msg.complementaryInfo)}
                    required={false}
                    flex="1"
                    maxWidth="80%"
                    mr={4}
                    mt={2}
                  >
                    {inputProps => <StyledTextarea {...inputProps} minHeight={80} inputRef={register} />}
                  </StyledInputField>
                </Flex>
              )}
            </Box>
          )}
          <StyledHr borderColor="black.300" my={4} />
          <StyledButton buttonStyle="primary" disabled={!stepOneCompleted || !stepTwoCompleted || !isEmpty(errors)}>
            <FormattedMessage id="Expense summary" defaultMessage="Expense summary" />
          </StyledButton>
        </Box>
      )}
    </form>
  );
};

ExpenseForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  collective: PropTypes.shape({
    currency: PropTypes.string.isRequired,
  }).isRequired,
  /** If editing */
  expense: PropTypes.shape({
    type: PropTypes.oneOf(Object.values(expenseTypes)),
    description: PropTypes.string,
    attachments: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
      }),
    ),
  }),
  /** Payout profiles that user has access to */
  payoutProfiles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      slug: PropTypes.string,
      payoutMethods: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          type: PropTypes.oneOf(Object.values(PayoutMethodType)),
          name: PropTypes.string,
          data: PropTypes.object,
        }),
      ),
    }),
  ),
};

export default ExpenseForm;
