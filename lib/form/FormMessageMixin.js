/**
 * AttrEactive Mixins
 */

var $ = require("jquery");

var FormMessageMixin = {
  getInitialState: function() {
    return {
      formMessageVisible: false,
      formMessageType: null,
      formMessageText: null
    };
  },

  showFormMessage: function(type, text) {
    this._formMessageStep1(type, text);
  },

  _formMessageStep1: function(type, text) {
    this.setState({
      formMessageVisible: true,
      formMessageType: type,
      formMessageText: text
    }, this._formMessageStep2);
  },

  _formMessageStep2: function() {
    setTimeout(this._formMessageStep3, 5000);
  },

  _formMessageStep3: function() {
    if (this.refs && this.refs.formMessage) {
      $(this.refs.formMessage.getDOMNode()).animate({opacity: 0}, this._formMessageStep4);
    } else {
      this._formMessageStep4();
    }
  },

  _formMessageStep4: function() {
    this.setState({
      formMessageVisible: false,
      formMessageType: null,
      formMessageText: null
    });
  }
};

module.exports = FormMessageMixin;
