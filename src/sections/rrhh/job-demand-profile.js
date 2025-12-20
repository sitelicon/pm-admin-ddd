import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import {
  Stack,
  Box,
  Button,
  Grid,
  Card,
  CardHeader,
  Divider,
  CardContent,
  TextField,
  CardActionArea,
  CardMedia,
  Typography,
  FormControl,
  FormLabel,
  Paper,
} from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';
import { JobDemandModal } from './job-demand-modal';
import { format, parseISO } from 'date-fns';

export const JobDemandProfile = ({ candidate }) => {
  const [openCVModal, setOpenCVModal] = useState(false);
  const [openOtherFilesModal, setOpenOtherFilesModal] = useState(false);

  const parseAnswers = useMemo(() => {
    const parsed = JSON.parse(candidate?.answers_form);
    const filtered = parsed.filter(
      (object) =>
        object.answer !== '' &&
        object.answer !== null &&
        object.answer !== undefined &&
        object.answer.length !== 0,
    );
    return filtered;
  }, [candidate]);

  const timelineEvents = useMemo(() => {
    const events = [];

    if (candidate?.is_excluded) {
      events.push({
        date: candidate.excluded_at,
        content: 'El candidato ha sido descartado.',
      });
    }

    if (candidate?.comments) {
      candidate.comments.forEach((comment) => {
        events.push({
          date: comment.created_at,
          content: (
            <>
              Se ha agregado este comentario.
              <Paper
                elevation={4}
                square={false}
                variant="outlined"
                sx={{
                  marginY: 1,
                  padding: 2,
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
                    {format(parseISO(comment.created_at), 'dd/MM/yyyy HH:mm')}
                  </Typography>
                </Stack>
              </Paper>
            </>
          ),
        });
      });
    }

    if (candidate?.created_at) {
      events.push({
        date: candidate.created_at,
        content: 'El candidato ha aplicado a la oferta de trabajo.',
      });
    }

    return events.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [candidate]);

  return (
    <>
      <Stack spacing={2}>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <Card>
                <CardHeader
                  title="Detalles del solicitante"
                  subheader="Principal información del candidato a la oferta."
                />
                <Divider />
                <CardContent>
                  <Stack spacing={2}>
                    <TextField
                      label="Nombre completo"
                      name="demand_name"
                      value={`${candidate?.demand_name || ''} ${
                        candidate?.demand_surname || ''
                      }`}
                      variant="outlined"
                    />
                    <TextField
                      label="Email"
                      name="demand_email"
                      value={candidate?.demand_email || ''}
                      variant="outlined"
                    />
                    <TextField
                      label="Localidad"
                      name="locality"
                      value={`${candidate?.demand_locality || ''}`}
                      variant="outlined"
                    />
                    <TextField
                      label="Teléfono"
                      name="demand_phone"
                      value={candidate?.demand_phone || ''}
                      variant="outlined"
                    />
                  </Stack>
                </CardContent>
              </Card>
              <Card sx={{ mt: 2 }}>
                <CardHeader title="Respuestas del Formulario" />
                <Divider />
                <CardContent>
                  <Stack spacing={2}>
                    {parseAnswers.map((answer, index) => {
                      switch (answer.question.type) {
                        case 'text':
                          return (
                            <FormControl key={index}>
                              <FormLabel id="demo-radio-buttons-group-label">
                                {answer.question.question_text}
                              </FormLabel>
                              <Typography
                                key={answer.answer}
                                variant="body2"
                                sx={{ ml: 2 }}
                              >
                                {answer.answer}
                              </Typography>
                            </FormControl>
                          );
                        case 'long_text':
                          return (
                            <FormControl key={index}>
                              <FormLabel id="demo-radio-buttons-group-label">
                                {answer.question.question_text}
                              </FormLabel>
                              <Typography
                                key={answer.answer}
                                variant="body2"
                                sx={{ ml: 2 }}
                              >
                                {answer.answer}
                              </Typography>
                            </FormControl>
                          );
                        case 'select':
                          return (
                            <FormControl key={index}>
                              <FormLabel id="demo-radio-buttons-group-label">
                                {answer.question.question_text}
                              </FormLabel>
                              <Typography
                                key={answer.answer}
                                variant="body2"
                                sx={{ ml: 2 }}
                              >
                                {answer.answer}
                              </Typography>
                            </FormControl>
                          );
                        case 'select_multiple':
                          return (
                            <FormControl key={index}>
                              <FormLabel id="demo-radio-buttons-group-label">
                                {answer.question.question_text}
                              </FormLabel>
                              <Stack direction={'column'} sx={{ my: 1 }}>
                                {answer.answer.map((option) => {
                                  return (
                                    <Typography
                                      key={option}
                                      variant="body2"
                                      sx={{ ml: 2 }}
                                    >
                                      {option}
                                    </Typography>
                                  );
                                })}
                              </Stack>
                            </FormControl>
                          );
                      }
                    })}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={7}>
              <Card>
                <CardHeader
                  title="Currículum Vitae"
                  action={
                    candidate?.demand_cv_source && (
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        target="_blank"
                        href={candidate.demand_cv_source}
                        download
                      >
                        Descargar
                      </Button>
                    )
                  }
                />
                <Divider />
                <CardContent>
                  {candidate?.demand_cv_source ? (
                    <CardActionArea>
                      {candidate?.demand_cv_source.includes('.pdf') ? (
                        <Stack direction={'column'} gap={2}>
                          <div style={{ height: '750px' }}>
                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                              <Viewer
                                fileUrl={candidate?.demand_cv_source}
                                // plugins={[defaultLayoutPluginInstance]}
                              />
                            </Worker>
                          </div>
                        </Stack>
                      ) : (
                        <Typography>
                          El candidato ha subido un archivo que no es un PDF.
                        </Typography>
                      )}
                    </CardActionArea>
                  ) : (
                    <Typography>El candidato no ha subido su CV</Typography>
                  )}
                </CardContent>
              </Card>
              <Card sx={{ mt: 2 }}>
                <CardHeader
                  title="Archivo Adicional"
                  action={
                    candidate?.demand_additional_archive && (
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        target="_blank"
                        href={candidate.demand_additional_archive}
                        download
                      >
                        Descargar
                      </Button>
                    )
                  }
                />
                <Divider />
                <CardContent>
                  {candidate?.demand_additional_archive ? (
                    <CardActionArea>
                      {candidate?.demand_additional_archive
                        .substring()
                        .includes('.pdf') ? (
                        <Stack direction={'column'} gap={2}>
                          <Typography>
                            El candidato ha subido un archivo PDF como archivo
                            adicional, y no se puede previsualizar.
                          </Typography>
                          <Link
                            href={candidate?.demand_additional_archive}
                            target="_blank"
                            rel="noopener"
                          >
                            <Button variant="contained" color="primary">
                              Ver archivo
                            </Button>
                          </Link>
                        </Stack>
                      ) : (
                        <Stack direction={'column'} gap={2}>
                          <Typography>
                            El candidato ha subido un archivo que no es un PDF.
                          </Typography>
                        </Stack>
                      )}
                    </CardActionArea>
                  ) : (
                    <Typography>
                      El candidato no ha subido ningún archivo adicional.
                    </Typography>
                  )}
                </CardContent>
              </Card>

              <Card sx={{ mt: 2 }}>
                <CardHeader title="Historial" />
                <Divider />
                <CardContent>
                  <Timeline
                    sx={{
                      [`& .${timelineOppositeContentClasses.root}`]: {
                        flex: 0.2,
                      },
                    }}
                  >
                    {timelineEvents.map((event, index) => (
                      <TimelineItem key={index}>
                        <TimelineOppositeContent color="textSecondary">
                          {format(parseISO(event.date), 'dd/MM/yyyy HH:mm')}
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot />
                          {index < timelineEvents.length - 1 && (
                            <TimelineConnector />
                          )}
                        </TimelineSeparator>
                        <TimelineContent>{event.content}</TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </>
  );
};
