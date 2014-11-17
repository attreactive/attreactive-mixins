/**
 * AttrEactive Mixins
 */
/* global afterEach beforeEach describe it jest pit xdescribe xit */
/* global expect */

jest.dontMock("../RangeMixin");
jest.dontMock("react/addons");

var RangeMixin = require("../RangeMixin");
var React = require("react/addons");

var Range = React.createClass({
  mixins: [RangeMixin],

  render: function() {
    return this.transferPropsTo(
      React.DOM.div({ref: 'wrapper'},
        React.DOM.div({ref: 'line', style: {width: this.getPercentageString()}}),
        React.DOM.div({ref: 'handle', style: {left: this.getPercentageString()}})
      )
    );
  }
});

describe('RangeMixin', function() {
  it('should work', function() {
    var event;

    var link = {
      value: 20,
      requestChange: jest.genMockFunction()
    };

    var range = React.addons.TestUtils.renderIntoDocument(Range({
      valueLink: link,
      min: 0,
      max: 100,
      step: 10,
      style: {
        width: 100
      }
    }));

    expect(range.refs.line.getDOMNode().style.width).toEqual('20%');
    expect(range.refs.handle.getDOMNode().style.left).toEqual('20%');

    event = document.createEvent('HTMLEvents');
    event.initEvent('mousedown', true, true);
    range.refs.handle.getDOMNode().dispatchEvent(event);

    event = document.createEvent('HTMLEvents');
    event.initEvent('mousemove', true, true);
    event.clientX = 26;
    document.dispatchEvent(event);

    expect(link.requestChange).toBeCalledWith(30);

    link = {
      value: 30,
      requestChange: jest.genMockFunction()
    };
    range.setProps({valueLink: link});

    expect(range.refs.line.getDOMNode().style.width).toEqual('30%');
    expect(range.refs.handle.getDOMNode().style.left).toEqual('30%');

    event = document.createEvent('HTMLEvents');
    event.initEvent('mouseup', true, true);
    document.dispatchEvent(event);

    event = document.createEvent('HTMLEvents');
    event.initEvent('mousemove', true, true);
    event.clientX = 55;
    document.dispatchEvent(event);

    expect(link.requestChange).not.toBeCalled();
  });
});
