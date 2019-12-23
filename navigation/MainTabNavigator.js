import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DiaryScreen from '../screens/DiaryScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home:HomeScreen,
    Login:LoginScreen,
    Register:RegisterScreen 
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      title: '홈',
    }),
    initialRouteName: 'Home',
  },
);

HomeStack.navigationOptions = {
  tabBarLabel: '홈',
  tabBarOptions: {
  activeTintColor: 'white',
  labelStyle: {
    fontSize: 12,
  },
  style: {
    backgroundColor: 'black',
    },
  },
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-home${focused ? '' : '-outline'}`
          : 'md-home'
      }
    />
  ),
};

HomeStack.path = '../Screens/HomeScreen';

const LinksStack = createStackNavigator(
  {
    Links: LinksScreen,
    Diary: DiaryScreen,
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      title: '근무일지',
    }),
    initialRouteName: 'Links',
  },
);

LinksStack.navigationOptions = {
  tabBarLabel: '근무일지',
  tabBarOptions: {
  activeTintColor: 'lightblue',
  labelStyle: {
    fontSize: 12,
  },
  style: {
    backgroundColor: 'black',
    },
  },
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-calendar' : 'md-calendar'} />
  ),
};

LinksStack.path = '';

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: '마이페이지',
  tabBarOptions: {
  activeTintColor: 'lightblue',
  labelStyle: {
    fontSize: 12,
  },
  style: {
    backgroundColor: 'black',
    },
  },
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios:contact' : 'md-contact'} />
  ),
};

SettingsStack.path = '';

const tabNavigator = createBottomTabNavigator(
  {
    Home:HomeStack,
    Links:LinksStack,
    Settings:SettingsStack,
  }, {
        defaultNavigationOptions: ({navigation}) => ({
          tabBarIcon: ({focused, horizontal, tintColor}) => {
                const {routeName} = navigation.state;
                let icon = "▲";

                // can use react-native-vector-icons
                // <Icon name={iconName} size={iconSize} color={iconColor} />
                return <Text style={{color: focused && "#46c3ad" || "#888"}}>{icon}</Text>
            }
        }),
        lazy: true,
        tabBarOptions: {
            activeTintColor: "#46c3ad",
            inactiveTintColor: "#888",
        },
    }
);

tabNavigator.path = '';

const AppStack = createStackNavigator(
    {
        tabNavigator: {
            screen: tabNavigator,
            navigationOptions: ({navigation}) => ({
                header: null,
            }),
        },
    }
);

export default createAppContainer(AppStack);