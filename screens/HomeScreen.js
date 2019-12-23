import React, {Component} from 'react';
import { Image, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CustomButton from '../components/CustomButton';
import { StackActions, NavigationActions, NavigationEvents } from 'react-navigation';
import * as SecureStore from 'expo-secure-store';
export default class HomeScreen extends Component {
  constructor()
  {
      super();
      this.state = { isLogin : false, loginbutton : '로그인', disabled:false, token : '' }
  }
  _refresh = async () => {
    SecureStore.getItemAsync('token', SecureStore.keychainService).then((result)=> {
      this.setState({
        token : result
      })
      if(result != null) { 
        console.log(result);
        this.setState({
          isLogin : true
        });
      } else {
        console.log(result);
        this.setState({
          isLogin : false
        });
      }
    }).catch((error) => {
      console.log(error);
    });
  }
  _enterLogin = async () =>  {
    SecureStore.getItemAsync('token', SecureStore.keychainService).then((result)=> {
      this.setState({
        token : result
      })     
    }).catch((error) => {
      console.log(error);
    });
    if(this.state.isLogin == true) { 
      SecureStore.getItemAsync('start_time', SecureStore.keychainService).then((result)=> {
        console.log(result);
        if(result == null) {
          this.setState({
            disabled : !this.state.disabled,
            isLogin : false
          });
          SecureStore.deleteItemAsync('token', SecureStore.keychainService);
          alert('로그아웃 성공!');
          setTimeout(() => {
            this.setState({
              disabled : !this.state.disabled
            });
          }, 100);
        } else {
          alert('퇴근 먼저 해주세요!');
        }
      }).catch((error) => {
        console.log(error);
      });
    } else if(this.state.isLogin == false) {
      this.setState({
        disabled : !this.state.disabled
      });
      setTimeout(() => {
        this.setState({
          disabled : !this.state.disabled
        });
        this.props.navigation.navigate('Login');
      }, 100);
    }
  }
  _enterRegister() {
    this.props.navigation.navigate('Register');
  }
  render() {
    return (
      <View style={styles.container}>
        <NavigationEvents
          onWillFocus={() => this._refresh()}
          onDidFocus={() => this._refresh()}
        />
        <Image
          style={{height:'40%', width:'100%', resizeMode:'cover'}}
          source={require('../assets/images/main_image.png')}
        />
        <TouchableOpacity onPress={this._enterLogin.bind(this)} style={{marginTop:100,paddingTop:20, paddingBottom:20,backgroundColor:'white',
        marginBottom:20, marginLeft:10,  marginRight:10,}}>
            <Text style={styles.loginbutton}>{this.state.isLogin ? '로그아웃' : '로그인'}</Text>
          </TouchableOpacity>
      </View>
    );
  }
}

HomeScreen.navigationOptions = {
   title: '홈',
    headerStyle: {
      backgroundColor: 'black',
    },
    headerTintColor: 'white',
    headerTitleStyle: {
      fontWeight: 'bold',
      textAlign:'center',
    },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: 'black',
  },
  loginbutton:{
    paddingTop:5,
    textAlign:'center',
    textAlignVertical:'center',
    color:'black',
    fontSize:20,
    fontWeight:'bold'
  },
  registerbuton:{
    paddingTop:5,
    textAlign:'center',
    textAlignVertical:'center',
    color:'black',
    fontSize:20,
    fontWeight:'bold'
  }
});
