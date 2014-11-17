/**
 * AttrEactive Mixins
 */

var React = require('react');
var $ = require('jquery');

var RangeMixin = {
  propTypes: {
    valueLink: React.PropTypes.shape({
      value: React.PropTypes.number.isRequired,
      requestChange: React.PropTypes.func.isRequired
    }).isRequired,
    min: React.PropTypes.number,
    max: React.PropTypes.number,
    step: React.PropTypes.number,
    onMouseUp: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      min: 1,
      max: 100,
      step: 1
    };
  },

  getInitialState: function() {
    return {
      catched: false,
      leftPosition: null,
      rightPosition: null,
      width: null
    };
  },

  componentDidMount: function() {
    if (!this.refs || !this.refs.handle) {
      return;
    }

    var handleNode = this.refs.handle.getDOMNode();
    $(handleNode).mousedown(this._handleMouseDown);
  },

  getValue: function() {
    return this.props.valueLink ?
      this.props.valueLink.value :
      this.props.min;
  },

  getPercentage: function() {
    var size = this.props.max - this.props.min;

    return (this.getValue() - this.props.min) / size * 100;
  },

  getPercentageString: function() {
    return this.getPercentage() + '%';
  },

  _handleMouseDown: function(event) {
    event.preventDefault();

    if (!this.refs || !this.refs.wrapper) return;

    var wrapperNode = this.refs.wrapper.getDOMNode();
    var leftPosition = $(wrapperNode).offset().left;
    var rightPosition = leftPosition + $(wrapperNode).width();
    var width = rightPosition - leftPosition;
    var stepSize = width / (this.props.max - this.props.min);

    this.setState({
      catched: true,
      leftPosition: leftPosition,
      rightPosition: rightPosition,
      width: width,
      stepSize: stepSize
    }, function() {
      $(document).mousemove(this._handleMouseMove);
      $(document).mouseup(this._handleMouseUp);
    }.bind(this));
  },

  _handleMouseMove: function(event) {
    if (!this.props.valueLink) return;

    var position = event.clientX - this.state.leftPosition;
    if (position < 0) position = 0;
    if (position > this.state.width) position = this.state.width;

    var value = Math.round((position / this.state.stepSize + this.props.min) / this.props.step) * this.props.step;

    if (value != this.getValue()) {
      this.props.valueLink.requestChange(value);
    }
  },

  _handleMouseUp: function() {
    this.setState({
      catched: false
    });

    $(document).off('mousemove', this._handleMouseMove);
    $(document).off('mouseup', this._handleMouseUp);

    if (this.props.onMouseUp) {
      this.props.onMouseUp();
    }
  }
};

module.exports = RangeMixin;
