/**
 * AttrEactive Mixins
 */
/* global afterEach beforeEach describe it jest pit xdescribe xit */
/* global expect */

jest.dontMock("../SelectMixin");
jest.dontMock("react/addons");

var SelectMixin = require("../SelectMixin");
var React = require("react/addons");

var Select = React.createClass({
  mixins: [SelectMixin],

  render: function() {
    return (
      React.DOM.div({},
        React.DOM.div({ref: 'head'}, this.getCurrentValueText()),
        React.DOM.ul({ref: 'body', style: {display: this.isOpened() ? 'block' : 'none'}},
          this.getOptions().map(function(option) {
            return React.DOM.li({onClick: option.clickHandler, ref: 'option-' + option.value}, option.text);
          })
        )
      )
    );
  }
});

describe('SelectMixin', function() {
  it('should work with objects', function() {
    var select = React.addons.TestUtils.renderIntoDocument(Select({
      valueLink: {
        value: {myValue: 'a', myText: 'A'},
        requestChange: jest.genMockFunction()
      },
      options: [
        {myValue: 'a', myText: 'A'},
        {myValue: 'b', myText: 'B'}
      ],
      keyField: 'myValue',
      textField: 'myText'
    }));

    expect(select.refs.head.getDOMNode().innerHTML).toEqual('A');
    expect(select.refs.body.getDOMNode().style.display).toEqual('none');

    event = document.createEvent('HTMLEvents');
    event.initEvent('click', true, true);
    select.refs.head.getDOMNode().dispatchEvent(event);

    expect(select.refs.body.getDOMNode().style.display).toEqual('block');

    React.addons.TestUtils.Simulate.click(select.refs['option-b'].getDOMNode());

    expect(select.props.valueLink.requestChange).toBeCalledWith({myValue: 'b', myText: 'B'})

    select.setProps({
      valueLink: {
        value: {myValue: 'b', myText: 'B'},
        requestChange: jest.genMockFunction()
      }
    });

    expect(select.refs.head.getDOMNode().innerHTML).toEqual('B');
    expect(select.refs.body.getDOMNode().style.display).toEqual('none');

    event = document.createEvent('HTMLEvents');
    event.initEvent('click', true, true);
    select.refs.head.getDOMNode().dispatchEvent(event);

    expect(select.refs.body.getDOMNode().style.display).toEqual('block');

    event = document.createEvent('HTMLEvents');
    event.initEvent('click', true, true);
    document.dispatchEvent(event);

    expect(select.refs.body.getDOMNode().style.display).toEqual('none');
  });

  it('should work with values', function() {
    var select = React.addons.TestUtils.renderIntoDocument(Select({
      type: 'value',
      valueLink: {
        value: 'a',
        requestChange: jest.genMockFunction()
      },
      options: [
        {myValue: 'a', myText: 'A'},
        {myValue: 'b', myText: 'B'}
      ],
      keyField: 'myValue',
      textField: 'myText'
    }));

    expect(select.refs.head.getDOMNode().innerHTML).toEqual('A');
    expect(select.refs.body.getDOMNode().style.display).toEqual('none');

    event = document.createEvent('HTMLEvents');
    event.initEvent('click', true, true);
    select.refs.head.getDOMNode().dispatchEvent(event);

    expect(select.refs.body.getDOMNode().style.display).toEqual('block');

    React.addons.TestUtils.Simulate.click(select.refs['option-b'].getDOMNode());

    expect(select.props.valueLink.requestChange).toBeCalledWith('b');

    select.setProps({
      valueLink: {
        value: 'b',
        requestChange: jest.genMockFunction()
      }
    });

    expect(select.refs.head.getDOMNode().innerHTML).toEqual('B');
    expect(select.refs.body.getDOMNode().style.display).toEqual('none');

    event = document.createEvent('HTMLEvents');
    event.initEvent('click', true, true);
    select.refs.head.getDOMNode().dispatchEvent(event);

    expect(select.refs.body.getDOMNode().style.display).toEqual('block');

    event = document.createEvent('HTMLEvents');
    event.initEvent('click', true, true);
    document.dispatchEvent(event);

    expect(select.refs.body.getDOMNode().style.display).toEqual('none');
  });
});
