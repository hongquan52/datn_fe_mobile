// import React from 'react'
// import { View, Text, SafeAreaView, Image, TextInput, TouchableOpacity, StyleSheet} from 'react-native'
// import Icon from 'react-native-vector-icons/MaterialIcons'
// import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
// import COLORS from '../../consts/colors'
// import {PrimaryButton} from '../components/Button'

// const LoginScreen = ({navigation}) => {
//   const [hidePassword, setHidePassword] = React.useState(true);

//   return (
//     <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
//       <View style={{paddingHorizontal: 25}}>
//         <View style={{alignItems: 'center'}}>
//           <Image source={require('../../assets/cheesePizza.png')} style={{borderRadius: 50,height: 200, width: 200, transform:[{rotate: '-5deg'}]}} />

//         </View>
//         <Text style={{fontSize: 28, fontWeight:500, marginTop: 30, marginBottom: 10}}>Login</Text>
//         {/* email */}
//         <View style={{flexDirection: 'row', borderBottomColor: COLORS.dark, borderBottomWidth: 1, marginBottom: 25}}>
//           <Icon name='email' color={COLORS.dark} size={25} style={{ marginRight: 5 }}/>
//           <TextInput placeholder='Email...' 
//           style={{ flex: 1, paddingVertical: 0}}
//             keyboardType='email' />
//         </View>
//         {/* password */}
//         <View style={{flexDirection: 'row', borderBottomColor: COLORS.dark, borderBottomWidth: 1, marginBottom: 25}}>
//           <Icon name='network-locked' color={COLORS.dark} size={25} style={{ marginRight: 5 }} />
//           <TextInput placeholder='Password...' 
//           style={{ flex: 1, paddingVertical: 0}}
//             keyboardType='password'
//             secureTextEntry={hidePassword}
//              />
//           <TouchableOpacity>
//           {
//             hidePassword ? <Icons name='eye-off' size={20} onPress={() => setHidePassword(false)} /> : <Icons name='eye' size={20} onPress={() => setHidePassword(true)} />
//           }
//           </TouchableOpacity>
//           {/* <TouchableOpacity style={{ color: COLORS.white, fontWeight: 500 }}>
//             <Text>Forgot?</Text>
//           </TouchableOpacity> */}
//         </View>
//         <PrimaryButton title={"LOGIN"} onPress={() => navigation.navigate("HomeScreen")} />
//         <Text style={{textAlign: 'center', marginTop: 10, fontWeight: 'bold'}}>Or login by...</Text>
//         <View style={{justifyContent: 'center', alignItems: 'center', flexDirection:'row', marginVertical: 20}}>
//           <TouchableOpacity>
//             <Image source={require("../../assets/loginRegisterPage/Google.png")} style={style.methodLogin} />
//           </TouchableOpacity>
//           <TouchableOpacity>
//             <Image source={require("../../assets/loginRegisterPage/Github.png")} style={style.methodLogin} />
//           </TouchableOpacity>
//         </View>
//         <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10, alignItems: 'center'}}>
//           <Text>You don't have a account</Text>
//           <TouchableOpacity style={{marginLeft: 5}}>
//             <Text style={{fontSize: 16, fontWeight: 'bold', color:COLORS.primary}}
//                   onPress={() => navigation.navigate("RegisterScreen")}
//             >
//             Register</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//     </SafeAreaView>
//   )
// }

// const style = StyleSheet.create({
//   methodLogin: {
//     width: 50, height: 50, marginHorizontal: 20
//   }
// })

// export default LoginScreen

import React, { useState, useCallback } from "react";
import axios from "axios";
import jwtDecode from 'jwt-decode'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BaseURL } from "../../consts/BaseURL";
import {
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
} from "react-native";
import COLORS from "../../consts/colors";
import DropDownPicker from "react-native-dropdown-picker";
import { useForm, Controller } from 'react-hook-form';
import { PrimaryButton } from "../components/Button";
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon from 'react-native-vector-icons/MaterialIcons'

