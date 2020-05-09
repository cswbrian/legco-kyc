import { createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';

const theme = createMuiTheme({
    typography: {
        fontFamily: [
            'Helvetica',
            '-apple-system',
            'Noto Sans TC',
        ].join(','),
        h4: {
            fontSize: '1.5rem',
            fontWeight: 500
        }
    },
    palette: {
        primary: purple,
        secondary: green,
    },
    status: {
        danger: 'orange',
    },
});

export default theme