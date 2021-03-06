import React from 'react';

export default function DemoUser(props) {
  const req = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'DemoUser',
      password: 'DemoUser'
    })
  };

  let text = 'Demo User';

  const loginDemo = () => {
    fetch('/api/auth/sign-in', req)
      .then(res => res.json())
      .then(result => {
        if (result.error) {
          text = 'That was an error. Please try again';
        } else {
          window.localStorage.setItem('one-two-date-jwt', JSON.stringify(result));
          props.handleSignOn();
        }
      })
      .catch(err => console.error(err));

  };

  return (
    <button onClick={e => loginDemo()} className="white login-btn blue-fill click">{text}</button>
  );
}
