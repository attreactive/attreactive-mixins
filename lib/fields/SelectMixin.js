/**
 * AttrEactive Mixins
 */

var React = require("react");
var $ = require('jquery');

function getValue(object, field) {
  if (typeof object[field] === 'function') {
    return object[field]();
  } else {
    return object[field];
  }
}

var SelectMixin = {
  propTypes: {
    options: React.PropTypes.array,
    keyField: React.PropTypes.string,
    textField: React.PropTypes.string,
    valueLink: React.PropTypes.shape({
      value: React.PropTypes.any.isRequired,
      requestChange: React.PropTypes.func.isRequired
    }).isRequired
  },

  getDefaultProps: function() {
    return {
      type: 'object',
      options: [],
      keyField: 'value',
      textField: 'text'
    };
  },

  getInitialState: function() {
    return {
      opened: false
    };
  },

  componentDidMount: function() {
    if (!this.refs || !this.refs.head) return;

    $(this.refs.head.getDOMNode()).on('click', this._handleHeadClick);
    $(document).on('click', this._handleDocumentClick);
  },

  componentWillUnmount: function() {
    $(document).off('click', this._handleDocumentClick);
  },

  _handleHeadClick: function() {
    if (this.state.opened) return;

    this.setState({opened: true});
  },

  _handleDocumentClick: function(event) {
    if (!this.state.opened) return;

    var $target = $(event.target);
    var $this = $(this.getDOMNode());

    if ($this.is($target).length > 0 || $this.has($target).length > 0) return;

    this.setState({opened: false});
  },

  isOpened: function() {
    return this.state.opened;
  },

  getCurrentValueText: function() {
    if (!this.props.valueLink || !this.props.valueLink.value) return null;

    if (this.props.type == 'object') {
      return getValue(this.props.valueLink.value, this.props.textField);
    } else {
      var object = this.props.options.filter(function(option) {
        return getValue(option, this.props.keyField) == this.props.valueLink.value;
      }, this).shift();

      return object && getValue(object, this.props.textField);
    }
  },

  getOptions: function() {
    return this.props.options.map(function(option) {
      var value = getValue(option, this.props.keyField);

      return {
        value: value,
        text: getValue(option, this.props.textField),
        clickHandler: function() {
          if (!this.props.valueLink) return;

          if (this.props.type == 'object') {
            this.props.valueLink.requestChange(option);
          } else {
            this.props.valueLink.requestChange(value);
          }

          this.setState({opened: false});
        }.bind(this)
      };
    }, this);
  }
};

module.exports = SelectMixin;
