import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

import { InputText} from 'primereact/inputtext'
import { Button } from 'primereact/button'

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

function App() {
  const [text, setText] = useState('');

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <InputText value={text} onChange={e => setText(e.target.value)} />
        {text}
        <Button type="button" label="Sumit" icon="pi pi-check"></Button>
      </header>
    </div>
  );
}

export default App;
