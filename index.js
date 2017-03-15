'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*********
Display: React,
Event handling: Reactive JS
Status handling: Redux
**********/

/*********
* REACT
**********/
var Container = function Container(_ref) {
  var hue = _ref.hue;
  var saturation = _ref.saturation;
  var lightness = _ref.lightness;
  var red = _ref.red;
  var green = _ref.green;
  var blue = _ref.blue;
  var hex = _ref.hex;
  var setHue = _ref.setHue;
  var setSaturation = _ref.setSaturation;
  var setLightness = _ref.setLightness;

  return React.createElement(
    'div',
    { id: 'container' },
    React.createElement(Hue, { hue: hue, saturation: saturation, lightness: lightness, setHue: setHue }),
    React.createElement(Saturation, { hue: hue, saturation: saturation, lightness: lightness, setSaturation: setSaturation }),
    React.createElement(Lightness, { hue: hue, saturation: saturation, lightness: lightness, setLightness: setLightness }),
    React.createElement(
      'div',
      { id: 'footer' },
      React.createElement(
        'div',
        null,
        'hsl(' + hue + ', ' + saturation + '%, ' + lightness + '%)'
      ),
      React.createElement(
        'div',
        null,
        'rgb(' + red + ', ' + green + ', ' + blue + ')'
      ),
      React.createElement(
        'div',
        null,
        hex
      )
    )
  );
};

