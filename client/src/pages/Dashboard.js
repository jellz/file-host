import { h, Component } from 'preact';
// import '../styles/pages/dashboard';
import { route } from 'preact-router';
import { API_BASE } from '../config';

export default class Dashboard extends Component {
  state = {
    loggedIn: !!window.localStorage.getItem('token')
  };

  componentDidMount() {}
  render() {
    return <div>hi dashboard</div>;
  }
}
