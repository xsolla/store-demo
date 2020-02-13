import React from 'react';
import Slide from '@material-ui/core/Slide';
import Snackbar from '@material-ui/core/Snackbar';

const SlideTransition = props => <Slide {...props} direction="right" />;
const position = {
  vertical: 'top',
  horizontal: 'right',
}

const Alert = ({ content }) => {
  const [open, setOpen] = React.useState(false);
  const hideMessage = () => setOpen(false);
  const showMessage = () => setOpen(true);

  React.useEffect(() => {
    showMessage(true);
  }, [content]);

  return (
    <Snackbar
      open={open}
      anchorOrigin={position}
      autoHideDuration={6000}
      onClose={hideMessage}
      TransitionComponent={SlideTransition}
    >
      {content}
    </Snackbar>
  );
};

export { Alert };
