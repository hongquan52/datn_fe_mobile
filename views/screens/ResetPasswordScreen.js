import React, { useState, useCallback } from "react";
import jwtDecode from "jwt-decode";
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

import { useForm, Controller } from 'react-hook-form';
import { PrimaryButton, SecondaryButton } from "../components/Button";
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon from 'react-native-vector-icons/MaterialIcons'

const ResetPasswordScreen = ({ navigation }) => {
    // MODAL VISIBLE : NOTIFICATION
    const [modalVisible, setModalVisible] = useState(false);
    // SUBMIT FUNCTION
    const { control, handleSubmit, formState: { errors } } = useForm();
    const nextStep = (data) => {
        var formdata = new FormData();
        formdata.append("phone", data.phone);
        formdata.append("password", data.verifyCode);

        axios.post(`${BaseURL}/auth/login`, formdata)
            .then((res) => {
                if (res.data.status === 'UNAUTHORIZED') {
                    alert("Verify code is incorrect! Please enter again");
                }
                else {
                    let xyz = decoded(res.data.data.accessToken);
                    navigation.navigate('NewPasswordScreen', xyz);
                }
            })
            .catch((err) => {
                alert('Login failed')
                console.log('LOgin errror: ', err);
            })
    }
    const decoded = (token) => {
        const decoded = jwtDecode(token);
        const manguoidung = decoded.sub
        const manguoidung1 = parseInt(manguoidung);
        return manguoidung1;
      }

    const getVerifyCode = (data) => {

        axios.get(`${BaseURL}/api/v1/user/password/send-mail?email=${data.email}`)
            .then((res) => {
                if (res.data.status === 'BAD_REQUEST') {
                    alert(res.data.message);
                }
                else {
                    alert('Please check your email to get verify code!!')
                }
            })
            .catch((err) => console.log(err))
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
                        <Image source={require('../../assets/error.gif')} style={{ width: 150, height: 150 }} />
                        <Text style={styles.modalText}>The phone or password is<Text style={{ color: 'red' }}> incorrect</Text>
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
                <Text>Reset password</Text>
            </View>
            <View style={styles.container}>
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
                        <View style={styles.inputPassword}>

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
                <Text style={styles.label}>Verify conde</Text>
                <Controller
                    name="verifyCode"
                    defaultValue={''}
                    control={control}

                    render={({ field: { value, onChange, onBlur } }) => (
                        <View style={styles.inputPassword}>

                            <TextInput
                                style={{ fontSize: 18 }}
                                selectionColor={"#5188E3"}
                                onChangeText={onChange}
                                value={value}
                                onBlur={onBlur}

                                focusable
                                placeholder="Enter verify code"
                            />

                        </View>
                    )}
                />
                <View style={{ justifyContent: "flex-end", flexDirection: "row", marginRight: 10 }}>
                    <TouchableOpacity onPress={handleSubmit(getVerifyCode)} >
                        <Text style={{ fontSize: 16, color: COLORS.primary }}>Get verify code</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 20 }}>
                    <PrimaryButton title={'Login'} onPress={handleSubmit(nextStep)} />

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
export default ResetPasswordScreen;

