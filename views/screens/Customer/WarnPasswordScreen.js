import React, {useState} from "react";
import COLORS from "../../../consts/colors";
import Icon from 'react-native-vector-icons/FontAwesome5'
import Icons from 'react-native-vector-icons/MaterialIcons'
import { Text, View, SafeAreaView, StyleSheet, TextInput, Modal, Pressable, Image } from 'react-native'
import { Controller, useForm } from "react-hook-form";
import { PrimaryButton } from "../../components/Button";
import axios from "axios";
import { BaseURL } from "../../../consts/BaseURL";
const WarnPasswordScreen = ({navigation, route}) => {
    // get PHONE by route
    const phoneNumber = route.params;
    // MODAL
    const [modalVisible, setModalVisible] = useState(false);

    // submit handle
    const { control, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = (data) => {
        console.log("data: ", data);
        console.log("Phone number: ", phoneNumber);

        var formdata = new FormData();
        formdata.append("phone", phoneNumber);
        formdata.append("password", data.password);

        axios.post(`${BaseURL}/auth/login`, formdata )
            .then((res) => {
                // console.log("Response message: ", res.data.message);
                if (res.data.status==="OK") {
                    navigation.navigate('ChangePasswordScreen');
                }
                else {
                    console.log("Response message: ", res.data.status);
                    setModalVisible(!modalVisible);
                }
            })
            .catch((err) => {
                console.log("error respose: ",err)
            })


    }
    return (
        <SafeAreaView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible(!modalVisible);
                }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={[styles.modalText, {fontWeight: "bold"}]}>Notification</Text>
                            <Text style={styles.modalText}>The password is incorrect. Please enter again</Text>
                            <Image source={require('../../../assets/error.gif')} style={{width: 150, height: 150}} />
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Text style={styles.textStyle}>OK</Text>
                            </Pressable>
                        </View>
                    </View>
            </Modal>
            <View style={styles.header}>
                <Icons name='arrow-back-ios' size={28} onPress={navigation.goBack} />
                <Text style={{fontWeight: 'bold'}}>Verify password</Text>
            </View>
            <View style={{ justifyContent: "center", alignItems: "center", marginTop: 100, marginHorizontal: 10 }}>
                <Icon size={70} name="exclamation-triangle" style={{marginBottom: 50, color: COLORS.primary}} />
                <Text style={{fontSize: 20}}>Để tăng cường bảo mật cho tài khoản của bạn, hãy xác minh thông tin bằng một trong những cách sau.</Text>
                
                <Controller
                    name="password"
                    defaultValue={""}
                    control={control}
                    rules={{
                        required: {
                            value: true,
                            message: 'Password is required'
                        },
                        minLength: {
                            value: 6,
                            message: 'Password must > 6 characters'
                        }
                    }}
                    render={({ field: { value, onChange, onBlur } }) => (
                        <View style={styles.inputContainer}>
                            <Icon name="lock" size={28} style={{color: COLORS.dark, marginRight: 10}} />
                            <TextInput
                                style={{ flex: 1, fontSize: 18 }}
                                placeholder="Enter your password"
                                secureTextEntry={true}
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                            />
                        </View>
                    )}
                />
                {errors.password && <Text style={{color: 'red'}}>{errors.password.message}</Text>}
            </View>
            <View style={{marginHorizontal: 10, marginTop: 30}}>
                <PrimaryButton title={'Continue'} onPress={handleSubmit(onSubmit)} />
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
    inputContainer: {
        height: 50,
        borderRadius: 10,
        flexDirection: 'row',
        backgroundColor: COLORS.light,
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
        marginTop: 50,
    },
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
      modalText: {
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 18,
        width: 200,
        lineHeight: 30,
      },
})

export default WarnPasswordScreen;