var Hue = function (_React$Component) {
  _inherits(Hue, _React$Component);

  function Hue(_ref2) {
    var hue = _ref2.hue;
    var saturation = _ref2.saturation;
    var lightness = _ref2.lightness;
    var setHue = _ref2.setHue;

    _classCallCheck(this, Hue);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, { hue: hue, saturation: saturation, lightness: lightness, setHue: setHue }));

    var padding = 60;
    var innerSize = 300;
    _this.radius = innerSize / 2;
    _this.outterSize = innerSize + padding;
    _this.centerOffset = _this.outterSize / 2;

    _this.state = {
      dragging: false
    };

    // These are set in the render method
    _this.canvas = null;
    _this.selector = null;
    return _this;
  }

  Hue.prototype.render = function render() {
    var _this2 = this;

    return React.createElement(
      'svg',
      { ref: function ref(canvas) {
          _this2.canvas = canvas;
        },
        width: this.outterSize, height: this.outterSize,
        viewBox: '0 0 ' + this.outterSize + ' ' + this.outterSize,
        xmlns: 'http://www.w3.org/2000/svg', version: '1.1' },
      React.createElement(
        'g',
        { transform: 'translate(' + this.centerOffset + ',' + this.centerOffset + ')' },
        Array.from({ length: 360 }, function (value, key) {
          return React.createElement(HueSlice, {
            degree: key,
            radius: _this2.radius,
            color: 'hsl(' + key + ', ' + _this2.props.saturation + '%, ' + _this2.props.lightness + '%)',
            marker: false });
        }),
        React.createElement(
          'g',
          { ref: function ref(selector) {
              _this2.selector = selector;
            } },
          React.createElement(HueSlice, {
            degree: this.props.hue,
            radius: this.radius,
            color: this.state.dragging ? 'hsl(' + this.props.hue + ', ' + this.props.saturation + '%, ' + this.props.lightness + '%)' : "white",
            marker: true })
        ),
        React.createElement(
          'text',
          {
            x: '10',
            y: '30',
            textAnchor: 'middle',
            fill: 'hsl(' + this.props.hue + ', ' + this.props.saturation + '%, ' + this.props.lightness + '%)',
            stroke: 'hsl(' + this.props.hue + ', ' + this.props.saturation + '%, ' + this.props.lightness + '%)' },
          this.props.hue,
          '°'
        ),
        React.createElement(
          'text',
          {
            className: 'label',
            x: '0',
            y: '60',
            textAnchor: 'middle',
            fill: 'hsl(' + this.props.hue + ', ' + this.props.saturation + '%, ' + this.props.lightness + '%)',
            stroke: 'hsl(' + this.props.hue + ', ' + this.props.saturation + '%, ' + this.props.lightness + '%)' },
          'Hue'
        )
      )
    );
  };

  Hue.prototype.componentDidMount = function componentDidMount() {
    var _this3 = this;

    // Event handling using Reactive JS
    var mouseDowns = Rx.Observable.fromEvent(this.selector, "mousedown");
    var mouseMoves = Rx.Observable.fromEvent(this.canvas, "mousemove");
    var mouseUps = Rx.Observable.fromEvent(this.canvas, "mouseup");
    var mouseLeaves = Rx.Observable.fromEvent(this.canvas, "mouseleave");

    var touchStarts = Rx.Observable.fromEvent(this.selector, "touchstart");
    var touchMoves = Rx.Observable.fromEvent(this.selector, "touchmove");
    var touchEnds = Rx.Observable.fromEvent(this.canvas, "touchend");

    var mouseDrags = mouseDowns.concatMap(function (clickEvent) {
      var xMouseShouldBe = Math.sin(_this3.props.hue / 180 * Math.PI) * _this3.radius;
      var yMouseShouldBe = -Math.cos(_this3.props.hue / 180 * Math.PI) * _this3.radius;
      var xMouseIs = clickEvent.clientX;
      var yMouseIs = clickEvent.clientY;
      var xMouseDelta = xMouseIs - xMouseShouldBe;
      var yMouseDelta = yMouseIs - yMouseShouldBe;
      return mouseMoves.takeUntil(mouseUps.merge(mouseLeaves)).map(function (moveEvent) {
        var xRelativeToCenter = moveEvent.clientX - xMouseDelta;
        var yRelativeToCenter = moveEvent.clientY - yMouseDelta;
        var degree = Math.atan(yRelativeToCenter / xRelativeToCenter) * 180 / Math.PI + 90 + (xRelativeToCenter >= 0 ? 0 : 180);
        return parseInt(degree);
      });
    });

    var touchDrags = touchStarts.concatMap(function (startEvent) {
      startEvent.preventDefault();
      var xTouchShouldBe = Math.sin(_this3.props.hue / 180 * Math.PI) * _this3.radius;
      var yTouchShouldBe = -Math.cos(_this3.props.hue / 180 * Math.PI) * _this3.radius;
      var xTouchIs = startEvent.touches[0].clientX;
      var yTouchIs = startEvent.touches[0].clientY;
      var xTouchDelta = xTouchIs - xTouchShouldBe;
      var yTouchDelta = yTouchIs - yTouchShouldBe;
      return touchMoves.takeUntil(touchEnds).map(function (moveEvent) {
        moveEvent.preventDefault();
        var xRelativeToCenter = moveEvent.touches[0].clientX - xTouchDelta;
        var yRelativeToCenter = moveEvent.touches[0].clientY - yTouchDelta;
        var degree = Math.atan(yRelativeToCenter / xRelativeToCenter) * 180 / Math.PI + 90 + (xRelativeToCenter >= 0 ? 0 : 180);
        return parseInt(degree);
      });
    });

    var dragStarts = mouseDowns.merge(touchStarts);
    var drags = mouseDrags.merge(touchDrags);
    var dragEnds = mouseUps.merge(mouseLeaves).merge(touchEnds);

    dragStarts.forEach(function () {
      _this3.setState({ dragging: true });
    });

    drags.forEach(function (degree) {
      _this3.props.setHue(degree);
    });

    dragEnds.forEach(function () {
      _this3.setState({ dragging: false });
    });
  };

  return Hue;
}(React.Component);

var HueSlice = function HueSlice(_ref3) {
  var degree = _ref3.degree;
  var color = _ref3.color;
  var radius = _ref3.radius;
  var marker = _ref3.marker;

  var thickness = marker ? 5 : 1;
  var startX = Math.sin((degree - thickness) / 180 * Math.PI) * radius;
  var startY = -Math.cos((degree - thickness) / 180 * Math.PI) * radius;
  var endX = Math.sin((degree + thickness) / 180 * Math.PI) * radius;
  var endY = -Math.cos((degree + thickness) / 180 * Math.PI) * radius;
  return React.createElement('path', {
    className: marker && 'marker',
    d: 'M ' + startX + ' ' + startY + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + endX + ' ' + endY,
    stroke: color });
};

