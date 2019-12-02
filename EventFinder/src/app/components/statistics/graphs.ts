import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';

export class PieChart {
  public labels;
  public data;
  public type: ChartType = 'pie';
  public legend = true;
  public colors;
  public options: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
      labels: { fontColor: 'rgba(255, 255, 255)' }
    },
    elements: {
      arc: {
        borderColor: 'rgba(50, 50, 89,1)',
        borderWidth: 7
      },
      line: {
        borderColor: 'rgba(50, 50, 89,1)',
        borderWidth: 7
      }
    },
    hover: { mode: null }
  };
}

export class RadarChart {
  public labels;
  public data;
  public type: ChartType = 'radar';
  public legend = false;
  public colors;
  public options: ChartOptions = {
    responsive: true,
    legend: {
      display: false,
    },
    scale: {
      pointLabels: { fontColor: 'rgba(255, 255, 255)' },
      gridLines: {
        color: 'rgba(160, 160, 160,1)',
        zeroLineColor: 'rgba(160, 160, 160)'
      },
      angleLines: {
        color: 'rgba(255, 255, 255,1)'
      }
    },
    elements: {
      arc: {
        borderColor: 'rgba(255, 255, 255,1)',
        backgroundColor: 'rgba(255, 255, 255,1)',
        borderWidth: 1
      },
      line: {
        borderColor: 'rgba(50, 50, 89,1)',
        backgroundColor: 'rgba(255, 255, 255,1)',
        borderWidth: 1
      },
      point: {
        borderColor: 'rgba(50, 50, 89,1)',
        backgroundColor: 'rgba(255, 255, 255,1)',
        borderWidth: 1,
        radius: 1
      }
    },
    hover: { mode: null }
  };
}

export class BarChart {
  public labels;
  public data: ChartDataSets[];
  public type: ChartType = 'bar';
  public legend = true;
  public colors;
  public options: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
      labels: { fontColor: 'rgba(255, 255, 255)' }
    },
    elements: {
      arc: {
        borderColor: 'rgba(50, 50, 89,1)',
        borderWidth: 7
      },
      line: {
        borderColor: 'rgba(50, 50, 89,1)',
        borderWidth: 7
      }
    },
    hover: { mode: null }
  };
}
