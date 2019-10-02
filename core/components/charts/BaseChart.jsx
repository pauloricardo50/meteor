import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactHighcharts from 'react-highcharts';
import merge from 'lodash/merge';

const initialazeHighcharts = () => {
  ReactHighcharts.Highcharts.setOptions({
    lang: {
      months: 'Janvier_Février_Mars_Avril_Mai_Juin_Juillet_Août_Septembre_Octobre_Novembre_Décembre'.split('_'),
      shortMonths: 'Janv._Févr._Mars_Avr._Mai_Juin_Juil._Août_Sept._Oct._Nov._Déc.'.split('_'),
      weekdays: 'Dimanche_Lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi'.split('_'),
      shortWeekdays: 'Dim._Lun._Mar._Mer._Jeu._Ven._Sam.'.split('_'),
    },
  });

  ReactHighcharts.Highcharts.wrap(
    ReactHighcharts.Highcharts.Chart.prototype,
    'init',
    function (proceed, options, callback) {
      if (options.chart && options.chart.forExport && options.series) {
        options.series.forEach((serie) => {
          if (serie.visible === false) {
            serie.showInLegend = false;
          }
        });
      }

      return proceed.call(this, options, callback);
    },
  );
};

export default class BaseChart extends PureComponent {
  constructor(props) {
    super(props);
    this.chart = null;
    const {
      HighchartsExporting,
      HighchartsMore,
      HighchartsExportData,
    } = this.props;

    if (HighchartsExporting) {
      HighchartsExporting(ReactHighcharts.Highcharts);
    }
    if (HighchartsMore) {
      HighchartsMore(ReactHighcharts.Highcharts);
    }
    if (HighchartsExportData) {
      HighchartsExportData(ReactHighcharts.Highcharts);
    }

    initialazeHighcharts();
  }

  componentWillReceiveProps({ data: nextData }) {
    const { data: prevData } = this.props;
    // If previous data[i].value is different from next data, update chart

    if (
      prevData.length !== nextData.length
      || nextData.some((dataPoint, index) => dataPoint.value !== prevData[index].value)
    ) {
      this.update(nextData);
    }
  }

  update = (data) => {
    if (this.chart) {
      // FIXME: This should animate the chart somehow
      this.chart.getChart().series[0].setData(data);
      this.chart.getChart().update({});
    }
  };

  componentWillUnmount() {
    this.chart = null;
  }

  render() {
    const { config } = this.props;

    return (
      <ReactHighcharts
        config={merge({}, { credits: { enabled: false } }, config)}
        ref={(c) => {
          this.chart = c;
        }}
      />
    );
  }
}

BaseChart.propTypes = {
  config: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
};
