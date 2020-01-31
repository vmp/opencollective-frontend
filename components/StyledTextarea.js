import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { space, layout, border, color, typography } from 'styled-system';
import themeGet from '@styled-system/theme-get';

import { overflow, resize } from '../lib/styled_system_custom';
import Container from './Container';
import StyledTag from './StyledTag';
import { combineRefs } from '../lib/react-utils';

const TextArea = styled.textarea`
  /** Size */
  ${space}
  ${layout}
  ${resize}
  ${overflow}

  /** Borders */
  ${border}

  /** Text */
  ${color}
  ${typography}

  outline: none;

  ${props => {
    if (props.withOutline) {
      return props.error
        ? css`
            outline: 1px dashed ${themeGet('colors.red.300')};
            outline-offset: 0.25em;
          `
        : css`
            &:focus {
              outline: 1px dashed ${themeGet('colors.black.200')};
              outline-offset: 0.25em;
            }
          `;
    }
  }}

  &:disabled {
    background-color: ${themeGet('colors.black.50')};
    cursor: not-allowed;
  }

  &:focus, &:hover:not(:disabled) {
    border-color: ${themeGet('colors.primary.300')};
  }

  &::placeholder {
    color: ${themeGet('colors.black.400')};
  }
`;

/**
 * A styled textarea that can grows with its content.
 */
export default class StyledTextarea extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    inputRef: PropTypes.func,
    /** If true, the component will update its size based on its content */
    autoSize: PropTypes.bool,
    /** styled-system prop: accepts any css 'border' value */
    border: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.array]),
    /** styled-system prop: accepts any css 'border-color' value */
    borderColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.array]),
    /** styled-system prop: accepts any css 'border-radius' value */
    borderRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.array]),
    /** If not provided, the value will be set to `none` if `autoSize` is true, `vertical` otherwise */
    resize: PropTypes.oneOf(['vertical', 'horizontal', 'both', 'none']),
    /** If true, max text length will be displayed at the bottom right */
    showCount: PropTypes.bool,
    /** if true, a default outline will be displayed when focused */
    withOutline: PropTypes.bool,
    /** If truthy, the outline will be red */
    error: PropTypes.any,
    /** @ignore */
    px: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.array]),
    /** @ignore */
    py: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.array]),
  };

  static defaultProps = {
    border: '1px solid',
    borderColor: 'black.300',
    borderRadius: '4px',
    px: 12,
    py: 12,
  };

  constructor(props) {
    super(props);
    this.textareaRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.autoSize) {
      this._adjustHeight(this.textareaRef.current);
    }
  }

  _adjustHeight(target) {
    // Reset height to 0 so component will auto-size
    target.style.height = 0;
    // Use the scroll height to define size
    target.style.height = `${target.scrollHeight}px`;
  }

  onChange = e => {
    const { onChange, autoSize } = this.props;

    if (onChange) {
      onChange(e);
    }

    if (autoSize) {
      this._adjustHeight(e.target);
    }
  };

  render() {
    const { autoSize, showCount, resize, inputRef, ...props } = this.props;
    const value = props.value || props.defaultValue || '';

    const textarea = (
      <TextArea
        ref={combineRefs(this.textareaRef, inputRef)}
        as="textarea"
        resize={resize || (autoSize ? 'none' : 'vertical')}
        {...props}
        onChange={this.onChange}
      />
    );

    return !showCount ? (
      textarea
    ) : (
      <Container position="relative">
        {textarea}
        <Container position="absolute" bottom="1.25em" right="1.5em">
          <StyledTag>
            <span>{value.length}</span>
            {props.maxLength && <span> / {props.maxLength}</span>}
          </StyledTag>
        </Container>
      </Container>
    );
  }
}
