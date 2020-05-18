import React from 'react';
import Routes from './Routes';
import { Router } from 'react-router-dom';
import { createStore, compose, applyMiddleware} from 'redux';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import { createBrowserHistory } from 'history';
import { createMuiTheme } from '@material-ui/core/styles';
import { rootReducer } from "./redux/rootReducer";
import { ConfirmProvider } from "material-ui-confirm";
import {SelectDialogProvider} from './components/SelectDialog'
import thunk from "redux-thunk";

const browserHistory = createBrowserHistory();
const theme = createMuiTheme();
const store = createStore(rootReducer, compose(
    applyMiddleware(thunk)
));


function App() {
  return (
    <ThemeProvider theme={theme}>
        <Provider store={store}>
            <Router history={browserHistory}>
                <ConfirmProvider>
                    <SelectDialogProvider>
                        <Routes />
                    </SelectDialogProvider>
                </ConfirmProvider>
            </Router>
        </Provider>
    </ThemeProvider>
  );
}

export default App;