var Saturation = function Saturation(_ref4) {
  var hue = _ref4.hue;
  var saturation = _ref4.saturation;
  var lightness = _ref4.lightness;
  var setSaturation = _ref4.setSaturation;

  var gradient = React.createElement(
    'linearGradient',
    { id: 'Saturation', x1: '0', x2: '0', y1: '0', y2: '1' },
    React.createElement('stop', { offset: '0%', stopColor: 'hsl(' + hue + ', 100%, ' + lightness + '%)' }),
    React.createElement('stop', { offset: '100%', stopColor: 'hsl(' + hue + ', 0%, ' + lightness + '%)' })
  );
  return React.createElement(Percentage, {
    type: 'Saturation', value: saturation, gradient: gradient,
    hue: hue, saturation: saturation, lightness: lightness,
    set: setSaturation });
};

var Lightness = function Lightness(_ref5) {
  var hue = _ref5.hue;
  var saturation = _ref5.saturation;
  var lightness = _ref5.lightness;
  var setLightness = _ref5.setLightness;

  var gradient = React.createElement(
    'linearGradient',
    { id: 'Lightness', x1: '0', x2: '0', y1: '0', y2: '1' },
    React.createElement('stop', { offset: '0%', stopColor: 'hsl(' + hue + ', ' + saturation + '%, 100%)' }),
    React.createElement('stop', { offset: '50%', stopColor: 'hsl(' + hue + ', ' + saturation + '%, 50%)' }),
    React.createElement('stop', { offset: '100%', stopColor: 'hsl(' + hue + ', ' + saturation + '%, 0%)' })
  );
  return React.createElement(Percentage, {
    type: 'Lightness', value: lightness, gradient: gradient,
    hue: hue, saturation: saturation, lightness: lightness,
    set: setLightness });
};

