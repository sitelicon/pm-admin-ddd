import PropTypes from 'prop-types';
import Lightbulb04Icon from '@untitled-ui/icons-react/build/esm/Lightbulb04';
import { SvgIcon, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const TipRoot = styled('div')(({ theme }) => ({
  backgroundColor: '#f9fafb', // Gray 50
  border: '1px dashed #e5e7eb', // Borde técnico discontinuo
  borderRadius: 4, // Bordes ligeramente redondeados pero definidos
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5),
}));

export const Tip = (props) => {
  const { message } = props;

  return (
    <TipRoot>
      <SvgIcon
        sx={{
          mr: 1.5,
          fontSize: 20,
          color: '#000', // Icono negro sólido
        }}
      >
        <Lightbulb04Icon />
      </SvgIcon>
      <Typography
        color="text.secondary"
        sx={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.875rem',
          '& span': {
            fontFamily: "'JetBrains Mono', monospace", // "Consejo" en mono
            fontWeight: 700,
            color: '#000',
            mr: 1,
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            letterSpacing: '0.05em',
          },
        }}
      >
        <span>Consejo //</span> {message}
      </Typography>
    </TipRoot>
  );
};

Tip.propTypes = {
  message: PropTypes.string.isRequired,
};
