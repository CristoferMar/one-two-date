import React from 'react';

export default class SignOn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogIn: window.location.hash === '#Log-In',
      userName: '',
      userPassword: ''

    };
    this.changePage = this.changePage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.isLogIn) {
      console.log('they are logging in');
      // '/api/auth/sign-up';
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
          console.log('result:', result);
          if (result.error) {
            alert(`Error: ${result.error}`);
            this.setState({ userPassword: '' });
          } else {
            alert("You've succesfully logged in");
            window.localStorage.setItem('one-two-date-jwt', JSON.stringify(result));
            location.reload();
          }
        })
        .catch(err => console.error(err));

    } else {

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
          result.userId
            ? alert(`Welcome new user, ${this.state.userName}`)
            : alert(`Error: User Name "${this.state.userName}" may already be taken.`);
        })
        .catch(err => console.error(err));
    }
  }

  handleChange() {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  changePage(event) {
    event.preventDefault();
    this.setState({
      isLogIn: !this.state.isLogIn,
      userName: '',
      userPassword: ''
    });
    window.location.hash = this.state.isLogIn ? '#Sign-Up' : '#Log-In';
  }

  render() {
    return (
      <>
        <div className="absolute-login float-right">
          <button onClick={this.changePage} className="width-80px white login-btn blue-fill margin-right-10 click">{this.state.isLogIn ? 'Sign Up' : 'Log In'}</button>
          <button className="white login-btn blue-fill click">Demo User</button>
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
              <button className="float-right login-btn blue-fill white width-80px click">{this.state.isLogIn ? 'Sign In' : 'Sign Up'}</button>
            </div>
          </form>

        </div>
      </>
    );
  }
}