var Percentage = function (_React$Component2) {
  _inherits(Percentage, _React$Component2);

  function Percentage(_ref6) {
    var type = _ref6.type;
    var value = _ref6.value;
    var gradient = _ref6.gradient;
    var hue = _ref6.hue;
    var saturation = _ref6.saturation;
    var lightness = _ref6.lightness;
    var set = _ref6.set;

    _classCallCheck(this, Percentage);

    var _this4 = _possibleConstructorReturn(this, _React$Component2.call(this, { type: type, value: value, gradient: gradient, hue: hue, saturation: saturation, lightness: lightness, set: set }));

    var padding = 60;
    _this4.padding = padding / 2;
    var innerSize = 300;
    _this4.innerSize = innerSize;
    _this4.outterSize = innerSize + padding;
    _this4.barOffsetX = innerSize - 20;

    _this4.state = {
      dragging: false
    };

    // These are set in the render method
    _this4.canvas = null;
    _this4.selector = null;
    return _this4;
  }

  Percentage.prototype.render = function render() {
    var _this5 = this;

    return React.createElement(
      'svg',
      { ref: function ref(canvas) {
          _this5.canvas = canvas;
        },
        width: this.outterSize, height: this.outterSize,
        viewBox: '0 0 ' + this.outterSize + ' ' + this.outterSize,
        xmlns: 'http://www.w3.org/2000/svg', version: '1.1' },
      React.createElement(
        'defs',
        null,
        this.props.gradient
      ),
      React.createElement(
        'g',
        { transform: 'translate(' + this.padding + ',' + this.padding + ')' },
        React.createElement('rect', { x: this.barOffsetX, y: '0',
          width: '20', height: this.innerSize,
          strokeWidth: '20',
          fill: 'url(#' + this.props.type + ')' }),
        React.createElement(
          'g',
          { ref: function ref(selector) {
              _this5.selector = selector;
            } },
          React.createElement('rect', { x: this.barOffsetX - 10, y: this.innerSize * (1 - this.props.value / 100) - 25 / 2,
            width: '40', height: '25',
            strokeWidth: '20',
            fill: this.state.dragging ? 'hsl(' + this.props.hue + ', ' + this.props.saturation + '%, ' + this.props.lightness + '%)' : "white" })
        ),
        React.createElement(
          'text',
          {
            x: '130',
            y: '180',
            textAnchor: 'middle',
            fill: 'hsl(' + this.props.hue + ', ' + this.props.saturation + '%, ' + this.props.lightness + '%)',
            stroke: 'hsl(' + this.props.hue + ', ' + this.props.saturation + '%, ' + this.props.lightness + '%)' },
          this.props.value,
          '%'
        ),
        React.createElement(
          'text',
          {
            className: 'label',
            x: '130',
            y: '210',
            textAnchor: 'middle',
            fill: 'hsl(' + this.props.hue + ', ' + this.props.saturation + '%, ' + this.props.lightness + '%)',
            stroke: 'hsl(' + this.props.hue + ', ' + this.props.saturation + '%, ' + this.props.lightness + '%)' },
          this.props.type
        )
      )
    );
  };

  Percentage.prototype.componentDidMount = function componentDidMount() {
    var _this6 = this;

    // Event handling using Reactive JS
    var mouseDowns = Rx.Observable.fromEvent(this.selector, "mousedown");
    var mouseMoves = Rx.Observable.fromEvent(this.canvas, "mousemove");
    var mouseUps = Rx.Observable.fromEvent(this.canvas, "mouseup");
    var mouseLeaves = Rx.Observable.fromEvent(this.canvas, "mouseleave");

    var touchStarts = Rx.Observable.fromEvent(this.selector, "touchstart");
    var touchMoves = Rx.Observable.fromEvent(this.selector, "touchmove");
    var touchEnds = Rx.Observable.fromEvent(this.canvas, "touchend");

    var mouseDrags = mouseDowns.concatMap(function (clickEvent) {
      var yMouseShouldBe = (1 - _this6.props.value / 100) * _this6.innerSize;
      var yMouseIs = clickEvent.clientY;
      var yMouseDelta = yMouseIs - yMouseShouldBe;
      return mouseMoves.takeUntil(mouseUps.merge(mouseLeaves)).map(function (moveEvent) {
        var y = moveEvent.clientY - yMouseDelta;
        var percentage = (1 - y / _this6.innerSize) * 100;
        percentage = Math.min(percentage, 100);
        percentage = Math.max(percentage, 0);
        return parseInt(percentage);
      });
    });

    var touchDrags = touchStarts.concatMap(function (startEvent) {
      startEvent.preventDefault();
      var yTouchShouldBe = (1 - _this6.props.value / 100) * _this6.innerSize;
      var yTouchIs = startEvent.touches[0].clientY;
      var yTouchDelta = yTouchIs - yTouchShouldBe;
      return touchMoves.takeUntil(touchEnds).map(function (moveEvent) {
        moveEvent.preventDefault();
        var y = moveEvent.touches[0].clientY - yTouchDelta;
        var percentage = (1 - y / _this6.innerSize) * 100;
        percentage = Math.min(percentage, 100);
        percentage = Math.max(percentage, 0);
        return parseInt(percentage);
      });
    });

    var dragStarts = mouseDowns.merge(touchStarts);
    var drags = mouseDrags.merge(touchDrags);
    var dragEnds = mouseUps.merge(mouseLeaves).merge(touchEnds);

    dragStarts.forEach(function () {
      _this6.setState({ dragging: true });
    });

    drags.forEach(function (percentage) {
      _this6.props.set(percentage);
    });

    dragEnds.forEach(function () {
      _this6.setState({ dragging: false });
    });
  };

  return Percentage;
}(React.Component);

/*********
* REDUX
**********/

var initialState = {
  hue: 158,
  saturation: 100,
  lightness: 53,
  red: 15,
  green: 255,
  blue: 167,
  hex: "#0FFFA7"
};

