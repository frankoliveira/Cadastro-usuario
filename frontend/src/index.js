import React from 'react';
import './index.css';
import App from './main/App';

import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App tab="home" />);

/*import ReactDOM from 'react-dom';
ReactDOM.render(<App />, document.getElementById('root'));*/
