import React from 'react';
import Routes from './Routes';
import { Router } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import { createBrowserHistory } from 'history';
import { createMuiTheme } from '@material-ui/core/styles';

const browserHistory = createBrowserHistory();
const theme = createMuiTheme()
function App() {
  return (
    <ThemeProvider theme={theme}>
        <Router history={browserHistory}>
            <Routes />
        </Router>
    </ThemeProvider>

  );
}

export default App;