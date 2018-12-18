import React, { Component } from 'react';
import {
  StyleSheet,
  Platform,
  Button,
  Alert,
  Text,
  View
} from 'react-native';
import Auth0 from 'react-native-auth0';

const credentials = require('./auth0-credentials');
const auth0 = new Auth0(credentials);

/*
*  Firstly check out auth0 documentation regarding setting up auth.
*  You will need to make changes in ios & android native code. *
* */

class App extends Component {
  state = {
    accessToken: null,
    credentials: credentials
  };

  _onLogin = () => {
    auth0.webAuth
    .authorize({
      scope: 'openid profile',
      audience: 'https://' + credentials.domain + '/userinfo'
    })
    .then(credentials => {
      Alert.alert(
          'Success',
          'AccessToken: ' + credentials.accessToken,
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
          { cancelable: false }
      );
      this.setState({ accessToken: credentials.accessToken,
        credentials: credentials
      });
    })
    .catch(error => console.log(error));
  };

  _onLogout = () => {
    if (Platform.OS === 'android') {
      this.setState({ accessToken: null });
    } else {
      auth0.webAuth
      .clearSession({})
      .then(success => {
        this.setState({ accessToken: null });
      })
      .catch(error => console.log(error));
    }
  };

  _checkInfoOnPrivateURLWithHeaderToken = () => {
    // Your headers can be different. I used auth with idToken from auth0
    // in my back-end
    fetch('insert any private url to test your token', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.state.credentials.idToken,
      },
    })
    .then(res => console.log('success', res))
    .catch(res => console.log('error', res));
  };

  _checkInfoOnPublicURL = () => {

    fetch('insert any public url to test')
        .then(res => console.log('success', res))
        .catch(res => console.log('error', res));
  };

  render() {
    const loggedIn = this.state.accessToken !== null;
    const loggedInTitle = loggedIn ? '' : 'not';
    console.log(this);
    return (
        <View style={styles.container}>
          <Text style={styles.header}>Auth0 Test project - Login</Text>
          <Text>
            You are {loggedInTitle} logged in.
          </Text>
          <Button
              onPress={loggedIn ? this._onLogout : this._onLogin}
              title={loggedIn ? 'Log Out' : 'Log In'}
          />
          <Button
              onPress={this._checkInfoOnPublicURL}
              title={'TEST PUBLIC URL'}
          />
          <Button
              onPress={this._checkInfoOnPrivateURLWithHeaderToken}
              title={'TEST PRIVATE URL'}
          />
        </View>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  }
});
