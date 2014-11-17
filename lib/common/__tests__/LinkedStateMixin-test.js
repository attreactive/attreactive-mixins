/**
 * AttrEactive Mixins
 */
/* global afterEach beforeEach describe it jest pit xdescribe xit */
/* global expect */

jest.dontMock("../LinkedStateMixin");
jest.dontMock("react/addons");

var LinkedStateMixin = require("../LinkedStateMixin");
var React = require("react/addons");

var Component = React.createClass({
  mixins: [LinkedStateMixin],

  getInitialState: function() {
    return {
      value: 'a'
    }
  },

  render: function() {
    return React.DOM.div();
  }
})

describe('LinkedStateMixin', function() {
  describe('linkState', function() {
    it('should create link', function() {
      var component, link;

      component = React.addons.TestUtils.renderIntoDocument(Component());

      link = component.linkState('value');
      expect(link.value).toEqual('a');

      link.requestChange('b');
      expect(component.state.value).toEqual('b');

      link = component.linkState('value');
      expect(link.value).toEqual('b');
    });

    it('should call callback', function() {
      var component = React.addons.TestUtils.renderIntoDocument(Component());
      var callback = jest.genMockFunction();
      var link = component.linkState('value', callback);
      link.requestChange('b');

      expect(callback).toBeCalledWith('b');
    });
  });
});
