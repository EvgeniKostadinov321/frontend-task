import React, { ReactNode, useState } from 'react';
import { Snackbar, SnackbarProps } from '@mui/joy';
import { NotificationContext, NotificationType } from './notification.context';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<NotificationType>('info');
  const [duration, setDuration] = useState(5000);

  const showNotification = (
    message: string,
    type: NotificationType = 'info',
    duration: number = 5000
  ) => {
    setMessage(message);
    setType(type);
    setDuration(duration);
    setOpen(true);
  };

  const getColor = (): SnackbarProps['color'] => {
    switch (type) {
      case 'success': return 'success';
      case 'error': return 'danger';
      case 'warning': return 'warning';
      default: return 'neutral';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircleIcon />;
      case 'error': return <ErrorIcon />;
      case 'warning': return <WarningIcon />;
      default: return <InfoIcon />;
    }
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Snackbar
        open={open}
        onClose={() => setOpen(false)}
        autoHideDuration={duration}
        color={getColor()}
        variant="soft"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        startDecorator={getIcon()}
        sx={{ 
          boxShadow: 'md', 
          borderRadius: 'md',
          minWidth: 300,
          maxWidth: 500
        }}
      >
        {message}
      </Snackbar>
    </NotificationContext.Provider>
  );
}
