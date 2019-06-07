import { h, Component } from 'preact';

const DOMAIN_NAME_REGEX = /^(?=.{0,253}$)(([a-z0-9_][a-z0-9_-]{0,61}[a-z0-9_]|[a-z0-9_])\.)+((?=.*[^0-9])([a-z0-9][a-z0-9-]{0,61}[a-z0-9]|[a-z0-9]))$/i;

export default class DashboardAccountSettings extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  state = {
    customDomain: this.props.user.customDomain
  };

  handleChange(e) {
    const customDomain = e.target.value.trim();
    this.setState({
      customDomain: customDomain.length < 1 ? null : customDomain
    });
    console.log(this.state);
  }

  async handleSubmit(e) {
    e.preventDefault();
    const customDomain = this.state.customDomain;
    if (!customDomain) return;
    const domainOk = DOMAIN_NAME_REGEX.exec(customDomain);
    if (!domainOk) return alert('Invalid domain');
    // alert('DOMAIN OK!');
    this.props.setCustomDomain(customDomain);
  }

  render() {
    return (
      <div>
        {this.props.user && (
          <div>
            <h4>Account Settings</h4>
            <div class='card'>
              <div>
                <div>
                  <label>Custom Domain</label>
                  <form onSubmit={this.handleSubmit}>
                    <input
                      type='text'
                      value={this.state.customDomain}
                      onChange={this.handleChange}
                    />
                    <p>
                      Create an A record on your domain pointed to{' '}
                      <b>66.70.189.58</b>
                    </p>
                    <input type='submit' value='Update' />
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
