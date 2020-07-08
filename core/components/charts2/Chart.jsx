import React, { useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import merge from 'lodash/merge';

const defaultOptions = {
  chart: {
    style: {
      fontFamily: 'Manrope, Helvetica',
    },
    animation: { duration: 400 },
    spacing: [20, 20, 25, 20], // Avoid shadows from hitting the border of the chart
  },
  lang: { thousandsSep: ' ' },
  credits: { enabled: false },
  legend: {
    itemStyle: {
      fontSize: '14px',
    },
    floating: false,
    itemMarginBottom: 4,
    margin: 30,
  },
  defs: {
    glow: {
      tagName: 'filter',
      id: 'glow',
      opacity: 0.5,
      children: [
        {
          tagName: 'feOffset',
          result: 'copy',
          in: 'SourceGraphic',
          dx: '0',
          dy: '10',
          opacity: 0.3,
        },
        {
          tagName: 'feGaussianBlur',
          result: 'blur',
          stdDeviation: '10',
          in: 'copy',
        },
        {
          tagName: 'feColorMatrix',
          in: 'blur',
          result: 'opacity-blur',
          type: 'matrix',
          values: '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.5 0',
        },
        {
          tagName: 'feBlend',
          in: 'SourceGraphic',
          in2: 'opacity-blur',
          mode: 'normal',
        },
      ],
    },
  },
};

const Chart = ({ options, className }) => {
  const ref = useRef();

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={merge({}, defaultOptions, options)}
      containerProps={{ className }}
      ref={ref}
    />
  );
};

export default Chart;
