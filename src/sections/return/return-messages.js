import { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { Scrollbar } from '../../components/scrollbar';
import { ChatMessage } from '../chat/chat-message';
import { ChatMessageAdd } from '../chat/chat-message-add';

const messageAuthors = {
  auto: 'Respuesta automática',
  manager: 'Administrador',
  customer: 'Cliente',
};

const useMessagesScroll = (orderReturn) => {
  const messagesRef = useRef(null);

  const handleUpdate = useCallback(() => {
    // Order return is not loaded
    if (!orderReturn) {
      return;
    }
    // Ref is not used
    if (!messagesRef.current) {
      return;
    }

    const container = messagesRef.current;
    const scrollElement = container.getScrollElement();

    if (scrollElement) {
      scrollElement.scrollTop = container.el.scrollHeight;
    }
  }, [orderReturn]);

  useEffect(
    () => {
      handleUpdate();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orderReturn],
  );

  return {
    messagesRef,
  };
};

export const ReturnMessages = ({ orderReturn, refetch }) => {
  const { messagesRef } = useMessagesScroll(orderReturn);

  return (
    <Card>
      <CardHeader
        title="Historial de mensajes"
        subheader="Mensajes enviados por el cliente y el administrador."
      />
      <Stack
        sx={{
          flexGrow: 1,
          overflow: 'hidden',
        }}
      >
        <Divider />
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'hidden',
          }}
        >
          <Scrollbar
            ref={messagesRef}
            sx={{ maxHeight: window.innerHeight - 450 }}
          >
            <Stack spacing={2} sx={{ p: 3 }}>
              {orderReturn.messages
                .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                .map((message) => (
                  <ChatMessage
                    key={message.id}
                    withImage={message.return_message_files.length > 0}
                    imageUrl={message?.return_message_files[0]?.url}
                    authorName={
                      message.from === 'customer' ? (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="caption">Cliente</Typography>
                          <Typography variant="caption" color="text.secondary">
                            ({orderReturn.customer.name}{' '}
                            {orderReturn.customer.last_name})
                          </Typography>
                        </Stack>
                      ) : (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="caption">
                            {message.author ?? messageAuthors[message.from]}
                          </Typography>
                          {message.visible_on_front === 0 && (
                            <Typography variant="caption" color="text.white">
                              (Invisible para el cliente)
                            </Typography>
                          )}
                        </Stack>
                      )
                    }
                    body={message.message}
                    createdAt={new Date(message.created_at)}
                    contentType="text"
                    position={message.from === 'customer' ? 'left' : 'right'}
                  />
                ))}
            </Stack>
          </Scrollbar>
        </Box>
        <Divider />
        <ChatMessageAdd
          placeholder="Responder a la solicitud con un mensaje"
          orderReturn={orderReturn}
          refetch={refetch}
        />
      </Stack>
    </Card>
  );
};

ReturnMessages.propTypes = {
  orderReturn: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
};
