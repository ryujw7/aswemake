import React, { Component } from 'react';
import { View, Text, Button, ScrollView, StyleSheet,PermissionsAndroid,TouchableOpacity } from 'react-native';
import axios from '../components/Axios';
import { render } from 'react-dom';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import XLSX from 'xlsx';
import * as RNFS from 'react-native-fs';
import * as SecureStore from 'expo-secure-store';

var data;
export default class SettingsScreen extends Component {
  /**
   * Go ahead and delete ExpoConfigView and replace it with your content;
   * we just wanted to give you a quick view of your config.
   */
  constructor(props) {
    super(props);
    this.state = { data: null, name: null };
  }
  __getAllData = async () => {
    SecureStore.getItemAsync('token', SecureStore.keychainService).then((result)=> {
      if(result != null) {
        try {
          console.log(result);
          axios.get('http://15.164.34.53:3000/admin/showAll',
          {
            headers: {  'Content-Type': 'application/json',
              token : result  }
          })
          .then(response => {
            if(response.data.status == 200) {
              this.__EXCEL(response.data.data.Info, 0);
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
  }

  __getData = () => {
    if(this.state.name == null) {
      alert('이름을 입력해 주세요');
    } else {
      SecureStore.getItemAsync('token', SecureStore.keychainService).then((result)=> {
        if(result != null) {
          try {
            console.log(result);
            axios.get('http://15.164.34.53:3000/admin/show?name=' + this.state.name,
            {
              headers: {  'Content-Type': 'application/json',
                token : result }
            })
            .then(response => {
              if(response.data.status == 200) {
                this.__EXCEL(response.data.data.Info, 1);
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
    }
   
  }
  __EXCEL = async (info, flag) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title :  '파일 저장소 권한 동의' ,
          message : '파일 접근 권한에 동의 하십니까?',
          buttonNuetral:'나중에',
          buttonNegative : '아니요',
          buttonPositive : '네',
        },
      );
      if(granted == PermissionsAndroid.RESULTS.GRANTED) {
        console.log('저장소 사용 가능');
        const output = str => str;
        var jtos = XLSX.utils.json_to_sheet(info);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, jtos, "People");
        const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'base64' });
        if(flag == 0) {  
          const file = RNFS.ExternalStorageDirectoryPath + "/전체근무일지.xlsx";
          RNFS.writeFile(file, wbout, 'base64').then(res => {
            console.log(file);
          }).catch(err => {
            console.log(err.message);
          });
        } else if(flag == 1) { 
          const file = RNFS.ExternalStorageDirectoryPath + "/" + this.state.name + "근무일지.xlsx";
          RNFS.writeFile(file, wbout, 'base64').then(res => {
            console.log(file);
          }).catch(err => {
            console.log(err.message);
          });
        }
      } else {
        console.log('external storage permission denied');
      }
    } catch(err) {
      console.log(err);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={{height:'10%',backgroundColor:'blue'}} onPress={this.__getAllData.bind()}>
         <Text style={{color:'white', fontSize:30, textAlignVertical:'center', textAlign:'center', fontColor:'white'}}>전체 근무일지 가져오기</Text>
        </TouchableOpacity>
        <TextInput
          style={{ fontSize:20, height: '10%', color: 'black', backgroundColor: 'white', marginTop: 20, marginBottom:20, padding: 10 }}
          placeholder="누구 찾을래요?"
          onChangeText={(text) => this.setState({ name: text })}
          value={this.state.name} />
        <TouchableOpacity style={{height:'10%',backgroundColor:'blue'}} onPress={this.__getData.bind()}>
          <Text style={{color:'white', fontSize:30, textAlignVertical:'center', textAlign:'center', fontColor:'white'}}>해당직원 근무일지 가져오기</Text>
        </TouchableOpacity >
        <FlatList data={this.state.data} renderItem={({ item }) =>
          <View style={{ marginTop: 15, backgroundColor: 'gray' }}>
            <Text style={{ fontSize: 15, color: 'red' }}>{item.date}</Text>
            <Text style={{ fontSize: 15, color: 'orange' }}>{item.name}</Text>
            <Text style={{ fontSize: 15, color: 'yellow' }}>{item.id}</Text>
            <Text style={{ fontSize: 15, color: 'green' }}>{item.content}</Text>
            <Text style={{ fontSize: 15, color: 'blue' }}>{item.start_time}</Text>
            <Text style={{ fontSize: 15, color: 'darkblue' }}>{item.finish_time}</Text>
            <Text style={{ fontSize: 15, color: 'purple' }}>{item.is_meal == '1' ? '밥' : '안 밥'}</Text>
          </View>
        } />
      </View>
    )
  }
}

SettingsScreen.navigationOptions = {
  title: '마이페이지',
  headerStyle: {
    backgroundColor: 'black',
  },
  headerTintColor: 'white',
  headerTitleStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: 'black',
  },
});