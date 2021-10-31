import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles({
  button: {
    background: '#47919B',
    borderRadius: 3,
    boxShadow: '0 3px 3px 2px #33666d',
    color: 'white',
    '&:hover': {
        background: "#33666d",
     },
  },
});