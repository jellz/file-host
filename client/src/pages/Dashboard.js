import { h, Component } from 'preact';
import { route, Link } from 'preact-router';
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
        Authorization: `JWT ${window.localStorage.getItem('token').trim()}`
      }
    });
    const json = await res.json();
    this.setState({ user: json.user });
    console.log(this.state.user);
  }

  async setCustomDomain(customDomain) {
    if (!this.state.user) return false;
    customDomain = customDomain.trim();
    console.log(customDomain);
    const res = await fetch(API_BASE + '/api/users/me', {
      method: 'PATCH',
      mode: 'cors',
      body: JSON.stringify({ customDomain: customDomain }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${window.localStorage.getItem('token')}`
      }
    });
    if (!res.ok) return alert(`Error: ${(await res.json()).error}`);
    else return alert('Updated custom domain');
  }

  render() {
    return (
      <div>
        {this.state.user && (
          <div>
            <p>
              You're logged in as <b>{this.state.user.username}</b>
              <br />
              <Link href='/logout' class='dark bold'>Logout</Link>
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
            <br />
            <h6>If you have any questions or problems please contact me by email <b>danielgulic@gmail.com</b> OR Discord <b>daniel#0004</b></h6>
            <h6>To request an archive of your files email me at <b>danielgulic@gmail.com</b></h6>
            <h6>If you're using ShareX, <a href='https://i.jlz.fun/DDP79Z9.txt'>use our destination config</a>.</h6>
          </div>
        )}
      </div>
    );
  }
}
