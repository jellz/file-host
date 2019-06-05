import { h, Component } from 'preact';
import '../styles/components/footer';
import { Link } from 'preact-router';

export default class Footer extends Component {
  render() {
    return (
      <div class='footer'>
        <div class='container'>
          <grid columns='4'>
            <c>
              <h2 class='title no-padding'>File Host</h2>
              <div class='footer-description'>text here</div>
            </c>
            <c>
              <h4 class='title no-padding'>Site Map</h4>
              <ul>
                <Link href='/' class='footer-link'>
                  Home
                </Link>
                <Link href='/dashboard' class='footer-link'>
                  Dashboard
                </Link>
                <Link href='/about' class='footer-link'>
                  About
                </Link>
              </ul>
            </c>
            <c />
            <c>
              <div class='footer-copyright-notice'>
                Copyright &copy; 2019 Daniel Gulic
              </div>
            </c>
          </grid>
        </div>
      </div>
    );
  }
}
