import { Box, Flex } from '@rebass/grid';
import { isEmpty, size } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { useFieldArray } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import uuid from 'uuid/v4';

import Container from '../Container';
import FormattedMoneyAmount from '../FormattedMoneyAmount';
import { I18nBold } from '../I18nFormatters';
import StyledButton from '../StyledButton';
import StyledDropzone from '../StyledDropzone';
import { P, Span } from '../Text';
import ExpenseAttachmentForm from './ExpenseAttachmentForm';
import { attachmentDropzoneParams } from './lib/attachments';
import { toIsoDateStr } from '../../lib/date-utils';

/** Converts a list of filenames to attachment objects */
const filesListToAttachments = files => files.map(url => ({ url, incurredAt: toIsoDateStr(new Date()) }));

/**
 * Displays the total amount for all the attachments. Implemented in a separate component
 * so that updating an individual attachment doesn't re-render the full list, only the
 * updated attachment and this totalAmount field.
 */
const AttachmentsTotalAmount = ({ name, watch, defaultCurrency }) => {
  const attachments = watch(name);
  const totalAmount =
    size(attachments) > 0 ? attachments.reduce((amount, attachment) => amount + (attachment.amount || 0), 0) : 0;

  return (
    <Span color="black.500" fontSize="LeadParagraph" letterSpacing={0}>
      <FormattedMoneyAmount
        amount={totalAmount}
        precision={2}
        currency={defaultCurrency}
        amountStyles={{ letterSpacing: 0, color: 'black.800', fontWeight: 'bold' }}
      />
    </Span>
  );
};

AttachmentsTotalAmount.propTypes = {
  /** The currency of the collective */
  defaultCurrency: PropTypes.string.isRequired,
  /** ReactHookForm key */
  name: PropTypes.string.isRequired,
  /** react-hook-form's watch */
  watch: PropTypes.func.isRequired,
};

/**
 * Fields for expenses with type=RECEIPT. Meant to be used with react-hook-form.
 */
const ExpenseFormAttachments = ({ name, defaultCurrency, requireFile, control, register, watch, errors }) => {
  const { fields: attachments, append, remove } = useFieldArray({ name: name, control });
  const hasAttachments = !isEmpty(attachments);

  React.useEffect(() => {
    if (!hasAttachments && !requireFile) {
      append({ url: `NEW_ATTACHMENT_-${uuid()}`, incurredAt: toIsoDateStr(new Date()) });
    }
  }, [hasAttachments, requireFile]);

  if (!hasAttachments && requireFile) {
    return (
      <StyledDropzone
        {...attachmentDropzoneParams}
        onSuccess={files => append(filesListToAttachments(files))}
        showDefaultMessage
        mockImageGenerator={index => `https://loremflickr.com/120/120/invoice?lock=${index}`}
        mb={3}
      >
        <P color="black.700" mt={1}>
          <FormattedMessage
            id="MultipleAttachmentsDropzone.UploadWarning"
            defaultMessage="<i18n-bold>Important</i18n-bold>: Expenses will not be paid without a valid receipt."
            values={{ 'i18n-bold': I18nBold }}
          />
        </P>
      </StyledDropzone>
    );
  }

  return (
    <Box>
      {attachments.map((attachment, index) => (
        <ExpenseAttachmentForm
          key={`attachment-${attachment.url}`}
          attachment={attachment}
          defaultCurrency={defaultCurrency}
          name={`attachments[${index}]`}
          errors={errors}
          register={register}
          control={control}
          onRemove={() => remove(index)}
          requireFile={requireFile}
        />
      ))}
      <StyledButton
        type="button"
        buttonStyle="secondary"
        width="100%"
        onClick={() => append({ url: `NEW_ATTACHMENT_-${uuid()}`, incurredAt: toIsoDateStr(new Date()) })}
      >
        <Span mr={2}>
          {requireFile ? (
            <FormattedMessage id="ExpenseForm.AddReceipt" defaultMessage="Add another receipt" />
          ) : (
            <FormattedMessage id="ExpenseForm.AddLineItem" defaultMessage="Add another line item" />
          )}
        </Span>
        <Span fontWeight="bold">+</Span>
      </StyledButton>
      <Container display="flex" borderTop="1px dashed #eaeaea" my={3} pt={3} justifyContent="flex-end">
        <Flex width={220} justifyContent="space-between" alignItems="center">
          <Container fontSize="Caption" fontWeight="bold" mr={2}>
            <FormattedMessage id="ExpenseFormAttachments.TotalAmount" defaultMessage="Total amount:" />
          </Container>
          <AttachmentsTotalAmount watch={watch} name={name} defaultCurrency={defaultCurrency} />
        </Flex>
      </Container>
    </Box>
  );
};

ExpenseFormAttachments.propTypes = {
  /** The currency of the collective */
  defaultCurrency: PropTypes.string.isRequired,
  /** ReactHookForm key */
  name: PropTypes.string.isRequired,
  /** react-hook-form's register */
  register: PropTypes.func.isRequired,
  /** react-hook-form's control */
  control: PropTypes.object.isRequired,
  /** react-hook-form's watch */
  watch: PropTypes.func.isRequired,
  /** Wether a file is required for this attachment type */
  requireFile: PropTypes.bool,
  /** react-hook-form's errors */
  errors: PropTypes.object,
};

export default ExpenseFormAttachments;
