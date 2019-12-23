import React, {Component} from 'react';
import {MaterialCommunityIcons, TouchableOpacity, StyleSheet, Text, View, Image, TextInput, KeyboardAvoidingView} from 'react-native';
import {CheckBox} from 'react-native-elements';
import CustomButton from '../components/CustomButton';
import { StackActions, NavigationActions } from 'react-navigation';
import * as SecureStore from 'expo-secure-store';
import axios from '../components/Axios';
type Props = {};
export default class Diary extends Component {
    constructor()
    {
      super();
      this.state = { wod : '', diary:'', is_meal : "1", checked : false}
    }
    onPress = async () => {
        if(this.state.wod == '') {
            alert('오늘 근무한 내용을 적어주세요!!');
        } else {
            if(this.state.checked == true) {
                this.setState({
                    is_meal : "1"
                })
            } else {
                this.setState({
                    is_meal : "0"
                })
            }
            SecureStore.getItemAsync('token', SecureStore.keychainService).then((result)=> {
               if(result != null) {
                    SecureStore.getItemAsync('start_time', SecureStore.keychainService).then((resultTime)=> {
                        try {
                            console.log(result);
                            console.log(resultTime);
                            console.log(this.state.wod);
                            console.log(this.state.is_meal);
                            axios.post('http://15.164.34.53:3000/boards',{
                                content : this.state.wod,
                                diary : this.state.diary,
                                start_time : resultTime,
                                is_meal : this.state.is_meal
                            },
                            {
                                headers: {'Content-Type': 'application/json',
                                        token : result}
                            })
                            .then(response => {
                                console.log(response.data);
                                if(response.data.status == 201) {
                                    SecureStore.deleteItemAsync('start_time', SecureStore.keychainService);
                                    alert(response.data.message + '\n오늘도 수고하셨습니다!!');
                                    this.props.navigation.pop();
                                } else {
                                    alert(response.data.message);
                                }
                            })
                        } catch {
                            console.log(response);
                        }
                    }).catch((error) => {
                    console.log(error);
                    });
                } else {
                    alert('로그인 해주세요.');
                    console.log(result);
                }
            }).catch((error) => {
                console.log(error);
            });
        }
    }
    render() {
        return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior="padding">
                <View style={styles.input}> 
                    <TextInput
                        style={styles.inputText}
                        placeholder='오늘 하신 업무내용을 기록해주세요.'
                        autoCorrect={ false }
                        multiline={true}
                        onChangeText={(text) => this.state.wod = text}
                    />
                    <TextInput
                        style={styles.inputText}
                        placeholder='오늘의 세줄 일기를 기록해주세요.'
                        autoCorrect={ false }
                        multiline={true}
                        onChangeText={(text) => this.state.diary = text}
                    />
                    <CheckBox
                        center
                        title='식사 여부'
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        onPress={() => this.setState({ 
                            checked: !this.state.checked 
                            })}
                        checked={this.state.checked}
                    />
                    <TouchableOpacity onPress={this.onPress.bind(this)} style={styles.footer}>
                        <Text style={styles.finish}>퇴근하기</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
        );
    }
}

const styles = StyleSheet.create({
    inputText:{
        height:'35%',
        fontSize:20,
        color:'black',
        padding:10,
        elevation:2,
        shadowOpacity:10,
    },
    finish:{
        color:'white',
        fontSize:30,
        fontWeight:'bold',
        textAlign:'center',
    },
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
        alignSelf:'baseline',
        justifyContent:'center',
        backgroundColor:'black',
        width:'100%',
        height:'20%',
        //backgroundColor: '#1ad657',
    },
}); 