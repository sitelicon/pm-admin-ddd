import PropTypes from 'prop-types';
import {
  Modal,
  Box,
  Paper,
  Container,
  Checkbox,
  TextField,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  Select,
  Button,
  Stack,
  Typography,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { jobsFormsAPI } from '../../api/jobs-forms';

const questionsTypes = [
  {
    id: 1,
    name: 'Respuesta corta',
    value: 'text',
  },
  {
    id: 2,
    name: 'Respuesta larga',
    value: 'long_text',
  },
  {
    id: 3,
    name: 'Selección múltiple',
    value: 'select_multiple',
  },
  {
    id: 4,
    name: 'Selección única',
    value: 'select',
  },
];

const Response = ({ content, updateContent, index, isDiscartableResponse }) => {
  const [value, setValue] = useState(content?.value);
  const [isDiscartable, setIsDiscartable] = useState(
    content?.isDiscartable || false,
  );

  const handleChange = useCallback(
    (event) => {
      setValue(event.target.value);
      updateContent((prevState) => {
        if (prevState.length === 0) {
          return [{ id: index, value: event.target.value, isDiscartable }];
        } else {
          return prevState.map((item) => {
            if (item.id === index) {
              return { ...item, value: event.target.value };
            } else {
              return item;
            }
          });
        }
      });
    },
    [index, updateContent, isDiscartable],
  );

  const handleDiscartable = useCallback(
    (event) => {
      setIsDiscartable(event.target.checked);
      updateContent((prevState) => {
        if (prevState.length === 0) {
          return [{ id: index, isDiscartable: event.target.checked, value }];
        } else {
          return prevState.map((item) => {
            if (item.id === index) {
              return { ...item, isDiscartable: event.target.checked };
            } else {
              return item;
            }
          });
        }
      });
    },
    [index, updateContent, value],
  );
  return (
    <Stack direction={'row'} gap={1}>
      <TextField
        fullWidth
        label={`Introduce la respuesta ${index + 1}`}
        variant="filled"
        value={value}
        onChange={handleChange}
        required
      />
      {isDiscartableResponse && (
        <FormControlLabel
          control={
            <Checkbox
              checked={isDiscartable}
              onChange={handleDiscartable}
              name="checkedB"
              color="primary"
            />
          }
          label="Descartable"
        />
      )}
    </Stack>
  );
};

export const JobFormQuestionModal = ({
  open,
  onClose,
  edit = false,
  formId,
  oldQuestion,
  oldestQuestions,
  refetch,
}) => {
  const [error, setError] = useState(false);
  const [question_id, setQuestionId] = useState(edit ? oldQuestion?.id : 0);
  const [question_text, setQuestionText] = useState(
    edit ? oldQuestion?.question_text : '',
  );
  const [type, setType] = useState(edit ? oldQuestion?.type : '');
  const [is_discartable, setIsDiscartable] = useState(
    edit ? oldQuestion?.is_discartable : false,
  );
  const [content, setContent] = useState(edit ? oldQuestion?.content : []);
  const handleClose = () => {
    onClose();
    refetch();
  };

  const questionToSend = useMemo(() => {
    return {
      question_text,
      type,
      is_discartable,
      content,
    };
  }, [question_text, type, is_discartable, content]);

  const handleSendQuestion = async (event) => {
    event.preventDefault();
    const content_questions = oldestQuestions;
    if (edit) {
      const index = oldestQuestions.findIndex(
        (item) => item.question_text === questionToSend.question_text,
      );
      content_questions[index] = questionToSend;
    } else {
      content_questions.push(questionToSend);
    }
    await jobsFormsAPI
      .addOrUpdateContentQuestion(formId, {
        content_questions,
      })
      .then((res) => {
        res.error ? setError(true) : setError(false);
      })
      .finally(() => {
        handleClose();
      });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        overflowY: 'scroll',
        margin: 'auto',
        border: 'none',
        paddingY: 4,
      }}
    >
      <Box>
        <Container maxWidth="sm">
          <form onSubmit={handleSendQuestion}>
            <Paper elevation={12} sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}
              >
                <Typography variant="h5">
                  {edit ? 'Editar pregunta' : 'Crear pregunta'}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Las preguntas, dependiendo de su tipo, pueden tener opciones
                  de respuesta. Recuerda añadirlas en caso de que sea necesario.
                </Typography>

                <TextField
                  fullWidth
                  label="Introduce la pregunta que deseas realizar"
                  margin="normal"
                  variant="filled"
                  value={question_text}
                  onChange={(event) => setQuestionText(event.target.value)}
                  required
                />
                <FormControl fullWidth required>
                  <InputLabel>Tipo de respuestas</InputLabel>
                  <Select
                    value={type}
                    label="Tipo"
                    onChange={(event) => {
                      setType(event.target.value);
                      event.target.value === 'text' ||
                      event.target.value === 'long_text'
                        ? setContent([])
                        : setContent(edit ? oldQuestion?.content : []);
                    }}
                  >
                    {questionsTypes.map((types) => (
                      <MenuItem value={types.value} key={types.id}>
                        {types.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Es pregunta de descarte"
                    checked={is_discartable}
                    onChange={(event) => setIsDiscartable(event.target.checked)}
                  />
                  <FormHelperText>
                    Si la pregunta es de descarte, marca esta casilla. De todas
                    las respuestas, marca las que descarte al postulante de la
                    oferta.
                  </FormHelperText>
                </FormGroup>
                {edit & oldQuestion ? (
                  oldQuestion.content.map((item) => (
                    <Response
                      key={item.id}
                      content={item}
                      updateContent={setContent}
                    />
                  ))
                ) : (
                  <>
                    {type != 'text' && type != 'long_text' && (
                      <>
                        <FormControl fullWidth error={!!error}>
                          <InputLabel>Cantidad de respuestas</InputLabel>
                          <TextField
                            id="component-helper"
                            value={content?.length}
                            onChange={(event) =>
                              setContent(
                                Array.from({
                                  length: parseInt(event.target.value),
                                }).map((item, index) => ({
                                  id: index,
                                  value: '',
                                  isDiscartable: false,
                                })),
                              )
                            }
                            aria-describedby="component-helper-text"
                            type="number"
                            inputProps={{ min: 2, max: 20 }}
                            disabled={type === 'text' || type === 'long_text'}
                          />
                          <FormHelperText id="component-helper-text">
                            Debes introducir la cantidad de respuestas que
                            tendrá la pregunta.
                          </FormHelperText>
                        </FormControl>
                        {content?.length > 0 &&
                          Array.from({ length: content?.length }).map(
                            (item, index) => (
                              <Response
                                key={index}
                                index={index}
                                content={content[index]}
                                updateContent={setContent}
                                isDiscartableResponse={is_discartable}
                              />
                            ),
                          )}
                      </>
                    )}
                  </>
                )}
              </Box>

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
                >
                  {edit ? 'Actualizar' : 'Crear pregunta'}
                </Button>
              </Stack>
            </Paper>
          </form>
        </Container>
      </Box>
    </Modal>
  );
};

JobFormQuestionModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

const exampleResponses = [
  {
    id: 1,
    value: 'res1',
  },
  {
    id: 2,
    value: 'res2',
  },
];
const exampleQuestions = [
  {
    id: 1,
    question_text: '¿Cuál es tu nombre?',
    type: 'text',
  },
  {
    id: 2,
    question_text: '¿Cuál es tu sexo?',
    type: 'select',
    content: [
      {
        id: 1,
        value: 'res1',
      },
      {
        id: 2,
        value: 'res2',
      },
    ],
  },
];
const exampleQuestion = {
  id: 2,
  question_text: '¿Cuál es tu sexo?',
  type: 'select',
  content: [
    {
      id: 1,
      value: 'res1',
    },
    {
      id: 2,
      value: 'res2',
    },
  ],
};
