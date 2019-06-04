import { h, Component } from 'preact';
import { Link } from 'preact-router';

export default class Navbar extends Component {
  render() {
    return (
      <div class='nav'>
        <h5 class='nav-logo'>File Host</h5>
        {/* <Link class='nav-item' href='/dashboard'>
          Dashboard
        </Link> */}
        {/* <a class='nav-item' href='#'>
          Item
        </a>
        <a class='nav-item' href='#'>
          Item
        </a> */}
      </div>
    );
  }
}
