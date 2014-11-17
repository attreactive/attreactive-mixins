/**
 * AttrEactive Mixins
 */
/* global afterEach beforeEach describe it jest pit xdescribe xit */
/* global expect */

jest.dontMock("../CheckboxMixin");
jest.dontMock("react/addons");

var CheckboxMixin = require("../CheckboxMixin");
var React = require("react/addons");

var Checkbox = React.createClass({
  mixins: [CheckboxMixin],

  render: function() {
    return React.DOM.input({type: 'checkbox', onChange: this._handleChange});
  }
});

describe('CheckboxMixin', function() {
  describe('isChecked', function() {
    it('should return checked state', function() {
      var checkbox;

      checkbox = React.addons.TestUtils.renderIntoDocument(Checkbox({
        valueLink: {
          value: true,
          requestChange: jest.genMockFunction()
        }
      }));

      expect(checkbox.isChecked()).toBeTruthy();

      checkbox = React.addons.TestUtils.renderIntoDocument(Checkbox({
        valueLink: {
          value: false,
          requestChange: jest.genMockFunction()
        }
      }));

      expect(checkbox.isChecked()).toBeFalsy();
    });
  });

  describe('setChecked', function() {
    it('should change checked state', function() {
      var link = {
        value: false,
        requestChange: jest.genMockFunction()
      };

      var checkbox = React.addons.TestUtils.renderIntoDocument(Checkbox({
        valueLink: link
      }));

      checkbox.setChecked(true);

      expect(link.requestChange).toBeCalledWith(true);
    });
  });

  describe('_handleChange', function() {
    it('should change checked state', function() {
      var link = {
        value: false,
        requestChange: jest.genMockFunction()
      };

      var checkbox = React.addons.TestUtils.renderIntoDocument(Checkbox({
        valueLink: link
      }));

      React.addons.TestUtils.Simulate.change(checkbox.getDOMNode(), {target: {checked: true}});

      expect(link.requestChange).toBeCalledWith(true);
    });
  });
});
