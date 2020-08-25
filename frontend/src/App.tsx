import React from 'react';
import Routes from './Routes';
import { Router } from 'react-router-dom';
import { createStore, compose, applyMiddleware} from 'redux';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import { createBrowserHistory } from 'history';
import { rootReducer } from "./redux/rootReducer";
import { ConfirmProvider } from "material-ui-confirm";
import {SelectDialogProvider} from './components/SelectDialog'
import thunk from "redux-thunk";
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import ruLocale from "date-fns/locale/ru";
import theme from "./theme";

const browserHistory = createBrowserHistory();
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
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
                            <Routes />
                        </MuiPickersUtilsProvider>
                    </SelectDialogProvider>
                </ConfirmProvider>
            </Router>
        </Provider>
    </ThemeProvider>
  );
}

export default App;