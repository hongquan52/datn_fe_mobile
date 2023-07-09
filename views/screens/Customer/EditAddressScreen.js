import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { SafeAreaView, StyleSheet } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import COLORS from '../../../consts/colors'
import { PrimaryButton, SecondaryButton } from '../../components/Button'

import DropDownPicker from "react-native-dropdown-picker";
import { Controller, useForm } from 'react-hook-form'
import axios from 'axios'
import { BaseURL } from '../../../consts/BaseURL'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect } from 'react'

const EditAddressScreen = ({ navigation, route }) => {
    
    const [userID, setUserID] = useState(0);
    const item = route.params;
    // SUBMIT FUNCTION
    const { handleSubmit, control } = useForm();

    useEffect( async () => {
        const userID = await AsyncStorage.getItem("userId");

        const userID2 = parseInt(userID);
        
        setUserID(userID2);
    }, [])

    const onSubmit = (data) => {

        var datas = new FormData();

        datas.append('apartmentNumber', item.address.apartmentNumber);
        datas.append('ward', item.address.ward);
        datas.append('district', item.address.district);
        datas.append('province', item.address.province);
        datas.append('defaultAddress', defaultAddressValue);

        axios.put(`${BaseURL}/api/v1/address/user?userId=${userID}&addressId=${item.address.id}`, datas)
            .then((res) => console.log(res.data.message))
            .catch((err) => console.log("Error edit address: ", err))

        navigation.navigate('HomeScreen')
        navigation.navigate('AddressScreen')
    };

    // DISTRICT
    const [defaultAddressOpen, setDefaultAddressOpen] = useState(false);
    const [defaultAddressValue, setDefaultAddressValue] = useState(item.defaultAddress);
    const [defaultAddress, setDefaultAddress] = useState([
        { label: "YES", value: true },
        { label: "NO", value: false },

    ]);

    return (
        <SafeAreaView>
            <View style={styles.header}>
                <Icon name='arrow-back-ios' size={28} onPress={navigation.goBack} />
                <Text style={{ fontWeight: 'bold' }}>Edit Address</Text>
            </View>
            <View style={{ marginHorizontal: 20 }}>

                <View style={styles.formContainer}>

                    <View style={styles.inputContainer}>
                        <Text style={{
                            fontSize: 20,
                            marginBottom: 10,
                            // fontWeight: 'bold',
                            // color: COLORS.primary
                        }}>Apartment number</Text>
                        <View style={{
                            backgroundColor: COLORS.white, borderRadius: 5, height: 40, justifyContent: 'flex-start', borderColor: COLORS.dark,
                            borderWidth: 0.4, flexDirection: 'row', alignItems: 'center'
                        }}>
                            <Icon name='house' size={25} style={{ marginLeft: 5, opacity: 0.8 }} />
                            <TextInput style={{
                                marginLeft: 5,
                                height: 30,
                                fontSize: 20,
                                color: COLORS.dark,
                            }}
                                placeholder='Example: 12/2, street 5'
                                defaultValue={item.address.apartmentNumber}


                            />
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={{
                            fontSize: 20,
                            marginBottom: 10,
                            // fontWeight: 'bold',
                            // color: COLORS.primary
                        }}>Ward</Text>
                        <View style={{
                            backgroundColor: COLORS.white, borderRadius: 5, height: 40, justifyContent: 'flex-start', borderColor: COLORS.dark,
                            borderWidth: 0.4, flexDirection: 'row', alignItems: 'center'
                        }}>
                            <Icons name='town-hall' size={25} style={{ marginLeft: 5, opacity: 0.8 }} />
                            <TextInput style={{
                                marginLeft: 5,
                                height: 30,
                                fontSize: 20,
                                color: COLORS.dark,
                            }}
                                placeholder='Example: Linh Chiểu'
                                defaultValue={JSON.parse(item.address.ward).ward_name}
                            />
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={{
                            fontSize: 20,
                            marginBottom: 10,
                            // fontWeight: 'bold',
                            // color: COLORS.primary
                        }}>District</Text>
                        <View style={{
                            backgroundColor: COLORS.white, borderRadius: 5, height: 40, justifyContent: 'flex-start', borderColor: COLORS.dark,
                            borderWidth: 0.4, flexDirection: 'row', alignItems: 'center'
                        }}>
                            <Icons name='home-city' size={25} style={{ marginLeft: 5, opacity: 0.8 }} />
                            <TextInput style={{
                                marginLeft: 5,
                                height: 30,
                                fontSize: 20,
                                color: COLORS.dark,
                            }}
                                placeholder='Example: Thủ Đức'
                                defaultValue={JSON.parse(item.address.district).district_name}

                            />
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={{
                            fontSize: 20,
                            marginBottom: 10,
                            // fontWeight: 'bold',
                            // color: COLORS.primary
                        }}>Province</Text>
                        <View style={{
                            backgroundColor: COLORS.white, borderRadius: 5, height: 40, justifyContent: 'flex-start', borderColor: COLORS.dark,
                            borderWidth: 0.4, flexDirection: 'row', alignItems: 'center'
                        }}>
                            <Icon name='location-city' size={25} style={{ marginLeft: 5, opacity: 0.8 }} />
                            <TextInput style={{
                                marginLeft: 5,
                                height: 30,
                                fontSize: 20,
                                color: COLORS.dark,
                            }}
                                placeholder='Example: Hồ Chí Minh city'
                                defaultValue={item.address.province}

                            />
                        </View>
                    </View>
                    <Text style={{
                        fontSize: 20,
                        marginBottom: 10,
                    }}>Default Address</Text>
                    <Controller
                        name="defaultAddress"
                        defaultValue={item.defaultAddress}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <View>
                                <DropDownPicker
                                    open={defaultAddressOpen}
                                    value={defaultAddressValue}
                                    items={defaultAddress}
                                    setOpen={setDefaultAddressOpen}
                                    setValue={setDefaultAddressValue}
                                    setItems={setDefaultAddress}

                                    placeholder="Choose type address"
                                    onChangeValue={onChange}

                                />
                            </View>
                        )}
                    />

                </View>
                <View style={{ marginVertical: 10, marginTop: 100 }}>
                    <SecondaryButton title={"Delete address"} style={{ marginVertical: 10 }} />
                </View>
                <View style={{ marginVertical: 10 }}>

                    <PrimaryButton title={"Save"} style={{ marginVertical: 10 }} onPress={handleSubmit(onSubmit)} />
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
    formContainer: {
        marginTop: 0,
    },
    inputContainer: {
        marginVertical: 20,

    },
    inputContainer1: {
        flex: 1,
        height: 50,
        borderRadius: 10,
        flexDirection: 'row',
        backgroundColor: COLORS.dark,
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    }
})

export default EditAddressScreen;
