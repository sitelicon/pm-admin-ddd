import { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { customersApi } from '../../api/customers';
import { useMounted } from '../../hooks/use-mounted';
import { es } from 'date-fns/locale';

const emailOptions = [
  'Reenviar la última factura',
  'Enviar restablecimiento de contraseña',
  'Enviar verificación de correo electrónico',
];

const useEmails = () => {
  const isMounted = useMounted();
  const [emails, setEmails] = useState([]);

  const getEmails = useCallback(async () => {
    try {
      const response = await customersApi.getEmails();

      if (isMounted()) {
        setEmails(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(
    () => {
      getEmails();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return emails;
};

export const CustomerEmailsSummary = (props) => {
  const [emailOption, setEmailOption] = useState(emailOptions[0]);
  const emails = useEmails();

  return (
    <Card {...props}>
      <CardHeader title="Correos electrónicos" />
      <CardContent sx={{ pt: 0 }}>
        <TextField
          name="option"
          onChange={(event) => setEmailOption(event.target.value)}
          select
          SelectProps={{ native: true }}
          sx={{
            width: 320,
            maxWidth: '100%',
          }}
          variant="outlined"
          value={emailOption}
        >
          {emailOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </TextField>
        <Box sx={{ mt: 2 }}>
          <Button
            endIcon={
              <SvgIcon>
                <ArrowRightIcon />
              </SvgIcon>
            }
            variant="contained"
          >
            Enviar email
          </Button>
        </Box>
      </CardContent>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tipo de Email</TableCell>
            <TableCell>Fecha</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {emails.map((email) => {
            const createdAt = format(email.createdAt, 'dd/MM/yyyy HH:mm', {
              locale: es,
            });

            return (
              <TableRow
                key={email.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>
                  <Typography variant="subtitle2">
                    {email.description}
                  </Typography>
                </TableCell>
                <TableCell>{createdAt}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
};
