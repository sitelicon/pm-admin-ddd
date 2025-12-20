import { format, subDays } from 'date-fns';
import { Card, CardContent, CardHeader } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Chart } from '../../components/chart';
import { es } from 'date-fns/locale';

const now = new Date();

const createCategories = () => {
  const categories = [];

  for (let i = 12; i >= 0; i--) {
    categories.push(format(subDays(now, i), 'dd MMM', { locale: es }));
  }

  return categories;
};

const useChartOptions = () => {
  const theme = useTheme();
  const categories = createCategories();

  return {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: [theme.palette.success.light, theme.palette.action.focus],
    dataLabels: {
      enabled: false,
    },
    fill: {
      gradient: {
        opacityFrom: 0.6,
        opacityTo: 0.1,
        stops: [0, 90],
      },
      type: 'gradient',
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    legend: {
      horizontalAlign: 'right',
      labels: {
        colors: theme.palette.text.secondary,
      },
      position: 'top',
      show: true,
    },
    markers: {
      hover: {
        size: undefined,
        sizeOffset: 6,
      },
      radius: 2,
      shape: 'circle',
      size: 0,
      strokeWidth: 2,
    },
    stroke: {
      curve: 'smooth',
      dashArray: [0, 4],
      lineCap: 'butt',
      width: 2,
    },
    theme: {
      mode: theme.palette.mode,
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      categories,
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    yaxis: [
      {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
        },
      },
      {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
        },
      },
    ],
  };
};

export const OrderChart = (props) => {
  const { chartSeries } = props;
  const chartOptions = useChartOptions();

  return (
    <Chart
      height={280}
      options={chartOptions}
      series={chartSeries}
      type="area"
    />
  );
};
