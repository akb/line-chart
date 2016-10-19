export class TimeSeries {
  constructor(series) {
    this.series = series;
  }

  get head() { return this.series[0] }
  get tail() { return this.series.slice(1) }

  static getRange(series) { // TODO: returns Math.abs before
    let min, max;
    for (let i in series) {
      min = Math.min(min || Infinity, series[i]);
      max = Math.max(max || -Infinity, series[i]);
    }
    return [min, max];
  }

  get times() { return this.series.map(i => i[0]) }
  get values() { return this.series.map(i => i[1]) }

  get startTime() { return Math.min(...this.times) }
  get endTime() { return Math.max(...this.times) }

  get domain() { return TimeSeries.getRange(this.times) }
  get range() { return TimeSeries.getRange(this.values) }

  scale(xFactor, yFactor) {
    return new TimeSeries(
      this.series.map(([x, y]) => [x * xFactor, y * yFactor])
    );
  }

  truncate(duration) {
    const max = this.xMax;
    return new TimeSeries(
      this.series.filter(([x, y]) => max - x < duration)
    );
  }
}

export class ChartLayout {
  constructor(redraw) {
    this.redraw = redraw;
    this.el = null;
  }

  setElement(el) {
    if (this.el) return;
    this.el = el;
    this.redraw();
  }

  get boundary() {
    if (this.el) {
      return this.el.getBoundingClientRect();
    } else {
      return {top:0, right:0, bottom:0, left:0, width:0, height:0};
    }
  }

  get xAxisLabel() {
    return getMaxBoundingBox(this.el, '.axis-x text');
  }

  get yAxisLabel() {
    return getMaxBoundingBox(this.el, '.axis-y text');
  }
}

function getMaxBoundingBox(el, selector) {
  let width = 0, height = 0;
  if (!el) return {width, height};
  for (const node of el.querySelectorAll(selector)) {
    const boundary = node.getBoundingClientRect();
    width = Math.max(width, boundary.width);
    height = Math.max(height, boundary.height);
  }
  return {width, height};
}
