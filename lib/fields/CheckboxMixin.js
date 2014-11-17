/**
 * AttrEactive Mixins
 */

var React = require('react');

var CheckboxMixin = {
  propTypes: {
    valueLink: React.PropTypes.shape({
      value: React.PropTypes.bool.isRequired,
      requestChange: React.PropTypes.func.isRequired
    }).isRequired
  },

  isChecked: function() {
    return this.props.valueLink && this.props.valueLink.value;
  },

  setChecked: function(checked) {
    if (!this.props.valueLink) return;

    this.props.valueLink.requestChange(checked);
  },

  _handleChange: function(event) {
    this.setChecked(event.target.checked);
  }
};

module.exports = CheckboxMixin;
