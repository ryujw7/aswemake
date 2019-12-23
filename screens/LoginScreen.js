import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, TextInput} from 'react-native';
import CustomButton from '../components/CustomButton';
import Expo from 'expo';
import { StackActions, NavigationActions } from 'react-navigation';
import axios from '../components/Axios';
import * as SecureStore from 'expo-secure-store';
import HomeScreen from './HomeScreen';
type Props = {};
export default class Login extends Component {
  constructor()
  {
      super();
      this.state = { id : '', password : '' }
  }
  onPress = async () => {
    if(this.state.id == '') {
      alert('아이디를 입력해주세요.');
    } else if(this.state.password == '') {
      alert('비밀번호를 입력해주세요.')
    } else {
      try {
        axios.post('http://15.164.34.53:3000/auth/signin',{
          id : this.state.id,
          password : this.state.password
        },
        { 
          headers: {'Content-Type': 'application/json'}
        })
        .then(response => {
          if(response.data.status == 200) {
            alert(response.data.message);
            SecureStore.getItemAsync('token', SecureStore.keychainService).then((result)=> {
              if(result == null) {   
                SecureStore.setItemAsync('token', response.data.data.token, SecureStore.keychainService);
              } else {
                SecureStore.deleteItemAsync('token', SecureStore.keychainService);   
                SecureStore.setItemAsync('token', response.data.data.token, SecureStore.keychainService);
              }
              console.log(result);            
            }).catch((error) => {
              console.log(error);
            });
            this.props.navigation.pop();
          } else {
           alert(response.data.message);
          }
        })
      } catch {
        console.log(response);
      }
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header} />
        <View style={styles.title}>
          <Text style={{fontSize:35,paddingBottom:20}}>로그인</Text>
          <View style={{width:"100%",borderBottomWidth:0.5,borderColor:'#444'}} />
        </View>
        <View style={styles.content}>
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingBottom:10}}>
            <Text style={{fontSize:15}}>아이디</Text>
            <TextInput maxLength={10} 
             style={{borderColor: '#aaa', width:'70%', height:35, borderWidth: 1, borderRadius: 5, padding:5}}
             onChangeText={(text) => this.state.id = text}/>
          </View>
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingBottom:10}}>
            <Text style={{fontSize:15}}>비밀번호</Text>
            <TextInput maxLength={10} secureTextEntry={true} 
            style={{borderColor: '#aaa', width:'70%', height:35, borderWidth: 1, borderRadius: 5, padding:5}}
            onChangeText={(text) => this.state.password = text}/>
          </View>
        </View>
        <View style={styles.footer}>
          <CustomButton
            buttonColor={'#444'}
            title={'취소'}
            onPress={() => this.props.navigation.pop()}/>
          <CustomButton
          buttonColor={'#023e73'}
          title={'확인'}
          onPress={this.onPress.bind(this)}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  header: {
    width:'100%',
    height:'5%',
    //backgroundColor: '#ff9a9a',
  },
  title: {
    width:'100%',
    height:'18%',
    justifyContent: 'center',
    //backgroundColor: '#9aa9ff',
  },
  content: {
    flex: 1,
    paddingLeft:10,
    paddingRight:10,
    paddingBottom:30,
    //backgroundColor: '#d6ca1a',
  },
  footer: {
    width:'100%',
    height:'20%',
    //backgroundColor: '#1ad657',
  },
});