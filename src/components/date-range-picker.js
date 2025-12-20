import { useRef, useState } from 'react';
import {
  Box,
  Button,
  Popover,
  Stack,
  Divider,
  Typography,
} from '@mui/material';
import {
  DateRangePicker as RangePicker,
  defaultInputRanges,
  defaultStaticRanges,
} from 'react-date-range';
import locale from 'date-fns/locale/es';
import {
  isSameDay,
  subDays,
  setHours,
  setMinutes,
  getHours,
  getMinutes,
} from 'date-fns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

const translateLabel = (label) => {
  switch (label) {
    case 'Today':
      return 'Hoy';
    case 'Yesterday':
      return 'Ayer';
    case 'This Week':
      return 'Esta semana';
    case 'Last Week':
      return 'La semana pasada';
    case 'This Month':
      return 'Este mes';
    case 'Last Month':
      return 'El mes pasado';
    case 'This Year':
      return 'Este año';
    case 'Last Year':
      return 'El año pasado';
    case 'days up to today':
      return 'días hasta hoy';
    case 'days starting today':
      return 'días a partir de hoy';
    default:
      return label;
  }
};

const updateTime = (originalDate, newTime) => {
  if (!newTime || !originalDate) return originalDate;

  let updatedDate = setHours(originalDate, getHours(newTime));
  updatedDate = setMinutes(updatedDate, getMinutes(newTime));
  return updatedDate;
};

export const DateRangePicker = ({
  onChange = () => {},
  startDate = subDays(new Date(), 7),
  endDate = new Date(),
  key = 'selection',
  months = 1,
  children,
  ...other
}) => {
  const anchorEl = useRef(null);
  const [open, setOpen] = useState(false);

  const handleDateChange = (newStartDate, newEndDate) => {
    const startWithCurrentTime = updateTime(newStartDate, startDate);
    const endWithCurrentTime = updateTime(newEndDate, endDate);
    onChange(startWithCurrentTime, endWithCurrentTime);
  };

  const handleStartTimeChange = (newTime) => {
    const updatedStartDate = updateTime(startDate, newTime);
    onChange(updatedStartDate, endDate);
  };

  const handleEndTimeChange = (newTime) => {
    const updatedEndDate = updateTime(endDate, newTime);
    onChange(startDate, updatedEndDate);
  };

  return (
    <>
      <Button
        ref={anchorEl}
        color="inherit"
        {...other}
        onClick={() => setOpen(true)}
      >
        {children}
      </Button>
      <Popover
        open={open}
        onClose={() => setOpen(false)}
        anchorEl={anchorEl.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={locale}
        >
          <Box sx={{ display: 'flex' }}>
            <RangePicker
              onChange={(item) =>
                handleDateChange(
                  item.selection.startDate,
                  item.selection.endDate,
                )
              }
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              months={months}
              direction="horizontal"
              dateDisplayFormat="d MMM, yyyy"
              dayDisplayFormat="d"
              ranges={[
                {
                  startDate,
                  endDate,
                  key,
                  color: '#7047eb',
                },
              ]}
              color="#000000"
              locale={locale}
              staticRanges={[
                ...defaultStaticRanges.map((range) => ({
                  ...range,
                  label: translateLabel(range.label),
                })),
                {
                  label: 'Este año',
                  range: () => ({
                    startDate: new Date(new Date().getFullYear(), 0, 1),
                    endDate: new Date(new Date().getFullYear(), 11, 31),
                  }),
                  isSelected: (range) =>
                    isSameDay(
                      range.startDate,
                      new Date(new Date().getFullYear(), 0, 1),
                    ) &&
                    isSameDay(
                      range.endDate,
                      new Date(new Date().getFullYear(), 11, 31),
                    ),
                },
                {
                  label: 'El año pasado',
                  range: () => ({
                    startDate: new Date(new Date().getFullYear() - 1, 0, 1),
                    endDate: new Date(new Date().getFullYear() - 1, 11, 31),
                  }),
                  isSelected: (range) =>
                    isSameDay(
                      range.startDate,
                      new Date(new Date().getFullYear() - 1, 0, 1),
                    ) &&
                    isSameDay(
                      range.endDate,
                      new Date(new Date().getFullYear() - 1, 11, 31),
                    ),
                },
              ]}
              inputRanges={defaultInputRanges.map((range) => ({
                ...range,
                label: translateLabel(range.label),
              }))}
            />
            <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
            <Box
              sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Selección de Hora
              </Typography>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Hora de Inicio
                </Typography>
                <TimePicker
                  label="Desde"
                  value={new Date(startDate)}
                  onChange={handleStartTimeChange}
                  slotProps={{ textField: { size: 'small' } }}
                />
              </Stack>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Hora de Fin
                </Typography>
                <TimePicker
                  label="Hasta"
                  value={new Date(endDate)}
                  onChange={handleEndTimeChange}
                  slotProps={{ textField: { size: 'small' } }}
                />
              </Stack>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpen(false)}
                sx={{ mt: 2 }}
              >
                Aplicar
              </Button>
            </Box>
          </Box>
        </LocalizationProvider>
      </Popover>
    </>
  );
};
