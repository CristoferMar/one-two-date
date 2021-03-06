import React from 'react';
import parseRoute from './lib/parse-route';
import AppContext from './lib/app-context';
import Navbar from './components/nav-bar';
import UserLists from './components/user-lists';
import NewListForm from './components/new-list-form';
import NewDateForm from './components/new-date-form';
import ListDetails from './components/list-details';
import GenerateDate from './components/generate-date';
import UserHistory from './components/user-history';
import Lander from './components/landing-page';
import SignOn from './components/sign-on';
import ConnectionLost from './components/connection-lost';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: JSON.parse(window.localStorage.getItem('one-two-date-jwt')),
      route: parseRoute(window.location.hash),
      onlineCheck: true
    };
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({ route: parseRoute(window.location.hash) });
    });
    window.addEventListener('online', () => this.setState({ onlineCheck: true }));
  }

  handleSignIn() {
    this.setState({ userInfo: JSON.parse(window.localStorage.getItem('one-two-date-jwt')) });
    window.location.hash = '#My-Lists';
  }

  handleSignOut() {
    window.localStorage.removeItem('one-two-date-jwt');
    this.setState({ userInfo: null });
  }

  renderPage() {
    const { userInfo, route } = this.state;
    if (!userInfo) {
      if (route.path === '') {
        return <Lander signInHandler={this.handleSignIn} />;
      } else if (route.path === 'Sign-Up' || route.path === 'Log-In') {
        return <SignOn signInHandler={this.handleSignIn} />;
      } else {
        window.location.hash = '';
        return <Lander signInHandler={this.handleSignIn} />;
      }
    } else if (userInfo && (route.path === '' || route.path === 'Sign-Up' || route.path === 'Log-In')) { window.location.hash = '#My-Lists'; }
    if (route.path === 'My-Lists') {
      return <UserLists />;
    }
    if (route.path === 'New-List') {
      return <NewListForm />;
    }
    if (route.path === 'New-Date') {
      return <NewDateForm listId={route.params.get('listId')} />;
    }
    if (route.path === 'Read-List') {
      return <ListDetails listId={route.params.get('listId')} />;
    }
    if (route.path === 'Generate-Date') {
      return <GenerateDate />;
    }
    if (route.path === 'My-History') {
      return <UserHistory />;
    }
  }

  render() {
    const onlineTest = navigator.onLine;
    const { path } = this.state.route;
    const withNav = !['New-List', 'New-Date', 'Langing-Page', '', 'Log-In', 'Sign-Up'].includes(path);
    const pageClass = withNav ? 'page with-navbar' : 'page';
    const online = navigator.onLine;
    const userInfo = this.state.userInfo ? this.state.userInfo : null;
    const contextValue = { userInfo, online };

    return (
      <AppContext.Provider value={contextValue}>
        {withNav &&
          <Navbar path={path} signOutHandler={this.handleSignOut} />
        }

        <div className={pageClass}>
          {onlineTest
            ? this.renderPage(this.state.route)
            : <ConnectionLost />
          }
        </div>
      </AppContext.Provider>
    );
  }
}
