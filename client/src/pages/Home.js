import { h, Component } from 'preact';
import { route, Link } from 'preact-router';
import { API_BASE } from '../config';

export default class Home extends Component {
	state = {
		loggedIn: window ? !!window.localStorage.getItem('token') : false
	};

	render() {
		return (
			<div>
				Welcome to this cool file host. Things may happen at this page later,
				but for now check out the <Link href='/dashboard'>dashboard</Link>.
			</div>
		);
	}
}
