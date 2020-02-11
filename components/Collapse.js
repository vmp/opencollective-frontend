import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { themeGet } from '@styled-system/theme-get';

import Container from './Container';
import { ChevronDown } from '@styled-icons/feather/ChevronDown/ChevronDown';
import { ChevronUp } from '@styled-icons/feather/ChevronUp/ChevronUp';
import { size, space } from 'styled-system';

export const Details = styled(Container).attrs({
  as: 'details',
})`
  summary {
    display: flex;
    cursor: pointer;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 8px;
    color: ${themeGet('colors.black.800')};
    /* Remove arrow on Firefox */
    list-style: none;

    &:hover {
      color: ${themeGet('colors.black.700')};
    }

    [data-item='chevron-up'] {
      display: none;
    }
    [data-item='chevron-down'] {
      display: inline-block;
      margin-top: 5%;
    }
  }

  &[open] {
    summary {
      [data-item='chevron-up'] {
        display: inline-block;
        margin-top: -5%;
      }
      [data-item='chevron-down'] {
        display: none;
      }
    }
  }

  summary:focus {
    outline: 1px dashed ${themeGet('colors.black.200')};
    outline-offset: ${themeGet('space.1')}px;
  }

  /* Remove arrow on Chrome */
  summary::-webkit-details-marker {
    display: none;
  }
`;

const CollapseBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: 1px solid #dcdee0;

  [data-item='chevron-up'] {
    margin-top: -5%;
  }

  [data-item='chevron-down'] {
    margin-top: 5%;
  }

  ${size}
  ${space}
`;

/**
 * A stylized version of the `details` HTML element to hide & show content when clicked.
 */
const Collapse = ({ children, title, buttonSize, ...props }) => {
  return (
    <Details {...props}>
      {title && (
        <summary>
          <div>{title}</div>
          <CollapseBtn size={buttonSize} ml={3}>
            <ChevronUp size="80%" data-item="chevron-up" />
            <ChevronDown size="80%" data-item="chevron-down" />
          </CollapseBtn>
        </summary>
      )}
      {children}
    </Details>
  );
};

Collapse.propTypes = {
  title: PropTypes.node,
  children: PropTypes.node,
  buttonSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

Collapse.defaultProps = {
  buttonSize: 18,
};

export default Collapse;
