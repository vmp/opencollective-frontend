import { Box, Flex } from '@rebass/grid';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller } from 'react-hook-form';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';
import { isURL } from 'validator';

import { i18nFormErrorMessage } from '../../lib/form-utils';
import PrivateInfoIcon from '../icons/PrivateInfoIcon';
import StyledDropzone from '../StyledDropzone';
import StyledInput from '../StyledInput';
import StyledInputAmount from '../StyledInputAmount';
import StyledInputField from '../StyledInputField';
import StyledLink from '../StyledLink';
import { Label } from '../Text';
import { attachmentDropzoneParams } from './lib/attachments';

export const msg = defineMessages({
  previewImgAlt: {
    id: 'ExpenseReceiptImagePreview.Alt',
    defaultMessage: 'Expense receipt preview',
  },
  descriptionLabel: {
    id: 'Fields.description',
    defaultMessage: 'Description',
  },
  amountLabel: {
    id: 'Fields.amount',
    defaultMessage: 'Amount',
  },
  dateLabel: {
    id: 'expense.incurredAt',
    defaultMessage: 'Date',
  },
  remove: {
    id: 'Remove',
    defaultMessage: 'Remove',
  },
});

export const FormFieldsContainer = styled.div`
  border-bottom: 1px dashed #eaeaea;
  display: flex;
  margin-bottom: 18px;
`;

export const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 10px;
`;

/**
 * Form for a single attachment. Must be used with react-hook-form.
 */
const ExpenseAttachmentForm = ({
  attachment,
  errors,
  onRemove,
  register,
  defaultCurrency,
  requireFile,
  name,
  control,
}) => {
  const { formatMessage } = useIntl();
  const attachmentKey = `attachment-${attachment.url}`;
  const getFieldName = field => `${name}.${field}`;
  const getError = field => i18nFormErrorMessage(formatMessage, get(errors, getFieldName(field)));

  return (
    <FormFieldsContainer key={attachmentKey}>
      {requireFile && (
        <Box mr={4}>
          <Label fontSize="LeadCaption" color="black.800">
            <FormattedMessage id="Expense.Attachment" defaultMessage="Attachment" />
            &nbsp;&nbsp;
            <PrivateInfoIcon color="#969BA3" />
          </Label>
          <Controller
            name={getFieldName('url')}
            rules={{ required: true }}
            onChangeName="onSuccess"
            control={control}
            defaultValue={attachment.url}
            as={({ value, ...dropzoneProps }) => {
              const hasValidUrl = value && isURL(value);
              return (
                <StyledDropzone
                  {...attachmentDropzoneParams}
                  {...dropzoneProps}
                  showDefaultMessage={!hasValidUrl}
                  isMulti={false}
                  mockImageGenerator={() => `https://loremflickr.com/120/120/invoice?lock=${attachmentKey}`}
                  fontSize="LeadCaption"
                  size={112}
                  mt={2}
                >
                  {hasValidUrl && <PreviewImg src={value} alt={formatMessage(msg.previewImgAlt)} />}
                </StyledDropzone>
              );
            }}
          />
        </Box>
      )}
      <Box flex="1 1" minWidth={200}>
        <StyledInputField
          name={getFieldName('description')}
          error={getError('description')}
          htmlFor={`${attachmentKey}-description`}
          label={formatMessage(msg.descriptionLabel)}
          labelFontSize="LeadCaption"
          required
        >
          {inputProps => <StyledInput {...inputProps} ref={register({ required: true, minLength: 1 })} />}
        </StyledInputField>
        <Flex flexWrap="wrap" justifyContent="space-between">
          <StyledInputField
            name={getFieldName('incurredAt')}
            error={getError('incurredAt')}
            htmlFor={`${attachmentKey}-incurredAt`}
            inputType="date"
            label={formatMessage(msg.dateLabel)}
            labelFontSize="LeadCaption"
            flex="1 1 50%"
            mt={3}
            mr={[null, 3]}
          >
            {inputProps => (
              <StyledInput
                maxHeight={39}
                {...inputProps}
                defaultValue={attachment.incurredAt}
                ref={register({ required: true })}
              />
            )}
          </StyledInputField>
          <StyledInputField
            name={getFieldName('amount')}
            error={getError('amount')}
            htmlFor={`${attachmentKey}-amount`}
            label={formatMessage(msg.amountLabel)}
            labelFontSize="LeadCaption"
            inputType="number"
            flex="1 1 30%"
            maxWidth="100%"
            mt={3}
          >
            {inputProps => (
              <Controller
                name={inputProps.name}
                control={control}
                rules={{ min: 1, max: 1000000000, required: true }}
                as={
                  <StyledInputAmount
                    {...inputProps}
                    currency={defaultCurrency}
                    currencyDisplay="CODE"
                    maxWidth="100%"
                    placeholder="0.00"
                    parseNumbers
                  />
                }
              />
            )}
          </StyledInputField>
        </Flex>
        {onRemove && (
          <Box mt={2} p={3} textAlign="right">
            <StyledLink color="red.500" data-hovercolor="red.300" fontSize="Caption" onClick={onRemove}>
              {formatMessage(msg.remove)}
            </StyledLink>
          </Box>
        )}
      </Box>
    </FormFieldsContainer>
  );
};

ExpenseAttachmentForm.propTypes = {
  /** The currency of the collective */
  defaultCurrency: PropTypes.string.isRequired,
  /** ReactHookForm key */
  name: PropTypes.string.isRequired,
  /** Called when clicking on remove */
  onRemove: PropTypes.func,
  /** react-hook-form's register */
  register: PropTypes.func.isRequired,
  /** react-hook-form's control */
  control: PropTypes.object.isRequired,
  /** A map of errors for this object */
  errors: PropTypes.object,
  /** Wether a file is required for this attachment type */
  requireFile: PropTypes.bool,
  /** the attachment data */
  attachment: PropTypes.shape({
    url: PropTypes.string.isRequired,
    incurredAt: PropTypes.string,
  }),
};

export default ExpenseAttachmentForm;
