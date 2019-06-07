import { h, Component } from 'preact';
import { route } from 'preact-router';
import { API_BASE } from '../config';
import DashboardProfileCard from '../components/dashboard/DashboardProfileCard';
import DashboardAccountSettings from '../components/dashboard/DashboardAccountSettings';

export default class Dashboard extends Component {
  constructor() {
    super();
    this.setCustomDomain = this.setCustomDomain.bind(this);
  }

  state = {
    user: null
  };

  async componentDidMount() {
    const res = await fetch(API_BASE + '/api/users/me', {
      headers: {
        'Authorization': `JWT ${window.localStorage.getItem('token').trim()}`
      }
    });
    const json = await res.json();
    this.setState({ user: json.user });
    console.log(this.state.user);
  }

  async setCustomDomain(customDomain) {
    if (!this.state.user) return false;
    customDomain = customDomain.trim();
    console.log(window.localStorage.getItem('token'));
    console.log(customDomain);
    const res = await fetch(API_BASE + '/api/users/me', {
      method: 'PATCH',
      mode: 'cors',
      body: JSON.stringify({ customDomain: customDomain }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${  window.localStorage.getItem('token')}`
      }
    });
    console.log(res);
  }

  render() {
    return (
      <div>
        {this.state.user && (
          <div>
            <p>
              You're logged in as <b>{this.state.user.username}</b>
              <br />
              <a class='dark bold'>Logout</a>
            </p>
            <div>
              <grid columns='2'>
                <c>
                  <DashboardProfileCard user={this.state.user} />
                </c>
                <c>
                  <DashboardAccountSettings
                    user={this.state.user}
                    setCustomDomain={this.setCustomDomain}
                  />
                </c>
              </grid>
            </div>
          </div>
        )}
      </div>
    );
  }
}
