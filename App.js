import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import COLORS from './consts/colors';
import OnBoardScreen from './views/screens/OnBoardScreen';
import BottomNavigator from './views/navigation/BottomNavigator';
// import ProductDetailScreen from './views/screens/ProductDetailScreen';
// import HistoryOrderScreen from './views/screens/Customer/HistoryOrderScreen';
// import RegisterScreen from './views/screens/RegisterScreen';
// import LoginScreen from './views/screens/LoginScreen';
// address
// import AddressScreen from './views/screens/Customer/AddressScreen';
// import NewAddressScreen from './views/screens/Customer/NewAddressScreen';
// import EditAddressScreen from './views/screens/Customer/EditAddressScreen';
// import CustomerInfoScreen from './views/screens/Customer/CustomerInfoScreen';
// import HistoryOrderDetailScreen from './views/screens/Customer/HistoryOrderDetailScreen';
// import CheckoutScreen from './views/screens/CheckoutScreen';
// import ProductsScreen from './views/screens/ProductsScreen';
// import VoucherScreen from './views/screens/Customer/VoucherScreen';
// import VoucherListScreen from './views/screens/Customer/VoucherListScreen';

import { store } from './app/store';
import { Provider } from 'react-redux';
// import CartScreen from './views/screens/CartScreen';
// import WarnPasswordScreen from './views/screens/Customer/WarnPasswordScreen';
// import ChangePasswordScreen from './views/screens/Customer/ChangePasswordScreen';
// import ChangePassSucess from './views/screens/Customer/ChangePassSucess';
// import SuccessOrderScreen from './views/screens/SuccessOrderScreen';
// import SuccessOrder from './views/screens/Customer/SuccessOrder';
// import DeliveryDetailScreen from './views/screens/Shipper/DeliveryDetailScreen';
// import TestScreen from './views/screens/TestScreen';
// import DashboardShipper from './views/screens/Shipper/DashboardShipper';
// import ReviewProductScreen from './views/screens/ReviewProductScreen';

import React from 'react';
import { Suspense } from 'react';

const Stack = createStackNavigator();

const ResetPasswordScreen = React.lazy(() => import("./views/screens/ResetPasswordScreen"));
const ProductDetailScreen = React.lazy(() => import("./views/screens/ProductDetailScreen"));
const ReviewProductScreen = React.lazy(() => import("./views/screens/ReviewProductScreen"));
const ProductsScreen = React.lazy(() => import("./views/screens/ProductsScreen"));
const VoucherScreen = React.lazy(() => import("./views/screens/Customer/VoucherScreen"));
const VoucherListScreen = React.lazy(() => import("./views/screens/Customer/VoucherListScreen"));
const TestScreen = React.lazy(() => import("./views/screens/TestScreen"));
const CartScreen = React.lazy(() => import("./views/screens/CartScreen"));
const WarnPasswordScreen = React.lazy(() => import("./views/screens/Customer/WarnPasswordScreen"));
const ChangePasswordScreen = React.lazy(() => import("./views/screens/Customer/ChangePasswordScreen"));
const NewPasswordScreen = React.lazy(() => import("./views/screens/NewPasswordScreen"));
const ChangePassSucess = React.lazy(() => import("./views/screens/Customer/ChangePassSucess"));
const SuccessOrderScreen = React.lazy(() => import("./views/screens/SuccessOrderScreen"));
const SuccessOrder = React.lazy(() => import("./views/screens/Customer/SuccessOrder"));
const DeliveryDetailScreen = React.lazy(() => import("./views/screens/Shipper/DeliveryDetailScreen"));
const DashboardShipper = React.lazy(() => import("./views/screens/Shipper/DashboardShipper"));

const HistoryOrderScreen = React.lazy(() => import("./views/screens/Customer/HistoryOrderScreen"));
const RegisterScreen = React.lazy(() => import("./views/screens/RegisterScreen"));
const LoginScreen = React.lazy(() => import("./views/screens/LoginScreen"));

const AddressScreen = React.lazy(() => import("./views/screens/Customer/AddressScreen"));
const NewAddressScreen = React.lazy(() => import("./views/screens/Customer/NewAddressScreen"));
const EditAddressScreen = React.lazy(() => import("./views/screens/Customer/EditAddressScreen"));
const CustomerInfoScreen = React.lazy(() => import("./views/screens/Customer/CustomerInfoScreen"));
const HistoryOrderDetailScreen = React.lazy(() => import("./views/screens/Customer/HistoryOrderDetailScreen"));
const CheckoutScreen = React.lazy(() => import("./views/screens/CheckoutScreen"));



export default function App() {
  return (
    <Provider store={store}>
      <Suspense fallback={<Text>Loading...</Text>}>

        <NavigationContainer>
          <StatusBar backgroundColor={COLORS.white}></StatusBar>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name='BoardScreen' component={OnBoardScreen} />
            <Stack.Screen name="HomeScreen" component={BottomNavigator} />
            <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} />
            <Stack.Screen name="ReviewProductScreen" component={ReviewProductScreen} />
            <Stack.Screen name="HistoryOrderScreen" component={HistoryOrderScreen} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="NewPasswordScreen" component={NewPasswordScreen} />
            <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
            <Stack.Screen name="AddressScreen" component={AddressScreen} />
            <Stack.Screen name="NewAddressScreen" component={NewAddressScreen} />
            <Stack.Screen name="EditAddressScreen" component={EditAddressScreen} />
            <Stack.Screen name="CustomerInfoScreen" component={CustomerInfoScreen} />
            <Stack.Screen name="HistoryOrderDetailScreen" component={HistoryOrderDetailScreen} /> 
            <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
            <Stack.Screen name="ProductsScreen" component={ProductsScreen} />
            <Stack.Screen name="VoucherScreen" component={VoucherScreen} />
            <Stack.Screen name="VoucherListScreen" component={VoucherListScreen} />
            <Stack.Screen name="CartScreen" component={CartScreen} />
            <Stack.Screen name="WarnPasswordScreen" component={WarnPasswordScreen} />
            <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
            <Stack.Screen name="ChangePassSucess" component={ChangePassSucess} />
            <Stack.Screen name="SuccessOrderScreen" component={SuccessOrderScreen} />
            <Stack.Screen name="SuccessOrder" component={SuccessOrder} />
            {/* Shipper screen */}
            <Stack.Screen name="DeliveryDetailScreen" component={DeliveryDetailScreen} />
            <Stack.Screen name="DashboardShipper" component={DashboardShipper} />
            <Stack.Screen name="TestScreen" component={TestScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Suspense>
    </Provider>
  );
}
