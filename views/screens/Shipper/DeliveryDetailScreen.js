import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, StyleSheet, Image, Modal, Pressable, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import COLORS from '../../../consts/colors'
import { PrimaryButton, SecondaryButton } from '../../components/Button'
import axios from 'axios'
import { BaseURL } from '../../../consts/BaseURL'
import { TextInput } from 'react-native'

import * as ImagePicker from 'expo-image-picker'

const DeliveryDetailScreen = ({ navigation, route }) => {
    const item = route.params;
    console.log(item);
    const [loading, setLoading] = useState(false);

    const [paymentMethod, setPaymentMethod] = useState('');
    const [noteDelivery, setNoteDelivery] = useState('');
    const [productDelivery, setProductDelivery] = useState([]);

    const [modalPhotoVisible, setModalPhotoVisible] = useState(false);

    // IMAGE PICKER
    const [localUri, setLocalUri] = useState('');
    const [filename, setFilename] = useState('');
    const [type, setType] = useState('');
    const takePhoto = async () => {
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });
        if (result.canceled) {
            return;
        }
        // ImagePicker saves the taken photo to disk and returns a local URI to it
        let localUri = result.uri;
        setLocalUri(localUri);
        let filename = localUri.split('/').pop();
        setFilename(filename);
        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
        setType(type);

        setModalPhotoVisible(false);
    }
    const uploadImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });
        if (result.canceled) {
            return;
        }
        // ImagePicker saves the taken photo to disk and returns a local URI to it
        let localUri = result.uri;
        setLocalUri(localUri);
        let filename = localUri.split('/').pop();
        setFilename(filename);
        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
        setType(type);

        setModalPhotoVisible(false);
    }
    // END+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // UPDATE DELIVERY IMAGE:
    const updatePhotoDelivery = () => {
        
        var dataForm = new FormData();
        dataForm.append('addressId', '1');
        dataForm.append('orderId', item.orderId);
        dataForm.append('shipperId', item.shipperId);
        dataForm.append('orderStatus', 'Delivered');
        dataForm.append('image', { uri: localUri, name: filename, type } );

        axios.put(`${BaseURL}/api/v1/delivery?deliveryId=${item.id}`, dataForm, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
        })
            .then((res) => alert("Add photo success!"))
            .catch((err) => console.log(err))

    }

    // RECEIVED DELIVERY FUNCTION
    const receivedDelivery = (x) => {
        axios.put(`${BaseURL}/api/v1/order/updateStatus?orderId=${item.orderId}&orderStatus=${x}`)
            .then((res) => {
                console.log(res.data.message);
                navigation.navigate('DashboardShipper');
                navigation.navigate('TestScreen');
            })
            .catch((err) => console.log(err))
    }
    useEffect(() => {
        setLoading(true);

        axios.get(`${BaseURL}/api/v1/order/product?orderId=${item.orderId}`)
            .then((res) => setProductDelivery(res.data))
            .catch((err) => console.log("Product delivery err: ", err))
        axios.get(`${BaseURL}/api/v1/order/${item.orderId}`)
            .then((res) => {
                setPaymentMethod(res.data.paymentMethod);
                setNoteDelivery(res.data.note);
            })
            .catch((err) => console.log(err))
            .finally(() => setLoading(false))
    }, [])
    if(loading) {
        return (
            <SafeAreaView style={{justifyContent: 'center' , alignItems: 'center'}}>
                <Text>Loading...</Text>
            </SafeAreaView>
        )
    }
    return (
        <SafeAreaView>
            {/* MODAL photo */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalPhotoVisible}
                onRequestClose={() => {

                    setModalPhotoVisible(!modalPhotoVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={[styles.modalText, { fontWeight: "bold" }]}>Choose photo from</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 }}>
                            <TouchableOpacity style={{ padding: 5, borderRadius: 5, marginTop: 5, flexDirection: "row", alignItems: "center", justifyContent: "center" }}
                                onPress={() => takePhoto()}
                            >
                                <View><Icons name="camera" size={60} /></View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ padding: 5, borderRadius: 5, marginTop: 5, flexDirection: "row", alignItems: "center", justifyContent: "center" }}
                                onPress={() => uploadImage()}
                            >
                                <View><Icons name="camera-burst" size={60} /></View>

                            </TouchableOpacity>
                        </View>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalPhotoVisible(!modalPhotoVisible)}
                        >
                            <Text style={styles.textStyle}>OK</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <View style={styles.header}>
                <Icon name='arrow-back-ios' size={28} onPress={navigation.goBack} />
                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Delivery detail</Text>
            </View>
            <ScrollView
                style={{ height: '100%' }}
            >
                <View style={{ marginHorizontal: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Product list</Text>
                    {
                        productDelivery.map((item) => (
                            <View
                                style={{
                                    backgroundColor: COLORS.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 100,
                                    borderRadius: 10, marginVertical: 5
                                }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                                    <Image source={{ uri: item.productImage.slice(0, -1) }}
                                        style={{ width: 70, height: 70 }}
                                    />
                                    <Text style={{ fontWeight: 'bold', width: 200, marginLeft: 5 }}>{item.productName}</Text>
                                </View>
                                <View style={{ marginRight: 20, alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 20, marginVertical: 5 }}>{item.discountPrice}</Text>
                                    <Text style={{ marginVertical: 5 }}>x{item.amount}</Text>
                                </View>
                            </View>
                        ))
                    }
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10, marginBottom: 10 }}>Customer information</Text>
                    <Text style={{ fontSize: 16 }}>{'Name: ' + item.userName + "   " + 'Phone: ' + item.userPhone}</Text>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>Address Delivery</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.light, paddingVertical: 10, borderRadius: 10 }}>
                        <Icon name='location-on' size={25} />
                        <View style={{ marginLeft: 10, width: 280 }}>
                            <Text style={{ fontSize: 16 }}>
                                {item.deliveryApartmentNumber}
                            </Text>
                            <Text style={{ fontSize: 16 }}>
                                {item.deliveryWard[0] === '{' ? (JSON.parse(item.deliveryWard))?.ward_name : item.deliveryWard}
                                , {item.deliveryDistrict[0] === '{' ? (JSON.parse(item.deliveryDistrict))?.district_name : item.deliveryDistrict}
                                , {item.deliveryProvince}
                            </Text>
                        </View>
                        {
                            paymentMethod === 'VNPAY' &&
                            <Image source={require('../../../assets/paidLogo.png')} style={{ width: 60, height: 60 }} />
                        }
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Note</Text>
                        <TextInput
                            editable={false}
                            multiline
                            numberOfLines={3}
                            value={noteDelivery}
                            style={{ backgroundColor: COLORS.light, fontSize: 16, padding: 10, height: 60, width: 300, borderRadius: 10, marginLeft: 10 }}
                        />
                    </View>

                    <View style={{ borderTopColor: COLORS.dark, borderTopWidth: 1, marginTop: 30, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Price</Text>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', textDecorationLine: paymentMethod === 'VNPAY' ? 'line-through' : 'none' }}>{item.totalPrice}$</Text>

                    </View>
                    {
                        paymentMethod === 'VNPAY' &&
                        <View style={{ marginTop: 0, flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 10 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#df2020' }}>0$</Text>

                        </View>
                    }

                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: 20}}>
                    <View>
                        <TouchableOpacity onPress={() => setModalPhotoVisible(true)}>
                            <View style={styles.addPhoto_btn}>
                                <Icon name='add-photo-alternate' size={20} color={COLORS.primary} />
                                <Text style={{ fontSize: 20, color: COLORS.primary }}>Add photo</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => updatePhotoDelivery()}>
                            <View style={styles.addPhoto_btn}>
                                <Text style={{ fontSize: 20, color: COLORS.primary }}>Save</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Image
                        source={{ uri: localUri ? localUri : 
                            item.image === null ? 'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg' : item.image.slice(0,-1) }}
                        style={{ height: 150, width: 150, marginLeft: 30, borderRadius: 20 }}
                    />
                </View>
                <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-around',marginBottom: 100  }}>
                    {
                        buttonItems.map((item) => (
                            <TouchableOpacity
                                onPress={() => receivedDelivery(item.title)}
                            >
                                <View
                                    style={{ backgroundColor: item.backgroundColor, height: 50, width: 80, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}
                                >
                                    <Icons color={item.color} size={30} name={item.icon} />
                                </View>
                            </TouchableOpacity>
                        ))
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
const buttonItems = [
    { id: 1, title: 'Delivering', backgroundColor: '#259fff', color: 'white', icon: 'truck-fast-outline' },
    { id: 2, title: 'Delivered', backgroundColor: '#00a86b', color: 'white', icon: 'truck-check' },
    { id: 3, title: 'Cancel', backgroundColor: COLORS.secondary, color: '#df2020', icon: 'truck-remove' },
]
const styles = StyleSheet.create({
    header: {
        paddingVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
    },
    addPhoto_btn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20,

    },
    // MODAL CSS
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

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

export default DeliveryDetailScreen
