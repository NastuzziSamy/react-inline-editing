import React from 'react';
import PropTypes from 'prop-types';

const ENTER_KEY_CODE = 13;
const DEFAULT_LABEL_PLACEHOLDER = "Click To Edit";

export default class Editable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editZone: this.props.editZone,
            text: this.props.text || "",
            validateOnEnterKey: this.props.validateOnEnterKey || (this.props.editZone === undefined),
            isEditable: this.props.isEditable != false,
        	isEditing: this.props.isEditing || false,
            isOver: false,
        };

        this._handleFocus = this._handleFocus.bind(this);
        this._handleChange = this._handleChange.bind(this);
        this._handleKeyDown = this._handleKeyDown.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            editZone: nextProps.editZone,
            text: nextProps.text || "",
            validateOnEnterKey: this.props.validateOnEnterKey || (nextProps.editZone === undefined),
            isEditable: nextProps.isEditable != false,
            isEditing: this.state.isEditing || nextProps.isEditing || false
        });
    }

    _isTextValueValid() {
        return (typeof this.state.text != "undefined" && this.state.text.trim().length > 0);
    }

    _handleFocus() {
        if (this.state.isEditing) {
            if (typeof this.props.onFocusOut === 'function') {
                this.props.onFocusOut(this.state.text);
            }
        }
        else if (typeof this.props.onFocus === 'function') {
            this.props.onFocus(this.state.text);
        }

        if (this._isTextValueValid()) {
            this.setState({
                isEditing: !this.state.isEditing,
            });
        }
        else if (this.state.isEditing) {
            this.setState({
                isEditing: this.props.emptyEdit || false
            });
        }
        else {
            this.setState({
                isEditing: true
            });
        }
    }

    _handleChange() {
    	this.setState({
        	text: this.textInput.value,
        });
    }

    _handleKeyDown(e) {
        if (this.state.validateOnEnterKey && e.keyCode === ENTER_KEY_CODE) {
            console.log(e, e.keyCode)
            this._handleEnterKey();
        }
    }

    _handleEnterKey() {
        this._handleFocus();
    }

    _getEditZone(text) {
        if (this.state.editZone) {
            var editZone;

            if (typeof this.state.editZone === 'function') {
                editZone = this.state.editZone(text);
            }
            else {
                editZone = this.state.editZone;
            }

            return (
                <span
                    onMouseOut={() => this.setState({ isOver: false })}
                    onChange={ this._handleChange }
                    onBlur={ this._handleFocus }
                    onKeyDown={ this._handleKeyDown }
                >
                    { editZone }
                </span>
            );
        }
        else {
            return (
                <input type="text"
                    value={ text }
                    onMouseOut={() => this.setState({ isOver: false })}
                    onChange={ this._handleChange }
                    onBlur={ this._handleFocus }
                    onKeyDown={ this._handleKeyDown }
                    autoFocus
                />
            );
        }
    }

    _getNormalZone(text) {
        const zone = this.props.children || text;
        var style = {
            cursor: 'pointer',
        };

        if (typeof zone !== 'string') {
            style.display = 'inherit';
        }

        const props = {
            className: this.props.className,
            onMouseOver: () => { this.state.isEditable && this.setState({ isOver: true }) },
            onMouseOut: () => { this.setState({ isOver: false }) },
            onClick: this._handleFocus,
            style: style
        };

        if (this.state.isOver) {
            return (
                <mark
                    { ...props }
                >
                    { zone }
                </mark>
            );
        }
        else {
            return (
                <span
                    { ...props }
                >
                    { zone }
                </span>
            );
        }
    }

    render() {
    	if (this.state.isEditable && this.state.isEditing) {
            return this._getEditZone(this.state.text);
        }
        else {
            const text = this._isTextValueValid() ? this.state.text : (this.props.labelPlaceHolder || DEFAULT_LABEL_PLACEHOLDER);

            return this._getNormalZone(text);
        }
    }
}

Editable.propTypes = {
    text: PropTypes.string.isRequired,
    isEditing: PropTypes.bool,
    isEditable: PropTypes.bool,
    emptyEdit: PropTypes.bool,
    labelPlaceHolder: PropTypes.string,

    labelClassName: PropTypes.string,
    labelFontSize: PropTypes.string,
    labelFontWeight: PropTypes.string,

    inputMaxLength: PropTypes.number,
    inputPlaceHolder: PropTypes.string,
    inputTabIndex: PropTypes.number,
    inputWidth: PropTypes.string,
    inputHeight: PropTypes.string,
    inputFontSize: PropTypes.string,
    inputFontWeight: PropTypes.string,
    inputClassName: PropTypes.string,
    inputBorderWidth: PropTypes.string,

    onFocus: PropTypes.func,
    onFocusOut: PropTypes.func
};
