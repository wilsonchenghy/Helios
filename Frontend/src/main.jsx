import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux';
import store from './redux/store';
import { ThemeProvider } from './context/ThemeContext';
import MainPage from './components/MainPage.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <MainPage />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
) 