import React, {useState} from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const LoginPage = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(userCred => {
        const userId = userCred.user.uid;

        // Check if the user ID exists in the "admins" collection
        firestore()
          .collection('appAdmins')
          .doc(userId)
          .get()
          .then(doc => {
            if (doc.exists) {
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Logged in successfully!',
                visibilityTime: 3000,
                autoHide: true,
                topOffset: 30,
                bottomOffset: 40,
              });
              navigation.navigate('MenuPage');
            } else {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'You are not authorized to log in as an admin',
                visibilityTime: 3000,
                autoHide: true,
                topOffset: 30,
                bottomOffset: 40,
              });
            }
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        if (error.code === 'auth/invalid-email') {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Invalid email address',
            visibilityTime: 3000,
            autoHide: true,
            topOffset: 30,
            bottomOffset: 40,
          });
        } else if (error.code === 'auth/user-not-found') {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'User not found',
            visibilityTime: 3000,
            autoHide: true,
            topOffset: 30,
            bottomOffset: 40,
          });
        } else if (error.code === 'auth/wrong-password') {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Wrong password',
            visibilityTime: 3000,
            autoHide: true,
            topOffset: 30,
            bottomOffset: 40,
          });
        } else {
          console.error(error);
        }
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Chatter Admin App</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          placeholderTextColor="#2196F3"
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Password"
          placeholderTextColor="#2196F3"
          secureTextEntry={true}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerBtn}
        onPress={() => navigation.navigate('RegisterPage')}>
        <Text style={styles.registerText}>Register now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#2196F3',
    marginBottom: 40,
  },
  inputView: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: 'black',
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#2196F3',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  loginText: {
    color: '#fff',
  },
  registerBtn: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  registerText: {
    color: '#2196F3',
  },
});
