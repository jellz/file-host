import { h, Component } from 'preact';
import { Router } from 'preact-router';
import { route } from 'preact-router';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Code-splitting is automated for routes
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

export default class App extends Component {
	// Gets fired when the route changes
	// e.url is the new URL
	handleRoute = e => {
		this.currentUrl = e.url;
		switch (e.url) {
			case '/dashboard':
				const isAuthed = !!window.localStorage.getItem('token');
				if (!isAuthed) route('/login', true);
				break;
			case '/logout':
				window.localStorage.removeItem('token');
				route('/');
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
						<Login path='/login' />
					</Router>
				</div>
				<Footer />
			</div>
		);
	}
}
