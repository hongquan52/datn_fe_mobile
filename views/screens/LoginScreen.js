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
import { PrimaryButton, SecondaryButton } from "../components/Button";
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
        const userID = decoded(res.data.data.accessToken);
        const roleID = getRoleID(res.data.data.accessToken);
        
        await AsyncStorage.setItem("userId", userID);
        await AsyncStorage.setItem("userName", res.data.data.name);

        if(roleID === 3) {
          navigation.navigate("DashboardShipper");
        }
        else if(roleID === 2) {
          navigation.navigate('HomeScreen');
        }
      })
      .catch((err) => {
        console.log("error respose: ", err)
        setModalVisible(!modalVisible);
      });
    
    // console.log(data)

  }
  const decoded = (token) => {
    const decoded = jwtDecode(token);
    const decodeSub = parseInt(decoded.sub)
    const userID = Math.floor(decodeSub)
    const userIDFinal = userID.toString();
    return userIDFinal;
  }
  const getRoleID = (token) => {
    const decoded = jwtDecode(token);
    const roleID = decoded.sub[decoded.sub.length - 1];
    const roleID2 = parseInt(roleID);
    return roleID2;
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
        <View style={{justifyContent: "flex-end", flexDirection: "row", marginRight: 10}}>
          <TouchableOpacity onPress={() => navigation.navigate("ResetPasswordScreen")}>
            <Text style={{fontSize: 16, color: COLORS.primary}}>Reset password</Text>
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 20}}>
          <PrimaryButton title={'Login'} onPress={handleSubmit(onSubmit)} />
          <TouchableOpacity onPress={() => Linking.openURL(`https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?response_type=code&client_id=871514274935-q9ocgbeo023sid5ac22e4qld2muu8rad.apps.googleusercontent.com&scope=openid%20profile%20email&state=fT6tHRASkWSvhtmKk6NsAy_gNShkzkN3le0OLb9Cl1U%3D&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Flogin%2Foauth2%2Fcode%2Fgoogle&nonce=0zIQZc4E2v6V57eZ9G95JonpIKQNDbklGO2A6_prSR0&service=lso&o2v=2&flowName=GeneralOAuthFlow`)}>
            <View style={{backgroundColor: 'white', height: 60,borderRadius: 30, flexDirection: 'row',
                  justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
              <Image source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png'}}
                  style={{width: 100, height: 30, position : 'absolute', top: 'auto', right: 'auto', zIndex: 10}}
                />
            </View>
          </TouchableOpacity>
          
        </View>
        <View style={{justifyContent: 'center',marginVertical: 25, alignItems: "center"}}>
          <Text style={{fontSize: 16}}>You don't have a account?
            <Text onPress={() => navigation.navigate("RegisterScreen") }  style={{fontSize: 16, color: COLORS.primary}}>Sign up
            
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

