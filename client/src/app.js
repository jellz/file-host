import { h, Component } from 'preact';
import { Router } from 'preact-router';
import { route } from 'preact-router';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Code-splitting is automated for routes
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

export default class App extends Component {
  // Gets fired when the route changes
  // e.url is the new URL
  handleRoute = (e) => {
    this.currentUrl = e.url;
    switch (e.url) {
      case '/dashboard':
        const isAuthed = !!window.localStorage.getItem('token');
        if (!isAuthed) route('/', true);
        break;
    }
  };

  render() {
    return (
      <div class='app'>
        <div class='container'>
          <Navbar />
          <Router onChange={this.handleRoute}>
            <Home path='/' />
            <Dashboard path='/dashboard' />
          </Router>
        </div>
        <Footer />
      </div>
    );
  }
}
