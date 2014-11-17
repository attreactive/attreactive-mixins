/**
 * AttrEactive Mixins
 */

var ErrorMessagesMixin = {
  componentWillMount: function() {
    this._errorMessagesState = {
      changedProperties: [],
      followProperties: [],
      allVisible: false
    };
  },

  _getErrorMessageStateRoot: function(state) {
    return this.getValidationStateRoot ? this.getValidationStateRoot(state) : state;
  },

  componentWillUpdate: function(nextProps, nextState) {
    var root = this._getErrorMessageStateRoot(nextState);

    var filter = function(property) {
      var keys = property.split('.');
      var branch = root;

      return keys.every(function(key) {
        branch = branch[key];
        return typeof branch !== 'undefined';
      });
    }.bind(this);

    this._errorMessagesState.changedProperties = this._errorMessagesState.changedProperties.filter(filter);
    this._errorMessagesState.followProperties = this._errorMessagesState.followProperties.filter(filter);
  },

  _getErrorMessagesConfig: function() {
    return this.getErrorMessagesConfig ? this.getErrorMessagesConfig() : {};
  },

  getErrorMessages: function() {
    return this._getErrorMessages(
      this._getErrorMessageStateRoot(this.state),
      this.validity,
      this._getErrorMessagesConfig()
    );
  },

  _getErrorMessagesSlice: function(prefix) {
    var keys = prefix.split('.');
    var errorMessages = this.getErrorMessages();

    keys.forEach(function(key) {
      errorMessages = errorMessages[key];
    });

    return errorMessages;
  },

  isErrorMessageVisible: function(key) {
    var errorMessages = this.getErrorMessages();
    return errorMessages && errorMessages[key] && errorMessages[key].length > 0;
  },

  renderErrorMessage: function(key) {
    if (this.isErrorMessageVisible(key) && this.ErrorMessagesComponent) {
      return this.ErrorMessagesComponent({messages: this.getErrorMessages()[key]});
    }
  },

  _getErrorMessages: function(state, validity, errorMessagesConfig, prefix) {
    var errorMessagesArray = [];
    var errorMessagesHash = {};
    var leaf = true;

    Object.keys(errorMessagesConfig).forEach(function(key) {
      if (typeof errorMessagesConfig[key] === 'string') {
        if (validity[key].invalid) {
          if (this._errorMessagesState.allVisible || this._errorMessagesState.followProperties.indexOf(prefix) >= 0) {
            errorMessagesArray.push(errorMessagesConfig[key]);
          }
        }
      } else {
        leaf = false;

        if (key == '$iterate') {
          for (var i = 0; i < state.length; i++) {
            errorMessagesHash[i] = this._getErrorMessages(
              state[i],
              validity[i],
              errorMessagesConfig[key],
              prefix ? [prefix, i].join('.') : String(i)
            );
          }
        } else {
          errorMessagesHash[key] = this._getErrorMessages(
            state[key],
            validity[key],
            errorMessagesConfig[key],
            prefix ? [prefix, key].join('.') : key
          );
        }
      }
    }, this);

    return leaf ? errorMessagesArray : errorMessagesHash;
  },

  setErrorMessageInputChanged: function(key) {
    if (this._errorMessagesState.changedProperties.indexOf(key) < 0) {
      this._errorMessagesState.changedProperties.push(key);
      this.forceUpdate();
    }
  },

  getErrorMessageInputChangedSetter: function(key) {
    return this.setErrorMessageInputChanged.bind(this, key);
  },

  _getPrefixedErrorMessageInputChangedSetter: function(prefix) {
    return function(key) {
      return this.setErrorMessageInputChanged([prefix, key].join('.'));
    }.bind(this);
  },

  setErrorMessageInputBlured: function(key) {
    if (this._errorMessagesState.changedProperties.indexOf(key) >= 0 &&
        this._errorMessagesState.followProperties.indexOf(key) < 0)
    {
      this._errorMessagesState.followProperties.push(key);
      this.forceUpdate();
    }
  },

  getErrorMessageInputBluredSetter: function(key) {
    return this.setErrorMessageInputBlured.bind(this, key);
  },

  _getPrefixedErrorMessageInputBluredSetter: function(prefix) {
    return function(key) {
      return this.setErrorMessageInputBlured([prefix, key].join('.'));
    }.bind(this);
  },

  linkErrors: function(prefix) {
    return {
      errorMessages: this._getErrorMessagesSlice(prefix),
      setErrorMessageInputChanged: this._getPrefixedErrorMessageInputChangedSetter(prefix),
      setErrorMessageInputBlured: this._getPrefixedErrorMessageInputBluredSetter(prefix)
    };
  },

  showAllErrorMessages: function() {
    this._errorMessagesState.allVisible = true;
    this.forceUpdate();
  },

  hideAllErrorMessages: function() {
    this._errorMessagesState.changedProperties = [];
    this._errorMessagesState.followProperties = [];
    this._errorMessagesState.allVisible = false;
    this.forceUpdate();
  }
};

var ChildErrorMessagesMixin = {
  setErrorMessageInputChanged: function(key) {
    this.props.errorsLink.setErrorMessageInputChanged(key);
  },

  getErrorMessageInputChangedSetter: function(key) {
    return this.setErrorMessageInputChanged.bind(this, key);
  },

  setErrorMessageInputBlured: function(key) {
    this.props.errorsLink.setErrorMessageInputBlured(key);
  },

  getErrorMessageInputBluredSetter: function(key) {
    return this.setErrorMessageInputBlured.bind(this, key);
  },

  isErrorMessageVisible: function(key) {
    return this.props.errorsLink.errorMessages[key].length > 0;
  },

  renderErrorMessage: function(key) {
    if (this.isErrorMessageVisible(key) && this.ErrorMessagesComponent) {
      return this.ErrorMessagesComponent({messages: this.props.errorsLink.errorMessages[key]});
    }
  }
};

module.exports = ErrorMessagesMixin;
module.exports.Child = ChildErrorMessagesMixin;
