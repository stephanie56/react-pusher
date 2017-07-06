import React from 'react';
import { Redirect, Route, BrowerRouter } from 'react-router-dom';
import App from './App';
import Auth from './Auth/Auth';
import history from './history';

// import components
import Home from './Home/Home'; // the / route
import Profile from './Profile/Profile'; // the /profile route
import Chat from './Chat/Chat'; // the /chat route
import Callback from './Callback/Callback'; // the /callback route

// Auth0 service
const auth = new Auth();

// This function use the handleAuthenication() method in Auth/Auth.js
const handleAuthenication = (nextState, replace) => {
  if(/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthenication();
  }
}


// Routes are declared here and exported for use in other components
export const makeMainRoutes = () => {
  return (
    <BrowerRouter>
      <div>
        <Route path='/' render={(props) => <App auth={auth} {...props}/> }/>
        <Route path='/home' render={(props) => <Home auth={auth} {...props}/> }/>
        <Route path='/chat' render={(props) => (
          !auth.isAutenticated() ? (
            <Redirect to="/home" />
          ) : (
            <Chat auth={auth} {...props} />
          )
        )}/>
        <Route path="/profile" render={(props) => (
          !auth.isAutenticated() ? (
            <Redirect to="/home"/>
          ) : (
            <Profile auth={auth} {...props}/>
          )
        )}/>
      <Route path="/callback" render={(props) => {
          handleAuthenication(props);
          return <Callback {...props} />
        }}/>
      </div>
    </BrowerRouter>
  );
}
