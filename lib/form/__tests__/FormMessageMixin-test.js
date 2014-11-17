/**
 * AttrEactive Mixins
 */
/* global afterEach beforeEach describe it jest pit xdescribe xit */
/* global expect */

jest.autoMockOff();

var FormMessageMixin = require("../FormMessageMixin");
var React = require("react/addons");

var Form = React.createClass({
  mixins: [FormMessageMixin],

  render: function() {
    return React.DOM.div({});
  }
});

describe('FormMessageMixin', function() {
  it('should work', function() {
    var form = React.addons.TestUtils.renderIntoDocument(Form({}));

    expect(form.state).toEqual({
      formMessageVisible: false,
      formMessageType: null,
      formMessageText: null
    });

    form.showFormMessage('error', 'message');

    expect(form.state).toEqual({
      formMessageVisible: true,
      formMessageType: 'error',
      formMessageText: 'message'
    });

    jest.runAllTimers();

    expect(form.state).toEqual({
      formMessageVisible: false,
      formMessageType: null,
      formMessageText: null
    });
  });
});
