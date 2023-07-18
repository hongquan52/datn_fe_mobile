import React, { useState, useCallback } from "react";
import axios from "axios";
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

const RegisterScreen = ({ navigation }) => {

  // MODAL VISIBLE : NOTIFICATION
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleSignUp, setModalVisibleSignUp] = useState(false);

  // HIDE PASSWORD
  const [hidePassword, setHidePassword] = React.useState(true);

  // GENDER DROPDOWN PICKER
  const [genderOpen, setGenderOpen] = useState(false);
  const [genderValue, setGenderValue] = useState(null);
  const [gender, setGender] = useState([
    { label: "Male", value: true },
    { label: "Female", value: false},
  ]);
  // SET OPEN GENDER
  // code after when has another dropdown picker



  // SUBMIT FUNCTION
  const { control, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = (data) => {
    if(data.password != data.confirmPassword) {
      setModalVisible(true);
    }
    else {
      console.log(data);
      console.log("gender: ", data.gender, typeof(data.gender));

      var dataForm = new FormData();
      dataForm.append('name', data.name);
      dataForm.append('email', data.email);
      dataForm.append('gender', data.gender);
      dataForm.append('phone', data.phone);
      dataForm.append('password', data.password);
      dataForm.append('status', '1');
      dataForm.append('role', '2');

      axios.post(`${BaseURL}/api/v1/user`, dataForm)
        .then((res) => {
          
          setModalVisibleSignUp(true);
          alert("Please check your email to verify account!")
        })
        .catch((err) => {
          console.log("Error sign up response: ", err);
        })
    }
    

  }
  
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "flex-start" }}>
      {/* DOES'T MATCH PASSWORD */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Thông báo</Text> 
              <Image source={require('../../assets/error.gif')} style={{width: 150, height: 150}} />
              <Text style={styles.modalText}>Mật khẩu không trùng khớp</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Đồng ý</Text>
              </Pressable>
            </View>
          </View>
      </Modal>
      {/* SIGN UP SUCCESSFULLY */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleSignUp}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Notification</Text> 
              <Image source={require('../../assets/succesfully.gif')} style={{width: 150, height: 150}} />
              <Text style={styles.modalText}>Sign up succesfully</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisibleSignUp(!modalVisibleSignUp)}
              >
                <Text style={styles.textStyle}>OK</Text>
              </Pressable>
            </View>
          </View>
      </Modal>
      <View style={{ alignItems: 'center', marginTop: 10 }}>
        <Image source={require('../../assets/gearvnLogo.webp')} style={{ borderRadius: 50, height: 100, width: 100, transform: [{ rotate: '-5deg' }] }} />
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
                keyboardType='phone-pad'
              />
            </View>
          )}
        />
        {errors.phone && <Text style={styles.textDanger}>{errors.phone.message}</Text>}
        <View>
          <Text style={styles.label}>Name</Text>
          <Controller
            name="name"
            defaultValue={''}
            control={control}
            rules={{
              required: {
                value: true,
                message: 'The name is required'
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
                  placeholder="Enter name"
                />
              </View>
            )}
          />
          {errors.name && <Text style={styles.textDanger}>{errors.name.message}</Text>}
          <Text style={styles.label}>Email</Text>
          <Controller
            name="email"
            defaultValue={''}
            control={control}
            rules={{
              required: {
                value: true,
                message: 'The email is required'
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
                  placeholder="Enter email"
                />
              </View>
            )}
          />
          {errors.email && <Text style={styles.textDanger}>{errors.email.message}</Text>}
          
          <View style={{position: "absolute", zIndex: 3, top: 170}}>
            <Text style={[styles.label]}>Gender</Text>
            <Controller
                  name="gender"
                  defaultValue=""
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <View style={{width: 150}}>
                      <DropDownPicker
                        
                        open={genderOpen}
                        value={genderValue}
                        items={gender}
                        setOpen={setGenderOpen}
                        setValue={setGenderValue}
                        setItems={setGender}
                        placeholder="Choose gender"
                        placeholderStyle={styles.placeholderStyles}
                        // onOpen={onprovinceOpen}
                        onChangeValue={onChange}
                        
                      />
                    </View>
                  )}
            />
          </View>
          <Text style={[styles.label, {marginTop: 80}]}>Password</Text>
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
            <Text style={styles.label}>Confirm Password</Text>
            <Controller
              name="confirmPassword"
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
                    placeholder="Enter confirm password"
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
        </View>
        
        <View style={{marginTop: 20}}>
          <PrimaryButton title={'Sign up'} onPress={handleSubmit(onSubmit)} />
        </View>
        <View style={{justifyContent: 'center',marginVertical: 25, alignItems: "center"}}>
          <Text style={{fontSize: 16}}>You have already account?
            <Text onPress={() => navigation.navigate("LoginScreen")}  style={{fontSize: 16, color: COLORS.primary}}>Sign in now
            
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginTop: 0,

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
export default RegisterScreen;

