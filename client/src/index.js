import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import App from './App';
import Register from './Screens/Register.jsx';
import { injectStyle } from "react-toastify/dist/inject-style";

if (typeof window !== "undefined") {
  injectStyle();
}

ReactDOM.render(
    <BrowserRouter>
    <Switch>
      <Route path='/' exact render={props => <App {...props}/>}/>
      <Route path='/register' exact render={props => <Register {...props}/>}/>
    </Switch>
    </BrowserRouter>,
  document.getElementById('root')
);

