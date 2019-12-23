import React, {Component} from 'react';
import { TouchableOpacity, View, ScrollView, StyleSheet, Text } from 'react-native';
import Clock from 'react-live-clock'
import { NavigationEvents, StackActions, NavigationActions } from 'react-navigation'
import * as SecureStore from 'expo-secure-store';
import axios from '../components/Axios';
export default class LinksScreen extends Component {
  constructor()
    {
        super();
        
        this.state = { currentTime: null, currentDay: null, isActive:true, disabled:false }

        this.daysArray = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];
    }
     _refresh = async () => {
        SecureStore.getItemAsync('start_time', SecureStore.keychainService).then((result)=> {
          console.log(result);
          if(result == null) {
            this.setState({
              isActive : true
            })
          } else {
            this.setState({
              isActive : false
            })
          }
        }).catch((error) => {
          console.log(error);
        });
    }
    UNSAFE_componentWillMount()
    {
        this.getCurrentTime();
    }
    getCurrentTime = async () =>
    {
        let hour = new Date().getHours() + 9;
        let minutes = new Date().getMinutes();
        let seconds = new Date().getSeconds();
        let am_pm = 'pm';
 
        if( minutes < 10 )
        {
            minutes = '0' + minutes;
        }
 
        if( seconds < 10 )
        {
            seconds = '0' + seconds;
        }
 
        if( hour > 12 )
        {
            hour = hour - 12;
        }
 
        if( hour == 0 )
        {
            hour = 12;
        }        
 
        if( new Date().getHours() + 9 < 12 )
        {
          am_pm = 'am';
        }
 
        this.setState({ currentTime: hour + ':' + minutes + ':' + seconds + ' ' + am_pm });
        
        this.daysArray.map(( item, key ) =>
        {
            if( key == new Date().getDay() )
            {
                this.setState({ currentDay: item.toUpperCase() });
            }
        })        
    }
 
    componentWillUnmount()
    {
        clearInterval(this.timer);
    }
 
    componentDidMount()
    {
        this.timer = setInterval(() =>
        {
            this.getCurrentTime();
        }, 1000);
    }
    onPress = async () => {
      if(this.state.isActive == false) { 
        this.setState({
          disabled : !this.state.disabled
        });
        //SecureStore.deleteItemAsync('start_time', SecureStore.keychainService);
        this.setState({
          isActive : !this.state.isActive
        });
        setTimeout(() => {
          this.setState({
            disabled : !this.state.disabled
          });
        }, 1000);
        this.props.navigation.navigate('Diary');
      } else {
        this.setState({
          disabled : !this.state.disabled
        });
        SecureStore.getItemAsync('token', SecureStore.keychainService).then((result)=> {
          if(result != null) {
            try {
              console.log(result);
              axios.put('http://15.164.34.53:3000/work',{
              },
              {
                headers: {'Content-Type': 'application/json',
                          token : result}
              })
              .then(response => {
                console.log(response.data);
                if(response.data.status == 200) {
                  this.setState({
                    isActive : !this.state.isActive
                  });
                  SecureStore.setItemAsync('start_time', response.data.data.start_time, SecureStore.keychainService);
                  alert(response.data.message + '\n오늘도 힘찬 하루 되세요!\n출근시간 : ' + response.data.data.start_time);
                } else {
                  alert(response.data.message);
                }
              })
            } catch {
              console.log(response);
            }
          } else {
            alert('로그인 해주세요.');
            console.log(result);
          }
        }).catch((error) => {
          console.log(error);
        });
        setTimeout(() => {
          this.setState({
            disabled : !this.state.disabled
          });
        }, 1000);
      }
    }
    render()
    {
        return(
            <View style = { styles.container }>
                <NavigationEvents
                  onWillFocus={() => this._refresh()}
                  onDidFocus={() => this._refresh()}
                />  
                <View>
                    <Text style = { styles.daysText }>{ this.state.currentDay }</Text>
                    <Text style = { styles.timeText }>{ this.state.currentTime }</Text>                    
                </View>
                <TouchableOpacity disabled={this.state.disabled} onPress={this.onPress} 
                                  style={{width: '100%',paddingTop:10, paddingBottom:10, 
                                  marginBottom:50, marginLeft:10,  marginRight:10, backgroundColor:'#f59400',}}>
                    <Text style={styles.workout}>{this.state.isActive ? '출근' : '퇴근'}</Text>
               </TouchableOpacity>
            </View>
        );
    }
}

LinksScreen.navigationOptions = {
  title: '근무일지',
    headerStyle: {
      backgroundColor: 'black',
    },
    headerTintColor: 'white',
    headerTitleStyle: {
      fontWeight: 'bold',
      textAlign:'center',
    },
};

const styles = StyleSheet.create(
{
    container:
    {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black',
      paddingTop: (Platform.OS == 'ios') ? 20 : 0
    },
 
    timeText:
    {
      fontSize: 50,
      color: '#f59400',
      paddingBottom: 20,
    },
 
    daysText:
    {
      color: '#f59400',
      fontSize: 25,
      paddingBottom: 0
    },
      workout:{
      textAlign:'center',
      textAlignVertical:'center',
      color:'white',
      fontSize:30,
      fontWeight:'normal'
    }
});
