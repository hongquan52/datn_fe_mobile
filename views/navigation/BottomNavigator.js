import React from 'react'
import { Text } from 'react-native'
import COLORS from '../../consts/colors'
import { View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/MaterialIcons'
import HomeScreen from '../screens/HomeScreen'
import CartScreen from '../screens/CartScreen'
import ProductsScreen from '../screens/ProductsScreen'
import HistoryOrderScreen from '../screens/Customer/HistoryOrderScreen'
import TestScreen from '../screens/TestScreen'
import Counter from '../../features/counter/Counter';

const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
  return (
    <Tab.Navigator
    tabBarOptions={{
        style: {
          height: 100,
          borderTopWidth: 0,
          elevation: 0,
        },
        showLabel: false,
        activeTintColor: COLORS.primary,
      }}
    >
        <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
            tabBarIcon: ({color}) => (
                <View style={{alignItems: 'center'}}>
                    <Icon name='home-filled' color={color} size={28} />
                    <Text style={{fontSize: 11}}>Home</Text>
                </View>
            )
        }}
        />
        
        <Tab.Screen
        name="Shopping"
        component={ProductsScreen}
        options={{
            tabBarIcon: ({color}) => (
                <View style={{alignItems: 'center'}}>
                    <Icon name='shopping-bag' color={color} size={28} />
                    <Text style={{fontSize: 11}}>Shopping</Text>
                </View>
            )
        }}
        />
        <Tab.Screen
        name="Search"
        component={HomeScreen}
        options={{
            tabBarIcon: ({color}) => (
                <View
                    style={{
                        width: 60,
                        height: 60,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: COLORS.white,
                        borderColor: COLORS.primary,
                        borderRadius: 30,
                         borderWidth: 2,
                        top: -25,
                    }}
                >
                    <Icon name='search' color={color} size={28} />
                </View>
            )
        }}
        />
        <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
            tabBarIcon: ({color}) => (
                <View style={{alignItems: 'center'}}>
                    <Icon name='shopping-cart' color={color} size={28} />
                    <Text style={{fontSize: 11}}>Cart</Text>
                </View>
            )
        }}
        />
        <Tab.Screen
        name="Chat box"
        component={Counter}
        options={{
            tabBarIcon: ({color}) => (
                <View style={{alignItems: 'center'}}>
                    <Icon name='chat-bubble' color={color} size={28} />
                    <Text style={{fontSize: 11}}>Chat</Text>
                </View>
            )
        }}
        />
    </Tab.Navigator>
  )
}

export default BottomNavigator