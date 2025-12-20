import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import moment from 'moment';
import { Box, Card, CardContent, CardHeader, Skeleton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Chart } from '../../components/chart';
import { reportsApi } from '../../api/reports';
import numeral from 'numeral';

const MAX_REPORT_DAYS = 7;
const now = new Date();

const createCategories = () => {
  const categories = [];

  for (let i = 6; i >= 0; i--) {
    categories.push(format(subDays(now, i), 'dd MMM', { locale: es }));
  }

  return categories;
};

const useChartOptions = (sales) => {
  const theme = useTheme();

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
    colors: [theme.palette.primary.main, theme.palette.success.light],
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
      strokeDashArray: 2,
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
        sizeOffset: 2,
      },
      radius: 2,
      shape: 'circle',
      size: 4,
      strokeWidth: 2,
    },
    stroke: {
      curve: 'smooth',
      dashArray: [0, 4],
      lineCap: 'butt',
      width: 3,
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
      categories: sales.map((sale) =>
        format(new Date(sale.interval), 'dd MMM HH:mm'),
      ),
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
          formatter: (value) => value,
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
          formatter: (value) => numeral(value).format('$0,0.00'),
        },
      },
    ],
  };
};

const useReport = (storeId, from, to) => {
  const [state, setState] = useState({
    loading: true,
    sales: [],
    intervalType: 'daily',
  });

  const getReport = useCallback(async () => {
    const toMoment = to && moment(to).isValid() ? moment(to) : moment();
    const fromMoment = from && moment(from).isValid() ? moment(from) : null;

    let finalFrom;
    const finalTo = toMoment.format('YYYY-MM-DD HH:mm:ss');

    let diffDays = 0;

    if (fromMoment) {
      diffDays = toMoment.diff(fromMoment, 'days', true);
    }

    if (!fromMoment || diffDays > MAX_REPORT_DAYS) {
      finalFrom = toMoment
        .clone()
        .subtract(MAX_REPORT_DAYS, 'days')
        .startOf('day')
        .format('YYYY-MM-DD HH:mm:ss');
      diffDays = MAX_REPORT_DAYS;
    } else {
      finalFrom = fromMoment.format('YYYY-MM-DD HH:mm:ss');
    }

    const intervalType = diffDays <= 1 ? 'hourly' : 'daily';

    setState((prevState) => ({ ...prevState, loading: true }));

    try {
      const response = await reportsApi.getSalesReport({
        dateField: 'created_at',
        from: finalFrom,
        to: finalTo,
        interval: intervalType,
        storeId,
      });

      setState((prevState) => ({
        ...prevState,
        sales: response.data,
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  }, [storeId, from, to]);

  useEffect(() => {
    getReport();
  }, [getReport]);

  return { ...state, refetch: () => getReport() };
};

export const EcommerceSalesRevenue = forwardRef((props, ref) => {
  const { storeId, from, to } = props;
  const { loading, sales, refetch } = useReport(storeId, from, to);
  const chartOptions = useChartOptions(sales);

  useImperativeHandle(ref, () => ({
    refetch,
  }));

  return (
    <Card>
      <CardHeader
        title="Reporte de ventas diario"
        subheader={`Ventas de los últimos ${MAX_REPORT_DAYS} días para la tienda seleccionada o de las horas marcadas.`}
      />
      {loading ? (
        <CardContent sx={{ pt: 0, pb: 2 }}>
          <Skeleton height={320} sx={{ transform: 'scale(1, 1)' }} />
        </CardContent>
      ) : (
        <CardContent sx={{ pt: 0 }}>
          <Chart
            height={320}
            options={chartOptions}
            series={[
              {
                name: 'Número de pedidos',
                data: sales.map((sale) => sale.orders),
              },
              {
                name: 'Ventas alcanzadas',
                data: sales.map((sale) => sale.sales_total.toFixed(2)),
              },
            ]}
            type="area"
          />
        </CardContent>
      )}
    </Card>
  );
});
