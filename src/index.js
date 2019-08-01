/** React Library */
import React from 'react';
import ReactDOM from 'react-dom';

/** Redux related Library  */
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux';

/** Bootstrap Custom CSS */
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'react-notifications/lib/notifications.css';

/** Import Custom CSS */
import './js/customizedCSS';

/** Container Component */
import App from './App'
import objectListReducer from './js/reducer/ObjectListReducer';
import retrieveTrackingData from './js/reducer/RetrieveTrackingDataReducer';
import config from './js/config';



const reducers = combineReducers({
    objectListOption: objectListReducer,
    retrieveTrackingData: retrieveTrackingData,
})
const store = createStore(reducers)

config.systemAdmin.openGlobalStateMonitor ? store.subscribe(() => console.log(store.getState())) : null;


const rootElement = document.getElementById('root');
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, rootElement
);