const LoginScreen = ({ navigation }) => {

  // MODAL VISIBLE : NOTIFICATION
  const [modalVisible, setModalVisible] = useState(false);

  // HIDE PASSWORD
  const [hidePassword, setHidePassword] = React.useState(true);

  // SUBMIT FUNCTION
  const { control, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = (data) => {

    var formdata = new FormData();
    formdata.append("phone", data.phone);
    formdata.append("password", data.password);

    axios.post(`${BaseURL}/auth/login`, formdata)
      .then(async (res) => {
        const userID = decoded(res.data.data.accessToken)

        await AsyncStorage.setItem("userId", userID);
        await AsyncStorage.setItem("userName", res.data.data.name);
        navigation.navigate('HomeScreen');
      })
      .catch((err) => {
        console.log("error respose: ", err)
        setModalVisible(!modalVisible);
      });
    
    console.log(data)

  }
  const decoded = (token) => {
    const decoded = jwtDecode(token);
    const decodeSub = parseInt(decoded.sub)
    const userID = Math.floor(decodeSub)
    const userIDFinal = userID.toString();
    return userIDFinal;
  }

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "flex-start" }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Notification</Text> 
              <Image source={require('../../assets/error.gif')} style={{width: 150, height: 150}} />
              <Text style={styles.modalText}>The phone or password is<Text style={{color: 'red'}}> incorrect</Text>
                  . Please enter again</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>OK</Text>
              </Pressable>
            </View>
          </View>
      </Modal>
      <View style={{ alignItems: 'center', marginTop: 70 }}>
        <Image source={require('../../assets/gearvnLogo.webp')} style={{ borderRadius: 50, height: 200, width: 200, transform: [{ rotate: '-5deg' }] }} />

      </View>
      <View style={styles.container}>
        <Text style={styles.label}>Phone</Text>
        <Controller
          name="phone"
          defaultValue={''}
          control={control}
          rules={{
            required: {
              value: true,
              message: 'The phone is required'
            },
          }}
          render={({ field: { value, onChange, onBlur } }) => (
            <View style={styles.input}>

              <TextInput
                style={{ fontSize: 18 }}
                selectionColor={"#5188E3"}
                onChangeText={onChange}
                value={value}
                onBlur={onBlur}
                focusable
                placeholder="Enter phone"
              />
            </View>
          )}
        />
        {errors.phone && <Text style={styles.textDanger}>{errors.phone.message}</Text>}
        <Text style={styles.label}>Password</Text>
        <Controller
          name="password"
          defaultValue={''}
          control={control}
          rules={{
            required: {
              value: true,
              message: 'The password is required'
            },
            minLength: {
              value: 8,
              message: 'The password > 8 characterss'
            },
            maxLength: {
              value: 16,
              message: 'The password < 16 characterss'
            },
          }}
          render={({ field: { value, onChange, onBlur } }) => (
            <View style={styles.inputPassword}>

              <TextInput
                style={{ fontSize: 18 }}
                selectionColor={"#5188E3"}
                onChangeText={onChange}
                value={value}
                onBlur={onBlur}
                secureTextEntry={hidePassword}
                focusable
                placeholder="Enter password"
              />
              <TouchableOpacity>
                {
                  hidePassword ?
                    <Icons name='eye-off' size={25} onPress={() => setHidePassword(false)} style={{ marginRight: 10 }} />
                    : <Icons name='eye' size={25} onPress={() => setHidePassword(true)} style={{ marginRight: 10 }} />
                }
              </TouchableOpacity>
            </View>
          )}
        />
        {errors.password && <Text style={styles.textDanger}>{errors.password.message}</Text>}
        <View style={{marginTop: 20}}>
          <PrimaryButton title={'Login'} onPress={handleSubmit(onSubmit)} />
        </View>
        <View style={{justifyContent: 'center',marginVertical: 25, alignItems: "center"}}>
          <Text style={{fontSize: 16}}>You don't have a account?
            <Text onPress={() => navigation.navigate("RegisterScreen")}  style={{fontSize: 16, color: COLORS.primary}}>Sign up
            
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  container: {
    marginHorizontal: 10,
    marginTop: 20,

  },
  input: {
    borderStyle: "solid",
    borderColor: "#B7B7B7",
    borderRadius: 7,
    borderWidth: 1,
    fontSize: 15,
    height: 50,
    paddingStart: 10,
    marginBottom: 15,
    justifyContent: "center"
  },
  inputPassword: {
    borderStyle: "solid",
    borderColor: "#B7B7B7",
    borderRadius: 7,
    borderWidth: 1,
    fontSize: 15,
    height: 50,
    paddingStart: 10,
    marginBottom: 15,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center"
  },
  inputRank: {
    borderStyle: "solid",
    borderColor: "#B7B7B7",
    borderRadius: 7,
    borderWidth: 1,
    fontSize: 15,
    height: 50,
    paddingStart: 10,
    // marginBottom: 15,
    lineHeight: 50,
    width: 200
  },
  inputApartmentNumber: {
    borderStyle: "solid",
    borderColor: "#B7B7B7",
    borderRadius: 7,
    borderWidth: 1,
    fontSize: 15,
    height: 50,
    paddingStart: 10,
    marginBottom: 15,
    width: 394
  },
  label: {
    marginBottom: 7,
    marginStart: 10,
    color: COLORS.dark,
    fontWeight: "bold",
  },
  labelApartmentNumber: {
    marginBottom: 7,
    marginStart: 10,
    color: COLORS.dark,
    marginTop: 250,

  },
  textDanger: {
    color: 'red',
    marginBottom: 10,
  },
  // rank customer
  rankModalContainer: {
    margin: 10,
  },
  rankTitle: {
    backgroundColor: COLORS.primary,
    height: 100,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: "center",
  },
  rankDescription: {
    alignItems: "center",
    marginTop: 20,
  },

  // MODAL VISIBLE NOTIFICATION
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,

  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: COLORS.primary,
    padding: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 20,
    width: 200,
    lineHeight: 30,
    fontWeight: "bold",
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 18,
    width: 200,
    lineHeight: 30,
  },
})
export default LoginScreen;

