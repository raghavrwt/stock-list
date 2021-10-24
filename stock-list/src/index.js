import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import createStore from './store/store';

import ListingPage from './pages/ListingPage';
import DetailPage from './pages/DetailPage';

const store = createStore();

const routing = (
  <Provider store={store}>
    <Router>
      <Route exact path="/:id" component={DetailPage}></Route>
      <Route exact path="/" component={ListingPage}></Route>
    </Router>
  </Provider>
)

ReactDOM.render(routing, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
