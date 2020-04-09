import { createMuiTheme } from '@material-ui/core';

const mainTheme = createMuiTheme({
  typography: {
    fontFamily:
      '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif',
  },
  palette: {
    primary: {
      main: '#FF005B',
      contrastText: '#F6FAFF',
    },
    secondary: {
      main: '#D6E0E7',
      contrastText: '#000',
    },
    text: {
      primary: '#D6E0E7',
      secondary: '#D6E0E7',
    },
    background: {
      default: '#011627',
      paper: '#011627',
      imageUrl:
        'https://res.cloudinary.com/maiik/image/upload/v1549624607/Xsolla/HomePage_Hero_Illustration_1440_oabqmk.jpg',
    },
    action: {
      selected: '#D6E0E712',
      hover: '#D6E0E708',
    },
  },
  shape: {
    borderRadius: 6,
    cardWidth: '300px',
  },
});

export { mainTheme };
