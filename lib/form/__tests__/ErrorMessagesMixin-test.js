/**
 * AttrEactive Mixins
 */
/* global afterEach beforeEach describe it jest pit xdescribe xit */
/* global expect */

jest.autoMockOff();

var ErrorMessagesMixin = require("../ErrorMessagesMixin");
var ValidationMixin = require("../ValidationMixin");
var LinkedStateMixin = require("../../common/LinkedStateMixin");
var React = require("react/addons");
var validationConstraints = require("attreactive-validator/lib/validationConstraints");

var ErrorMessages = React.createClass({
  render: function() {
    return (
      React.DOM.span({className: 'errorMessages'},
        this.props.messages.map(function(message) {
          return React.DOM.span({}, message);
        })
      )
    );
  }
});

var UserForm = React.createClass({
  mixins: [ErrorMessagesMixin.Child],

  ErrorMessagesComponent: ErrorMessages,

  propTypes: {
    valueLink: React.PropTypes.shape({
      value: React.PropTypes.shape({
        email: React.PropTypes.string.isRequired
      }).isRequired,
      requestChange: React.PropTypes.func.isRequired
    }).isRequired
  },

  // TODO: export as mixin
  linkValueLink: function(key) {
    return {
      value: this.props.valueLink.value[key],
      requestChange: function(value) {
        this.props.valueLink.value[key] = value;
        this.props.valueLink.requestChange(this.props.valueLink.value);
        this.setErrorMessageInputChanged(key);
      }.bind(this)
    };
  },

  render: function() {
    return React.DOM.div({},
      React.DOM.input({ref: 'input', valueLink: this.linkValueLink('email'), onBlur: this.getErrorMessageInputBluredSetter('email')}),
      this.renderErrorMessage('email'),
      React.DOM.button({ref: 'remove', onClick: this.props.removeUser})
    );
  }
});

var UsersForm = React.createClass({
  mixins: [LinkedStateMixin, ValidationMixin, ErrorMessagesMixin],

  ErrorMessagesComponent: ErrorMessages,

  getInitialState: function() {
    return {
      data: {
        users: [
          {email: ''}
        ]
      }
    };
  },

  getValidationStateRoot: function(state) {
    return state.data;
  },

  getValidationConfig: function() {
    return {
      users: {
        minLength: validationConstraints.minLength(1),
        $iterate: {
          email: {
            notEmpty: validationConstraints.notEmpty(),
            email: validationConstraints.email()
          }
        }
      }
    }
  },

  getErrorMessagesConfig: function() {
    return {
      users: {
        $iterate: {
          email: {
            notEmpty: '',
            email: ''
          }
        }
      }
    };
  },

  render: function() {
    return React.DOM.form({},
      this.state.data.users.map(function(user, index) {
        return UserForm({
          ref: 'user-' + index,
          valueLink: {
            value: user,
            requestChange: function(user) {
              var users = this.state.data.users.concat();
              users[index] = user;
              this.setState({
                data: {
                  users: users
                }
              });
            }.bind(this)
          },
          removeUser: this._removeUser.bind(this, index),
          validity: this.validity.users[index],
          errorsLink: this.linkErrors(['users', index].join('.'))
        })
      }, this),
      React.DOM.button({ref: 'button', onClick: this._addUser}, 'Add user')
    );
  },

  _removeUser: function(index) {
    this.state.data.users.splice(index, 1);
    this.forceUpdate();
  },

  _addUser: function() {
    this.setState({
      data: {
        users: this.state.data.users.concat([{email: ''}])
      }
    });
  }
});

describe('ErrorMessagesMixin', function() {
  it('should not show error messages on blur without changes', function() {
    var form = React.addons.TestUtils.renderIntoDocument(UsersForm({}));

    expect(React.addons.TestUtils.scryRenderedDOMComponentsWithClass(form, 'errorMessages').length).toBe(0);

    React.addons.TestUtils.Simulate.focus(form.refs['user-0'].refs.input.getDOMNode());
    React.addons.TestUtils.Simulate.blur(form.refs['user-0'].refs.input.getDOMNode());

    expect(React.addons.TestUtils.scryRenderedDOMComponentsWithClass(form, 'errorMessages').length).toBe(0);
  });

  it('should not show error messages before blur', function() {
    var form = React.addons.TestUtils.renderIntoDocument(UsersForm({}));

    expect(React.addons.TestUtils.scryRenderedDOMComponentsWithClass(form, 'errorMessages').length).toBe(0);

    React.addons.TestUtils.Simulate.focus(form.refs['user-0'].refs.input.getDOMNode());
    React.addons.TestUtils.Simulate.change(form.refs['user-0'].refs.input.getDOMNode(), {
      target: {
        value: 't'
      }
    });

    expect(React.addons.TestUtils.scryRenderedDOMComponentsWithClass(form, 'errorMessages').length).toBe(0);
  });

  it('should show error messages after change and blur', function() {
    var form = React.addons.TestUtils.renderIntoDocument(UsersForm({}));

    expect(React.addons.TestUtils.scryRenderedDOMComponentsWithClass(form, 'errorMessages').length).toBe(0);

    React.addons.TestUtils.Simulate.focus(form.refs['user-0'].refs.input.getDOMNode());
    React.addons.TestUtils.Simulate.change(form.refs['user-0'].refs.input.getDOMNode(), {
      target: {
        value: 't'
      }
    });
    React.addons.TestUtils.Simulate.blur(form.refs['user-0'].refs.input.getDOMNode());

    expect(React.addons.TestUtils.scryRenderedDOMComponentsWithClass(form, 'errorMessages').length).toBe(1);
  });

  it('should show all error messages on submit', function() {
    var form = React.addons.TestUtils.renderIntoDocument(UsersForm({}));

    form.showAllErrorMessages();

    expect(React.addons.TestUtils.scryRenderedDOMComponentsWithClass(form, 'errorMessages').length).toBe(1);
  });

  it('should hide all error messages after submit', function() {
    var form = React.addons.TestUtils.renderIntoDocument(UsersForm({}));

    form.showAllErrorMessages();

    expect(React.addons.TestUtils.scryRenderedDOMComponentsWithClass(form, 'errorMessages').length).toBe(1);

    form.hideAllErrorMessages();

    expect(React.addons.TestUtils.scryRenderedDOMComponentsWithClass(form, 'errorMessages').length).toBe(0);
  });

  it('should clear error messages after child form is removed', function() {
    var form = React.addons.TestUtils.renderIntoDocument(UsersForm({}));

    React.addons.TestUtils.Simulate.click(form.refs.button.getDOMNode());
    React.addons.TestUtils.Simulate.focus(form.refs['user-1'].refs.input.getDOMNode());
    React.addons.TestUtils.Simulate.change(form.refs['user-1'].refs.input.getDOMNode(), {
      target: {
        value: 't'
      }
    });
    React.addons.TestUtils.Simulate.blur(form.refs['user-1'].refs.input.getDOMNode());

    expect(React.addons.TestUtils.scryRenderedDOMComponentsWithClass(form, 'errorMessages').length).toBe(1);

    React.addons.TestUtils.Simulate.click(form.refs['user-1'].refs.remove.getDOMNode());

    expect(React.addons.TestUtils.scryRenderedDOMComponentsWithClass(form, 'errorMessages').length).toBe(0);

    React.addons.TestUtils.Simulate.click(form.refs.button.getDOMNode());

    expect(React.addons.TestUtils.scryRenderedDOMComponentsWithClass(form, 'errorMessages').length).toBe(0);
  });
});
