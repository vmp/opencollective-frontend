import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from '@rebass/grid';
import { FormattedMessage } from 'react-intl';
import { P, Span } from './Text';

/**
 * Form field to display an input element with a label and errors. Uses [renderProps](https://reactjs.org/docs/render-props.html#using-props-other-than-render) to pass field props like 'name' and 'id' to child input.
 */
const StyledInputField = ({
  children,
  label,
  htmlFor,
  name,
  error,
  success,
  disabled,
  required,
  inputType,
  labelFontSize,
  ...props
}) => {
  const labelContent = label && <Span color="black.800">{label}</Span>;
  const isCheckbox = inputType === 'checkbox';

  return (
    <Box {...props}>
      <Flex flexDirection={isCheckbox ? 'row' : 'column'}>
        {label && (
          <P
            as="label"
            htmlFor={htmlFor}
            display="block"
            fontWeight="normal"
            fontSize={labelFontSize}
            mb={isCheckbox ? 0 : 1}
            mr={2}
          >
            {required === false && !isCheckbox ? (
              <Span color="black.500">
                <FormattedMessage
                  id="OptionalFieldLabel"
                  defaultMessage="{field} (optional)"
                  values={{ field: labelContent }}
                />
              </Span>
            ) : (
              labelContent
            )}
          </P>
        )}
        {typeof children === 'function'
          ? children({
              name: name || htmlFor,
              type: inputType,
              id: htmlFor,
              error: Boolean(error) || undefined,
              success,
              disabled,
              required,
            })
          : children}
      </Flex>
      {error && (
        <Span display="block" color="red.500" pt={2} fontSize="Tiny">
          {error}
        </Span>
      )}
    </Box>
  );
};

StyledInputField.propTypes = {
  /** React component to wrap with the label and errors */
  children: PropTypes.func.isRequired,
  /** Show disabled state for field */
  disabled: PropTypes.bool,
  /** text to display below the input */
  error: PropTypes.string,
  /** the label's 'for' attribute to be used as the 'name' and 'id' for the input */
  htmlFor: PropTypes.string,
  /** By default name is equal to htmlFor, but you can use this prop to override it */
  name: PropTypes.string,
  /** text to display above the input */
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  /** Passed to input as `type`. Adapts layout for checkboxes */
  inputType: PropTypes.string,
  /** Show success state for field */
  success: PropTypes.bool,
  /** If set to false, the field will be marked as optional */
  required: PropTypes.bool,
  /** Font size for the label */
  labelFontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** All props from `Box` */
  ...Box.propTypes,
};

export default StyledInputField;
