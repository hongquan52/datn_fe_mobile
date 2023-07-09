import React, { useState, useCallback } from "react";
import axios from "axios";
import { BaseURL } from "../../consts/BaseURL";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  Pressable,
} from "react-native";
import COLORS from "../../consts/colors";
import { useForm, Controller } from 'react-hook-form';
import { PrimaryButton } from "../components/Button";
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'

const NewPasswordScreen = ({navigation, route}) => {
  const item = route.params;
  // MODAL VISIBLE DUPLICATE PASSWORD
  const [modalVisible, setModalVisible] = React.useState(false);
  // HIDE PASSWORD
  const [hidePassword, setHidePassword] = React.useState(true);

  // SUBMIT FUNCTION
  const { control, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = async (data) => {
    
    if(data.password != data.passwordAgain) {
        console.log('Your password not match!');
        setModalVisible(true);
    }
    else {
       
        var formdata = new FormData();

        formdata.append('newPassword', data.password);
        formdata.append('confirmPassword', data.passwordAgain);

        axios.put(`${BaseURL}/api/v1/user/${item}/password`, formdata)
            .then((res) => {
                alert("Your password is change success");
                navigation.navigate("LoginScreen");
            })
            .catch((err) => {
                console.log("Errors response: ", err);
            })
    }
  }
  return (
    <SafeAreaView style={{flex: 1, justifyContent: "flex-start"}}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Notification</Text> 
              <Image source={require('../../assets/error.gif')} style={{width: 150, height: 150}} />
              <Text style={styles.modalText}>The password does't match with confirm password</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>OK</Text>
              </Pressable>
            </View>
          </View>
      </Modal>
      <View style={styles.container}>  
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
              style={{fontSize: 18}}
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
                <Icons name='eye-off' size={25} onPress={() => setHidePassword(false)} style={{marginRight: 10}} /> 
                : <Icons name='eye' size={25} onPress={() => setHidePassword(true)} style={{marginRight: 10}} />
              }
            </TouchableOpacity>
          </View>
          )}
        />
        {errors.password && <Text style={styles.textDanger}>{errors.password.message}</Text>}
        <Text style={styles.label}>Password again</Text>
        <Controller
          name="passwordAgain"
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
              style={{fontSize: 18}}
              selectionColor={"#5188E3"}
              onChangeText={onChange} 
              value={value}
              onBlur={onBlur}
              secureTextEntry={hidePassword}
              focusable
              placeholder="Enter password again"
            />
            <TouchableOpacity>
              {
                hidePassword ? 
                <Icons name='eye-off' size={25} onPress={() => setHidePassword(false)} style={{marginRight: 10}} /> 
                : <Icons name='eye' size={25} onPress={() => setHidePassword(true)} style={{marginRight: 10}} />
              }
            </TouchableOpacity>
          </View>
          )}
        />
        {errors.passwordAgain && <Text style={styles.textDanger}>{errors.passwordAgain.message}</Text>}
        <View style={{marginTop: 50}}>
            <PrimaryButton title={'Save password'} onPress={handleSubmit(onSubmit)} />
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
    marginTop: 100,

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
export default NewPasswordScreen;

