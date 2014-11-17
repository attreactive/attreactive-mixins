/**
 * AttrEactive Mixins
 */

var validator = require('attreactive-validator/lib/validator');

var ValidationMixin = {
  _getValidationConfig: function() {
    return this.getValidationConfig ? this.getValidationConfig() : {};
  },

  _getValidationStateRoot: function(state) {
    return this.getValidationStateRoot ? this.getValidationStateRoot(state) : state;
  },

  componentWillMount: function() {
    this.validity = validator.validate(
      this._getValidationStateRoot(this.state),
      this._getValidationConfig()
    );
  },

  componentWillUpdate: function(nextProps, nextState) {
    this._prevValidity = this.validity;
    var nextValidity = validator.validate(
      this._getValidationStateRoot(nextState),
      this._getValidationConfig()
    );

    if (this.componentWillValidated) {
      this.componentWillValidated(nextValidity);
    }

    this.validity = nextValidity;
  },

  componentDidUpdate: function() {
    if (this.componentDidValidated) {
      this.componentDidValidated(this._prevValidity);
    }
  }
};

module.exports = ValidationMixin;
