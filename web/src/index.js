import React from 'react';
import ReactDOM from 'react-dom';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';
import { createTheme, CssBaseline } from '@material-ui/core';
import * as serviceWorker from './serviceWorker';
import RedirectPage from './pages/Redirect';
import Listing from './pages/Listing';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileListing from './pages/_Listing';
import Admin from './pages/Admin';
import { BrowserRouter, Route } from 'react-router-dom';
import { BrowserView, MobileView } from 'react-device-detect';

/**
 * Mrdat redux ale je to tady az budu high na plynu
 * ze slehackovy plechovky
 */
const theme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#F0A500',
    },
    secondary: {
      main: '#CF7500',
    },
  }
})

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Route exact path="/">
            <BrowserView>
              <CssBaseline />
              <RedirectPage />
            </BrowserView>
            <MobileView>
              <CssBaseline />
              <MobileListing />
            </MobileView>
          </Route>
          <Route exact path="/admin">
            <CssBaseline />
            <Admin />
          </Route>
          <Route path="/vocab/:lang">
            <BrowserView>
              <CssBaseline />
              <Navbar />
              <Listing />
              <Footer />
            </BrowserView>
          </Route>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode >,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
