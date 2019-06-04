import { h, Component } from 'preact';
import { route } from 'preact-router';
import { API_BASE } from '../config';

export default class Home extends Component {
  state = {
    loggedIn: !!window.localStorage.getItem('token')
  };

  componentDidMount() {
    if (!window.localStorage.getItem('token')) {
      let once;
      window.open(
        API_BASE + '/api/auth/login',
        '_blank',
        'width=500,height=1000'
      );
      window.addEventListener('message', (event) => {
        if (once || event.origin !== API_BASE) return;
        once = true;
        const token = event.data;
        window.localStorage.setItem('token', token);
        route('/dashboard');
      });
      this.setState({ loggedIn: true });
    } else route('/dashboard');
  }
  render() {
    return <div>Please wait...</div>;
  }
}
