// material-ui
import { styled } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

// loader style
const LoaderWrapper = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 2001,
  width: '100%',
  '& > * + *': {
    marginTop: theme.spacing(2)
  }
}));

// ==============================|| Loader ||============================== //

const Loader = () => (
  <LoaderWrapper>
    <LinearProgress
      variant="indeterminate"
      sx={{
        height: 2, // thinner bar
        backgroundColor: 'rgba(200,200,200,0.6)', // track color
        '& .MuiLinearProgress-bar': {
          backgroundColor: 'rgba(120,120,120,0.9)' // bar color (gray)
        }
      }}
    />
  </LoaderWrapper>
);

export default Loader;
