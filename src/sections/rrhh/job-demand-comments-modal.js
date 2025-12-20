import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { useState } from 'react';
import { es } from 'date-fns/locale';
import {
  Modal,
  Box,
  Paper,
  Container,
  TextField,
  Button,
  Stack,
  Typography,
  Link,
} from '@mui/material';
import { useAuth } from '../../hooks/use-auth';
import { jobDemandsAPI } from '../../api/job-demands';

export const JobDemandCommentsModal = ({
  open,
  onClose,
  jobOfferId,
  jobCandidate,
  formatDistanceToNow,
  refetch,
}) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [author, setAuthor] = useState(
    user.name + ' (' + user.email + ')' || '',
  );
  const [updating, setUpdating] = useState(false);

  const sendComment = async () => {
    setUpdating(true);
    if (!message) return;
    await jobDemandsAPI
      .postDemand(jobCandidate.id, {
        message,
        author,
      })
      .then((response) => {
        if (response.status == 200) {
          setAuthor('');
          setMessage('');
        }
        refetch();
        handleClose();
        setUpdating(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const handleClose = () => {
    refetch();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="md">
        <Box>
          <Paper elevation={12} sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.8rem',
                  textAlign: 'right',
                  paddingBottom: 2,
                }}
              >
                Candidato:{' '}
                <Link
                  component={NextLink}
                  href={`/rrhh/${jobOfferId}/${jobCandidate.id}`}
                >
                  {`${jobCandidate.demand_name} ${jobCandidate.demand_surname}`}
                </Link>
              </Typography>
              {jobCandidate.comments.map((comment) => (
                <Paper
                  elevation={4}
                  key={comment.id}
                  square={false}
                  variant="outlined"
                  sx={{
                    padding: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                  }}
                >
                  <Typography sx={{ fontSize: '.9rem' }}>
                    {comment.message}
                  </Typography>
                  <Stack
                    direction="row"
                    width="full"
                    justifyContent="space-between"
                  >
                    <Typography sx={{ fontSize: '.9rem', fontStyle: 'italic' }}>
                      - {comment.author}
                    </Typography>
                    <Typography sx={{ fontSize: '.8rem' }}>
                      {formatDistanceToNow(new Date(comment.created_at), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </Typography>
                  </Stack>
                </Paper>
              ))}
            </Box>

            <TextField
              fullWidth
              label="Introduce el comentario que deseas realizar"
              margin="normal"
              variant="filled"
              multiline
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <Stack
              alignItems="center"
              direction="row"
              spacing={3}
              sx={{ mt: 4 }}
            >
              <Button
                color="inherit"
                fullWidth
                size="large"
                onClick={handleClose}
              >
                Cancelar
              </Button>
              <Button
                fullWidth
                size="large"
                variant="contained"
                type="submit"
                onClick={sendComment}
                disabled={(updating, !message)}
              >
                Aceptar
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Container>
    </Modal>
  );
};

JobDemandCommentsModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  jobCandidate: PropTypes.object,
  refetch: PropTypes.func,
};
