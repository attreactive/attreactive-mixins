/**
 * AttrEactive Mixins
 */
/* global afterEach beforeEach describe it jest pit xdescribe xit */
/* global expect */

jest.autoMockOff();

var LinkedStateMixin = require("../../common/LinkedStateMixin");
var ValidationMixin = require("../ValidationMixin");
var React = require("react/addons");
var validationConstraints = require("attreactive-validator/lib/validationConstraints");

var UserForm = React.createClass({
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
      }.bind(this)
    };
  },

  render: function() {
    return React.DOM.div({},
      React.DOM.input({ref: 'input', valueLink: this.linkValueLink('email')})
    );
  }
});

var UsersForm = React.createClass({
  mixins: [LinkedStateMixin, ValidationMixin],

  getInitialState: function() {
    return {
      data: {
        users: []
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
          validity: this.validity.users[index]
        })
      }, this),
      React.DOM.button({ref: 'button', onClick: this._addUser}, 'Add user')
    );
  },

  _addUser: function() {
    this.setState({
      data: {
        users: this.state.data.users.concat([{email: ''}])
      }
    });
  }
});

describe('ValidationMixin', function() {
  it('should validate childs', function() {
    var form = React.addons.TestUtils.renderIntoDocument(UsersForm({}));

    expect(form.validity).toEqual({
      invalid: true,
      valid: false,
      users: {
        invalid: true,
        valid: false,
        length: 0,
        minLength: {
          invalid: true,
          valid: false
        }
      }
    });

    React.addons.TestUtils.Simulate.click(form.refs.button.getDOMNode());

    expect(form.validity).toEqual({
      invalid: true,
      valid: false,
      users: {
        invalid: true,
        valid: false,
        length: 1,
        minLength: {
          invalid: false,
          valid: true
        },
        0: {
          invalid: true,
          valid: false,
          email: {
            invalid: true,
            valid: false,
            notEmpty: {
              invalid: true,
              valid: false
            },
            email: {
              invalid: false,
              valid: true
            }
          }
        }
      }
    });

    React.addons.TestUtils.Simulate.change(form.refs['user-0'].refs.input.getDOMNode(), {
      target: {
        value: 't'
      }
    });

    expect(form.validity).toEqual({
      invalid: true,
      valid: false,
      users: {
        invalid: true,
        valid: false,
        length: 1,
        minLength: {
          invalid: false,
          valid: true
        },
        0: {
          invalid: true,
          valid: false,
          email: {
            invalid: true,
            valid: false,
            notEmpty: {
              invalid: false,
              valid: true
            },
            email: {
              invalid: true,
              valid: false
            }
          }
        }
      }
    });

    React.addons.TestUtils.Simulate.change(form.refs['user-0'].refs.input.getDOMNode(), {
      target: {
        value: 'test@example.com'
      }
    });

    expect(form.validity).toEqual({
      invalid: false,
      valid: true,
      users: {
        invalid: false,
        valid: true,
        length: 1,
        minLength: {
          invalid: false,
          valid: true
        },
        0: {
          invalid: false,
          valid: true,
          email: {
            invalid: false,
            valid: true,
            notEmpty: {
              invalid: false,
              valid: true
            },
            email: {
              invalid: false,
              valid: true
            }
          }
        }
      }
    });
  });
});
