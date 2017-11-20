'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
   _inherits(App, _React$Component);

   function App(props) {
      _classCallCheck(this, App);

      var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

      _this.state = {
         dataset: null
      };
      _this.fetchData = _this.fetchData.bind(_this);
      _this.buildScatterplot = _this.buildScatterplot.bind(_this);
      _this.millisecondsToMinutesAndSeconds = _this.millisecondsToMinutesAndSeconds.bind(_this);
      return _this;
   }

   App.prototype.millisecondsToMinutesAndSeconds = function millisecondsToMinutesAndSeconds(milsec) {
      var seconds = Math.round(milsec / 1000);
      var minutes = Math.floor(seconds / 60);
      seconds %= 60;
      return minutes + ':' + seconds;
   };

   App.prototype.fetchData = function fetchData() {
      var _this2 = this;

      var url = 'https://raw.githubusercontent.com/hongyi0220/ProjectReferenceData/master/cyclist-data.json';
      fetch(url).then(function (response) {
         return response.json();
      }).then(function (responseJson) {
         return _this2.setState({ dataset: responseJson }, function () {
            return _this2.buildScatterplot(_this2.state.dataset);
         });
      });
   };

   App.prototype.buildScatterplot = function buildScatterplot(dataset) {
      var _this3 = this;

      var width = 1000;
      var height = 500;
      var padding = 50;
      var radius = 7;

      var svg = d3.select('.container').append('svg').attr('width', width).attr('height', height);

      var xScale = d3.scaleLinear().domain([d3.max(dataset, function (d) {
         return d.Seconds;
      }), d3.min(dataset, function (d) {
         return d.Seconds;
      })]).range([padding, width - padding * 2]);

      // Format place to rank
      dataset.forEach(function (d, i) {

         if (d.Place === 1) d.Rank = d.Place + 'st';else if (d.Place === 2) d.Rank = d.Place + 'nd';else if (d.Place === 3) d.Rank = d.Place + 'rd';else d.Rank = d.Place + 'th';
      });
      console.log(dataset);
      var yScale = d3.scaleBand().domain(dataset.map(function (d) {
         return d.Rank;
      })).range([padding, height - padding]);

      svg.selectAll('circle').data(dataset).enter().append('circle').attr("r", radius).attr("cx", function (d) {
         return xScale(d.Seconds);
      }).attr("cy", function (d) {
         return yScale(d.Rank);
      }).attr('fill', function (d) {
         if (d.Doping) return '#e74c3c';
      }).attr("class", 'plot').append('title').text(function (d) {
         return d.Doping;
      });
      // .on('mouseover', tip.show)
      // .on('mouseout', tip.hide);

      // This displays name of athlete of the scatterplot
      svg.selectAll('text').data(dataset).enter().append('text').attr('class', 'name').text(function (d) {
         return d.Name;
      }).attr('x', function (d) {
         return xScale(d.Seconds) + radius;
      }).attr('y', function (d) {
         return yScale(d.Rank) + 4;
      });

      var xAxis = d3.axisBottom(d3.scaleBand().domain(dataset.map(function (d) {
         var bestTime = d3.max(dataset, function (d) {
            return d.Seconds;
         });
         var milli = 1000;
         return _this3.millisecondsToMinutesAndSeconds((bestTime - d.Seconds) * milli);
      })).range([padding, width - padding * 2]));

      svg.append('g').attr('transform', 'translate(0,' + (height - padding) + ')').call(xAxis);

      var yAxis = d3.axisLeft(yScale);

      svg.append('g').attr('transform', 'translate(' + (padding - 10) + ',0)').call(yAxis);

      // Units
      svg.append('text').text('Ranking').attr('class', 'axis-label').attr('x', -95).attr('y', 55).attr('transform', 'rotate(-90)');

      svg.append('text').attr('class', 'axis-label').text('Minutes behind 1st place').attr('x', width - padding * 4.81).attr('y', height - padding - 5);
      var legendX = 650;
      var legendY = 250;
      // Graph legend
      svg.append('circle').attr('class', 'legend-circle').attr('r', radius).attr('cx', legendX).attr('cy', legendY).attr('fill', '#e74c3c');
      svg.append('text').attr('class', 'legend-text').text('Cyclist with doping allegations').attr('x', legendX + 10).attr('y', legendY + 3);
      svg.append('circle').attr('class', 'legend-circle').attr('r', radius).attr('cx', legendX).attr('cy', legendY + 18);
      svg.append('text').attr('class', 'legend-text').text('Clean').attr('x', legendX + 10).attr('y', legendY + 22);
   };

   App.prototype.componentDidMount = function componentDidMount() {
      this.fetchData();
   };

   App.prototype.render = function render() {
      return React.createElement(
         'div',
         { className: 'container' },
         React.createElement(
            'h1',
            null,
            'Doping in Professional Cycling'
         ),
         React.createElement(
            'h2',
            null,
            'Alpe d\'Huez Tour de France: Best 35'
         )
      );
   };

   return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById("app"));