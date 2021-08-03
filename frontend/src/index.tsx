import React from 'react'
import ReactDOM from 'react-dom'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter, Route } from 'react-router-dom'

import './index.css'
//import DataTableSelection1 from './component/DataTableSelection1'
import PersonalGradeForm from './component/PersonalGradeForm'
import GeneralGradeForm from './component/GeneralGradeForm'
import Login from './component/Login'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Route exact path="/" component={Login} />      
      <Route exact path="/PersonalGradeForm/:username" component={PersonalGradeForm} />
      <Route exact path="/GeneralGradeForm/:username" component={GeneralGradeForm} />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
