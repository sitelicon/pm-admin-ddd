import {
  Alert,
  Stack,
  Box,
  Card,
  CardHeader,
  Divider,
  IconButton,
  CardContent,
  Typography,
  Button,
  Paper,
  Menu,
  MenuItem,
  SvgIcon,
} from '@mui/material';
import DotsHorizontalIcon from '@untitled-ui/icons-react/build/esm/DotsHorizontal';
import { getLangFlag } from '../utils/get-lang-flag';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { JobFormQuestionModal } from '../sections/rrhh/job-form-question.modal';
import { jobsFormsAPI } from '../api/jobs-forms';

const OptionsFormJob = ({ options }) => {
  return (
    <Stack spacing={2} direction={'row'}>
      <Typography variant="body2" color="text.primary">
        {' '}
        Respuestas disponibles:
      </Typography>
      <Box justifyContent={'end'}>
        {options.map((item, index) => {
          return (
            <Stack direction={'row'} gap={1} key={index} alignItems={'center'}>
              <Typography variant="body2" key={index} color="text.secondary">
                {item.value}
              </Typography>
              {/* {item.isDiscartable && (
                <Alert severity="info" variant="outlined">
                  Respuesta que descarta
                </Alert>
              )} */}
            </Stack>
          );
        })}
      </Box>
    </Stack>
  );
};

const Question = ({ item, index, jobFormId, questions, refetch }) => {
  const menuRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [openEditQuestionModal, setOpenEditQuestionModal] = useState(false);

  const handleMenuOpen = useCallback(() => {
    setOpenMenu(true);
  }, []);
  const handleMenuClose = useCallback(() => {
    setOpenMenu(false);
  }, []);

  const handleDelete = () => {
    const newQuestions = questions.filter((question) => {
      return question !== item;
    });
    jobsFormsAPI
      .addOrUpdateContentQuestion(jobFormId, {
        content_questions: newQuestions,
      })
      .finally(() => {
        refetch();
      });
  };

  return (
    <>
      <Paper key={item.id} sx={{ p: 2 }}>
        <Stack direction={'column'} sx={{ display: 'flex' }}>
          <Box sx={{ mb: 2 }}>
            <Stack
              justifyContent="space-between"
              alignItems="center"
              direction="row"
              spacing={0}
            >
              <Typography variant="h6">Pregunta {index + 1}</Typography>
              {item.is_discartable && (
                <Alert severity="info">Esta pregunta es de descarte</Alert>
              )}
              <IconButton
                edge="end"
                size="small"
                onClick={handleMenuOpen}
                ref={menuRef}
              >
                <SvgIcon>
                  <DotsHorizontalIcon />
                </SvgIcon>
              </IconButton>
            </Stack>
            <Menu
              anchorEl={menuRef.current}
              // anchorOrigin={{
              //   horizontal: 'end',
              //   vertical: 'bottom',
              // }}
              keepMounted
              onClose={handleMenuClose}
              open={openMenu}
            >
              <MenuItem
                onClick={() => {
                  setOpenEditQuestionModal(true);
                }}
              >
                Editar
              </MenuItem>
              <MenuItem onClick={handleDelete}>Eliminar</MenuItem>
            </Menu>
          </Box>
          <Stack direction={'row'} gap={2} sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.primary">
              Pregunta:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.question_text}
            </Typography>
          </Stack>
          <Stack direction={'column'}>
            <Stack direction={'row'} gap={2} sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.primary">
                Tipo de pregunta:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.type === 'select' && 'Selección única'}
                {item.type === 'select_multiple' && 'Selección múltiple'}
                {item.type === 'text' && 'Texto corto'}
                {item.type === 'long_text' && 'Texto largo'}
              </Typography>
            </Stack>
            {item?.content && (
              <Box>
                {item.type === 'select' || item?.type === 'select_multiple' ? (
                  <Stack direction={'column'}>
                    <OptionsFormJob options={item?.content} />
                  </Stack>
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    Las preguntas de texto corto y texto largo no tienen
                    opciones de respuesta.
                  </Typography>
                )}
              </Box>
            )}
          </Stack>
        </Stack>
      </Paper>
      <JobFormQuestionModal
        open={openEditQuestionModal}
        onClose={() => setOpenEditQuestionModal(false)}
        formId={jobFormId}
        edit={true}
        oldQuestion={item}
        oldestQuestions={questions}
        refetch={refetch}
      />
    </>
  );
};

const CardFormJob = ({ isoCode, information, jobForm, jobFormId, refetch }) => {
  const flag = getLangFlag(isoCode);
  const [openAddQuestionModal, setOpenAddQuestionModal] = useState(false);
  const jobForms = useMemo(() => {
    return information ? JSON.parse(information) : [];
  }, [information]);

  const handleAddQuestionModalClose = () => {
    setOpenAddQuestionModal(false);
  };

  const handleRemoveQuestionary = async () => {
    await jobsFormsAPI.deleteJobForms(jobFormId).finally(() => {
      refetch();
    });
  };

  return (
    <Card>
      <CardHeader
        title={
          <Stack
            direction={'row'}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Typography variant="h6">#{jobForm.name}</Typography>
            <Box sx={{ ml: 1 }}>{flag}</Box>
          </Stack>
        }
        subheader={
          <Stack direction={'column'}>
            <Typography variant="body2" color="text.secondary">
              {' '}
              Agrega o edita las preguntas que se le realizarán al postulante al
              momento de presentar su candidatura. La bandera indica el idioma
              en el que se encuentra el formulario.
            </Typography>
            <Stack
              direction={'row'}
              justifyContent={'space-between'}
              padding={1}
            >
              <Button
                sx={{ alignSelf: 'end' }}
                variant="outlined"
                color="primary"
                onClick={() => setOpenAddQuestionModal(true)}
              >
                Agregar pregunta
              </Button>
              <Button
                sx={{ alignSelf: 'end' }}
                variant="contained"
                color="primary"
                onClick={handleRemoveQuestionary}
              >
                Eliminar cuestionario
              </Button>
            </Stack>
          </Stack>
        }
      />
      <Divider />
      <CardContent>
        <Stack spacing={5}>
          {jobForms.map((item, index) => {
            return (
              <Question
                item={item}
                index={index}
                key={index}
                jobFormId={jobFormId}
                questions={jobForms}
                refetch={refetch}
              />
            );
          })}
        </Stack>
        <Box sx={{ height: 20 }} />
        <JobFormQuestionModal
          open={openAddQuestionModal}
          onClose={handleAddQuestionModalClose}
          formId={jobFormId}
          oldestQuestions={jobForms}
          refetch={refetch}
        />
      </CardContent>
    </Card>
  );
};

export default CardFormJob;
