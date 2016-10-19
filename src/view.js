import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {TimeSeries} from './model';

export function Chart(props) {
  const series = new TimeSeries(props.series);

  props = Object.assign({
    tickLength       : 5,
    axisLabelSpacing : 5,
    precision        : 3,
    xAxisTicks       : 5,
    yAxisTicks       : 5
  }, props, {
    series,
    scaled: series.scale(
      props.layout.boundary.width / difference(series.domain),
      props.layout.boundary.height / difference(series.range)
    )
  });

  const {
    layout: {
      yAxisLabel:{width: labelWidth},
      xAxisLabel:{height: labelHeight},
      boundary: {
        width: boundaryWidth,
        height: boundaryHeight
      }
    },
    tickLength,
    axisLabelSpacing,
  } = props;

  const xOffset = labelWidth + tickLength + axisLabelSpacing;
  const yOffset = boundaryHeight - labelHeight - tickLength - axisLabelSpacing;

  return <div className="chart" ref={el => props.layout.setElement(el)}>
    <svg width={boundaryWidth} height={boundaryHeight}>
      <g transform={`translate(${xOffset}, ${yOffset})`}>
        <AxisX {...props} />
        <AxisY {...props} />
        <LinePlot {...props} />
      </g>
    </svg>
  </div>;
}

function AxisX(props) {
  const ticks = [];
  for (let index = 0; index < props.xAxisTicks; index++) {
    ticks.push(
      <AxisXTick key={index} {...Object.assign({}, props, {index})} />
    );
  }

  return <g className="axis-x">
    <line className="axis-line" x2={difference(props.scaled.domain)} />
    {ticks}
  </g>;
}

function difference([a, b]) {
  return Math.abs(a - b);
}

function AxisXTick(props) {
  const position = (props.index
                   * (difference(props.scaled.domain)
                     / props.xAxisTicks));

  const label = props.start
              + (props.index
                * (difference(props.series.range)
                  / props.xAxisTicks));

  const labelPosition = props.layout.xAxisLabel.height
                      + props.tickLength
                      + props.axisLabelSpacing;

  return <g transform={`translate(${position}, 0)`}>
    <line className="axis-tick" y2={props.tickLength} />
    <text className="axis-tick-label" y={labelPosition}>{label}</text>
  </g>;
}

function AxisY(props) {
  const ticks = [];
  for (let i = 0; i < props.yAxisTicks; i++) {
    const tickProps = Object.assign({}, props, {index:i})
    ticks.push(<AxisYTick key={i} {...tickProps} />);
  }

  return <g className="axis-y">
    <line className="axis-line" y2={-difference(props.scaled.range)} />
    {ticks}
  </g>;
}

function AxisYTick(props) {
  const position = (props.index
                   * (difference(props.scaled.range)
                     / props.yAxisTicks));

  const label = (props.index
                 * (difference(props.series.range)
                   / props.yAxisTicks)).toFixed(props.precision);

  const labelX = -(props.tickLength + props.axisLabelSpacing);

  return <g transform={`translate(0, ${-position})`}>
    <line className="axis-tick" x2={-props.tickLength} />
    <text className="axis-tick-label" x={labelX} textAnchor="end">
      {label}
    </text>
  </g>;
}

function ScatterPlot(props) {
  return <g>{series.fit(xMax, yMax).series.map(Point)}</g>;
}

function Point([x, y, k]) {
  return <circle key={k} cx={x} cy={y} r={3} fill="black" />;
}

function plotPath(props) {
  let path = ['M'].concat(props.scaled.head);
  for (const point of props.scaled.tail) {
    path = path.concat(['L']).concat(point);
  }
  return path.join(' ');
}

function LinePlot(props) {
  const path = plotPath(props);
  return <path d={path} stroke="black" fill="transparent" />;
}
