import { useEffect } from 'react';
import { useRouter } from 'next/router';

const defaultConfirmationDialog = async (msg) => window.confirm(msg);

export const useLeavePageConfirmation = (
  shouldPreventLeaving = true,
  message = 'Are you sure you want to leave this page? The changes you made may not be saved.',
  confirmationDialog = defaultConfirmationDialog,
) => {
  const router = useRouter();

  useEffect(() => {
    const handleWindowClose = async (event) => {
      if (!shouldPreventLeaving) return;
      event.preventDefault();
      return (event.returnValue = message);
    };

    const handleRouteChange = async (url) => {
      if (!shouldPreventLeaving) return;
      if (await confirmationDialog(message)) {
        router.push(url);
      }
    };

    window.addEventListener('beforeunload', handleWindowClose);
    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [shouldPreventLeaving, message, confirmationDialog, router]);
};
