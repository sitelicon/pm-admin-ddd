import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import XIcon from '@untitled-ui/icons-react/build/esm/X';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  InputAdornment,
  Stack,
  SvgIcon,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import { wait } from '../../../utils/wait';
import { Tip } from '../../../components/tip';

// --- ESTILOS AJUSTADOS (MENOS RADIO) ---

const TechTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#fff',
    borderRadius: 4, // AJUSTE: Más cuadrado (antes 8px)
    '& fieldset': {
      borderColor: '#e5e7eb',
    },
    '&:hover fieldset': {
      borderColor: '#9ca3af',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#000000',
      borderWidth: 2,
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#000000',
  },
});

const ResultItem = styled(Box)(({ theme }) => ({
  border: '1px solid #e5e7eb',
  borderRadius: 4, // AJUSTE: Más cuadrado (antes 8px)
  padding: theme.spacing(2),
  cursor: 'pointer',
  transition: 'all 0.2s',
  backgroundColor: '#fff',
  '&:hover': {
    borderColor: '#000',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
  },
}));

const PathText = styled(Typography)({
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '0.70rem',
  color: '#6b7280',
  backgroundColor: '#f3f4f6',
  padding: '2px 6px',
  borderRadius: 2, // AJUSTE: Casi cuadrado (antes 4px)
  display: 'inline-block',
  marginBottom: 8,
});

// --- DATA ---
const articles = {
  Platform: [
    {
      description:
        'Provide your users with the content they need, exactly when they need it.',
      title: 'Level up your site search experience',
      path: 'USERS / API-USAGE',
    },
    {
      description:
        'Algolia is a search-as-a-service API that helps marketplaces build performant search.',
      title: 'Build performant marketplace search',
      path: 'USERS / API-USAGE',
    },
  ],
  Resources: [
    {
      description:
        'Algolia’s architecture is heavily redundant, hosting every application on …',
      title: 'Using NetInfo API to Improve Client',
      path: 'RESOURCES / BLOG POSTS',
    },
  ],
};

export const SearchDialog = (props) => {
  const { onClose, open = false, ...other } = props;
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [displayArticles, setDisplayArticles] = useState(false);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    setDisplayArticles(false);
    setIsLoading(true);
    await wait(1500);
    setIsLoading(false);
    setDisplayArticles(true);
  }, []);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          borderRadius: 1, // AJUSTE: ~4px (Mucho menos redondeado que el 3 anterior)
          border: '2px solid #e5e7eb',
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)',
          backgroundColor: '#fff',
        },
      }}
      {...other}
    >
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={3}
        sx={{ px: 3, py: 2, borderBottom: '1px solid #f3f4f6' }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 'bold',
            letterSpacing: '-0.02em',
          }}
        >
          BUSCAR
        </Typography>
        <IconButton color="inherit" onClick={onClose}>
          <SvgIcon fontSize="small">
            <XIcon />
          </SvgIcon>
        </IconButton>
      </Stack>

      <Stack spacing={2} sx={{ px: 3, py: 3 }}>
        <Tip message="Busca introduciendo una palabra clave y pulsando Intro" />

        <Box component="form" onSubmit={handleSubmit}>
          <TechTextField
            fullWidth
            placeholder="Buscar por palabra clave..."
            value={value}
            onChange={(event) => setValue(event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SvgIcon fontSize="small" sx={{ color: '#9ca3af' }}>
                    <SearchMdIcon />
                  </SvgIcon>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Stack>

      {(isLoading || displayArticles) && (
        <DialogContent sx={{ px: 3, pb: 4, pt: 0 }}>
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={30} sx={{ color: '#000' }} />
            </Box>
          )}
          {displayArticles && (
            <Stack spacing={3}>
              {Object.keys(articles).map((type, index) => (
                <Stack key={index} spacing={2}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 'bold',
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                    }}
                  >
                    {type}
                  </Typography>

                  <Stack spacing={1}>
                    {articles[type].map((article, i) => (
                      <ResultItem key={i}>
                        <Stack
                          direction="row"
                          alignItems="flex-start"
                          justifyContent="space-between"
                        >
                          <Box>
                            <PathText>{article.path}</PathText>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 700,
                                mb: 0.5,
                                fontFamily: "'Inter', sans-serif",
                              }}
                            >
                              {article.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: '0.875rem' }}
                            >
                              {article.description}
                            </Typography>
                          </Box>
                          <SvgIcon
                            fontSize="small"
                            sx={{ color: '#d1d5db', mt: 1 }}
                          >
                            <ArrowRightIcon />
                          </SvgIcon>
                        </Stack>
                      </ResultItem>
                    ))}
                  </Stack>
                </Stack>
              ))}
            </Stack>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
};

SearchDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
