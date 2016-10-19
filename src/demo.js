import React from 'react';
import ReactDOM from 'react-dom';
import {TimeSeries, ChartLayout} from './model';
import {Chart} from './view';

;(() => {
  function generateTimeSeries({start, duration, step, min, max}) {
    let series = [], accumulator = start;
    while (accumulator < start + duration) {
      series.push([accumulator, min + (Math.random() * (max - min))]);
      accumulator += step;
    }
    return series;
  }

  const milliseconds = 1;
  const seconds = 1000 * milliseconds;
  const minutes = 60 * seconds;

  class Application {
    constructor(config) {
      this.start = config.start;
      this.series = generateTimeSeries(config);
      this.layout = new ChartLayout(() => this.redraw());
      window.addEventListener('resize', () => this.redraw());
    }

    redraw() {
      ReactDOM.render(
        <Chart layout={this.layout}
               series={this.series}
               start={this.start}
               duration={this.duration} />,
        document.querySelector('.application')
      );
    }
  }

  const duration = 5 * seconds;
  const application = new Application({
    start    : Date.now() - duration,
    duration : duration,
    step     : 5,
    min      : 0,
    max      : 100
  });

  document.addEventListener('DOMContentLoaded', () => application.redraw());
})();
