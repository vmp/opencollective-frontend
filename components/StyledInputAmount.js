import React from 'react';
import PropTypes from 'prop-types';
import { clamp, isNil } from 'lodash';

import StyledInputGroup from './StyledInputGroup';
import { getCurrencySymbol } from '../lib/utils';

const getPrepend = (currency, currencyDisplay) => {
  if (currencyDisplay === 'SYMBOL') {
    return getCurrencySymbol(currency);
  } else if (currencyDisplay === 'CODE') {
    return currency;
  } else {
    return `${getCurrencySymbol(currency)} ${currency}`;
  }
};

const getValue = (value, defaultValue, parseNumbers, min, max) => {
  // If a default value is defined, don't use controlled mode
  if (defaultValue !== undefined) {
    return undefined;
  } else {
    if (parseNumbers) {
      return isNil(value) || value === '' ? 0 : value / 100;
    } else {
      return isNil(value) || value === '' ? '' : clamp(value, !min ? 0 : 1, max);
    }
  }
};

/**
 * An input for amount inputs. Accepts all props from [StyledInputGroup](/#!/StyledInputGroup).
 * The value returned by this component is always limited by `min` and `max`.
 */
const StyledInputAmount = ({
  currency,
  min,
  max,
  value,
  onChange,
  defaultValue,
  parseNumbers,
  currencyDisplay,
  ...props
}) => {
  return (
    <StyledInputGroup
      name="amount"
      maxWidth="10em"
      type="number"
      step="0.01"
      min={min}
      max={max}
      value={getValue(value, defaultValue, parseNumbers, min, max)}
      defaultValue={defaultValue}
      prepend={getPrepend(currency, currencyDisplay)}
      onChange={e => {
        // We don't cap on min because we want the user to be able to erase the input
        // and to progressively type the number without forcing a value.
        if (e.target.value !== '' && !isNil(e.target.value)) {
          e.target.value = clamp(e.target.value, !min ? 0 : 1, max);
        }

        if (onChange) {
          if (parseNumbers) {
            const floatValue = parseFloat(e.target.value) || 0;
            const intValue = Math.round(floatValue * 100);
            onChange({ ...e, target: { ...e.target, value: intValue } });
          } else {
            onChange(e);
          }
        }
      }}
      {...props}
    />
  );
};

StyledInputAmount.propTypes = {
  /** The currency (eg. `USD`, `EUR`...) */
  currency: PropTypes.string.isRequired,
  /** OnChange function */
  onChange: PropTypes.func,
  /** Minimum amount */
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  /** Maximum amount */
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  /** Value */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Currency style */
  currencyDisplay: PropTypes.oneOf(['SYMBOL', 'CODE', 'FULL']),
  /** Wether amounts returned by onChange should be converted to number values */
  parseNumbers: PropTypes.bool,
  /** Accept all PropTypes from `StyledInputGroup` */
  ...StyledInputGroup.propTypes,
};

StyledInputAmount.defaultProps = {
  min: 0,
  max: 1000000000,
  currencyDisplay: 'SYMBOL',
};

export default StyledInputAmount;
