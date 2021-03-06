import React from 'react';
import DemoUser from './demo-user';

export default class SignOn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogIn: window.location.hash === '#Log-In',
      newUser: window.location.hash === '#Sign-Up',
      userName: '',
      userPassword: '',
      nameTaken: false,
      invalidLogin: false,
      refused: false
    };
    this.changePage = this.changePage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    if (this.state.newUser) {
      event.preventDefault();
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: this.state.userName,
          password: this.state.userPassword
        })
      };
      fetch('/api/auth/sign-up', req)
        .then(res => res.json())
        .then(result => {
          if (result.userId) {
            this.setState({ newUser: false });
            this.handleSubmit();
          } else {
            this.setState({ nameTaken: true, userName: '', userPassword: '', refused: true });
            setTimeout(() => { this.setState({ refused: false }); }, 300);
          }
        })
        .catch(err => console.error(err));
    } else {
      if (this.state.isLogIn) event.preventDefault();
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: this.state.userName,
          password: this.state.userPassword
        })
      };

      fetch('/api/auth/sign-in', req)
        .then(res => res.json())
        .then(result => {
          if (result.error) {
            this.setState({ userPassword: '', invalidLogin: true, refused: true });
            setTimeout(() => { this.setState({ refused: false }); }, 300);
          } else {
            window.localStorage.setItem('one-two-date-jwt', JSON.stringify(result));
            this.props.signInHandler();
          }
        })
        .catch(err => console.error(err));
    }
  }

  handleChange() {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  changePage(event) {
    this.setState({
      isLogIn: !this.state.isLogIn,
      newUser: !this.state.newUser,
      userName: '',
      userPassword: '',
      nameTaken: false,
      invalidLogin: false
    });
    window.location.hash = this.state.isLogIn ? '#Sign-Up' : '#Log-In';
  }

  render() {
    const { nameTaken, invalidLogin, refused } = this.state;
    const singUpBtn = !nameTaken ? 'Sign Up' : 'That user name is taken. Try again';
    const loginBtn = !invalidLogin ? 'Log In' : 'Invalid login. Please try again';
    const shake = refused ? 'shake' : '';
    return (
      <>
        <div className="absolute-login float-right">
          <button onClick={this.changePage} className="width-80px white login-btn blue-fill margin-right-10 click">{this.state.isLogIn ? 'Sign Up' : 'Log In'}</button>
          <DemoUser handleSignOn={this.props.signInHandler} />
        </div>

        <div className="margin-top full-width center-content align-center ">
          <form onSubmit={this.handleSubmit} action="" className="flex align-center column register-border space-between">
            <img className="small-logo" src="/images/small-logo.svg" alt="One Two Date" />
            <h3 className="sign-on-title">{this.state.isLogIn ? 'Log into 1.2..Date' : 'Create An Account'}</h3>
            <div className="full-width">
              <label htmlFor="userName">User Name</label>
              <input value={this.state.userName} onChange={this.handleChange} autoFocus name="userName" type="text" id="userName" required className="text-box margin-bottom-7rm" maxLength="30" />
              <label htmlFor="userPassword">Password</label>
              <input value={this.state.userPassword} onChange={this.handleChange} name="userPassword" maxLength="30" type="password" id="userPassword" required className="text-box margin-bottom-7rm" />
            </div>
            <div className="full-width">
              <button className={`float-right login-btn blue-fill white click ${shake}`}>{this.state.isLogIn ? loginBtn : singUpBtn}</button>
            </div>
          </form>
        </div>
      </>
    );
  }
}