var hsl2rgb = function hsl2rgb(hue, saturation, lightness) {
  saturation /= 100;
  lightness /= 100;
  var C = (1 - Math.abs(2 * lightness - 1)) * saturation;
  var X = C * (1 - Math.abs(hue / 60 % 2 - 1));
  var m = lightness - C / 2;

  var _ref7 = 0 <= hue && hue < 60 && [C, X, 0] || 60 <= hue && hue < 120 && [X, C, 0] || 120 <= hue && hue < 180 && [0, C, X] || 180 <= hue && hue < 240 && [0, X, C] || 240 <= hue && hue < 300 && [X, 0, C] || 300 <= hue && hue < 360 && [C, 0, X];

  var R = _ref7[0];
  var G = _ref7[1];
  var B = _ref7[2];
  var _ref8 = [(R + m) * 255, (G + m) * 255, (B + m) * 255];
  R = _ref8[0];
  G = _ref8[1];
  B = _ref8[2];

  return [Math.round(R), Math.round(G), Math.round(B)];
};

var rgb2hex = function rgb2hex(red, green, blue) {
  red = red.toString(16).toUpperCase();
  green = green.toString(16).toUpperCase();
  blue = blue.toString(16).toUpperCase();
  red = red.length === 1 ? "0" + red : red;
  green = green.length === 1 ? "0" + green : green;
  blue = blue.length === 1 ? "0" + blue : blue;
  return '#' + red + green + blue;
};

var mainReducer = function mainReducer() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
  var action = arguments[1];

  var red = undefined;
  var green = undefined;
  var blue = undefined;
  var hex = undefined;
  switch (action.type) {
    case 'HUE':
      var _hsl2rgb = hsl2rgb(action.value, state.saturation, state.lightness);

      red = _hsl2rgb[0];
      green = _hsl2rgb[1];
      blue = _hsl2rgb[2];

      hex = rgb2hex(red, green, blue);
      return Object.assign({}, state, { hue: action.value, red: red, green: green, blue: blue, hex: hex });
    case 'SATURATION':
      var _hsl2rgb2 = hsl2rgb(state.hue, action.value, state.lightness);

      red = _hsl2rgb2[0];
      green = _hsl2rgb2[1];
      blue = _hsl2rgb2[2];

      hex = rgb2hex(red, green, blue);
      return Object.assign({}, state, { saturation: action.value, red: red, green: green, blue: blue, hex: hex });
    case 'LIGHTNESS':
      var _hsl2rgb3 = hsl2rgb(state.hue, state.saturation, action.value);

      red = _hsl2rgb3[0];
      green = _hsl2rgb3[1];
      blue = _hsl2rgb3[2];

      hex = rgb2hex(red, green, blue);
      return Object.assign({}, state, { lightness: action.value, red: red, green: green, blue: blue, hex: hex });
    default:
      return state;
  }
};

/* Import { createStore } from 'redux' */
var _Redux = Redux;
var createStore = _Redux.createStore;

var store = createStore(mainReducer);

/*********
* REACT-REDUX
**********/

var mapStateToProps = function mapStateToProps(state, ownProps) {
  return {
    hue: state.hue,
    saturation: state.saturation,
    lightness: state.lightness,
    red: state.red,
    green: state.green,
    blue: state.blue,
    hex: state.hex
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
  return {
    setHue: function setHue(value) {
      dispatch({
        type: 'HUE',
        value: value
      });
    },
    setSaturation: function setSaturation(value) {
      dispatch({
        type: 'SATURATION',
        value: value
      });
    },
    setLightness: function setLightness(value) {
      dispatch({
        type: 'LIGHTNESS',
        value: value
      });
    }
  };
};

/* Import { connect, Provider } from 'react-redux' */
var _ReactRedux = ReactRedux;
var connect = _ReactRedux.connect;
var Provider = _ReactRedux.Provider;

var ConnectedContainer = connect(mapStateToProps, mapDispatchToProps)(Container);

/*********
* REACT DOM + REDUX
**********/

ReactDOM.render(React.createElement(
  Provider,
  { store: store },
  React.createElement(ConnectedContainer, null)
), document.getElementById('app'));