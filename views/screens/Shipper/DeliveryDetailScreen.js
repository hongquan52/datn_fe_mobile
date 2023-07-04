import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, StyleSheet, Image, Modal, Pressable, TouchableOpacity } from 'react-native'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import COLORS from '../../../consts/colors'
import { PrimaryButton, SecondaryButton } from '../../components/Button'
import axios from 'axios'
import { BaseURL } from '../../../consts/BaseURL'
import { TextInput } from 'react-native'
import { Button } from 'react-native'

const DeliveryDetailScreen = ({ navigation, route }) => {
    const item = route.params;
    console.log("Delivery data: ", item)
    const [paymentMethod, setPaymentMethod] = useState('');
    const [noteDelivery, setNoteDelivery] = useState('');
    const [productDelivery, setProductDelivery] = useState([]);
    // RECEIVED DELIVERY FUNCTION
    const receivedDelivery = (x) => {
        var data = new FormData();
        data.append('orderId', item.orderId);
        data.append('orderStatus', x);

        axios.put(`${BaseURL}/api/v1/delivery?deliveryId=${item.id}`, data)
            .then((res) => {
                console.log(res.data.message);
                
            })
            .catch((err) => console.log(err))
    }
    useEffect(() => {
        axios.get(`${BaseURL}/api/v1/order/product?orderId=${item.orderId}`)
            .then((res) => setProductDelivery(res.data))
            .catch((err) => console.log("Product delivery err: ", err))
        axios.get(`${BaseURL}/api/v1/order/${item.orderId}`)
            .then((res) => {
                setPaymentMethod(res.data.paymentMethod);
                setNoteDelivery(res.data.note);
            })
            .catch((err) => console.log(err))
    }, [])
    return (
        <SafeAreaView>
            <View style={styles.header}>
                <Icon name='arrow-back-ios' size={28} onPress={navigation.goBack} />
                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Delivery detail</Text>
            </View>
            <ScrollView
                style={{height: '100%'}}
            >
                <View style={{marginHorizontal: 10}}>
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>Product list</Text>
                    {
                        productDelivery.map((item) => (
                            <View
                                style={{backgroundColor: COLORS.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 100,
                                borderRadius: 10, marginVertical: 5}}
                            >
                                <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 10}}>
                                    <Image source={{uri: item.productImage.slice(0, -1)}}
                                        style={{width: 70 , height: 70}}
                                    />
                                    <Text style={{fontWeight: 'bold', width: 200, marginLeft: 5}}>{item.productName}</Text>
                                </View>
                                <View style={{marginRight: 20, alignItems: 'center'}}>
                                    <Text style={{fontWeight: 'bold', fontSize: 20, marginVertical: 5}}>{item.discountPrice}</Text>
                                    <Text style={{marginVertical: 5}}>x{item.amount}</Text>
                                </View>
                            </View>
                        ))
                    }
                    <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 10, marginBottom: 10}}>Customer information</Text>
                    <Text style={{fontSize: 16}}>{'Name: '+item.userName+"   "+'Phone: '+item.userPhone}</Text>
                    <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 10}}>Address Delivery</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.light, paddingVertical: 10, borderRadius: 10}}>
                        <Icon name='location-on' size={25} />
                        <View style={{marginLeft: 10, width: 280}}> 
                            <Text style={{fontSize: 16}}>
                            {item.deliveryApartmentNumber}
                            </Text>
                            <Text style={{fontSize: 16}}>
                            {item.deliveryWard+', '+item.deliveryDistrict+', '+item.deliveryProvince}
                            </Text>
                        </View>
                        {
                            paymentMethod === 'VNPAY' &&
                            <Image source={require('../../../assets/paidLogo.png')} style={{width: 60, height: 60}} />
                        }
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
                        <Text style={{fontSize: 18, fontWeight: 'bold'}}>Note</Text>
                        <TextInput
                            editable={false}
                            multiline
                            numberOfLines={3}
                            value={noteDelivery}
                            style={{backgroundColor: COLORS.light,fontSize: 16, padding: 10, height: 60, width: 300, borderRadius: 10, marginLeft: 10}}
                        />
                    </View>
                    
                    <View style={{borderTopColor: COLORS.dark, borderTopWidth: 1, marginTop: 30, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Price</Text>
                        <Text style={{fontSize: 20, fontWeight: 'bold',textDecorationLine:paymentMethod === 'VNPAY' ? 'line-through' : 'none'}}>{item.totalPrice}$</Text>
                        
                    </View>
                    {
                        paymentMethod === 'VNPAY' &&
                        <View style={{marginTop: 0, flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 10}}>
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: '#df2020'}}>0$</Text>

                        </View>
                    }
                    
                </View>
                <View style={{marginTop: 50, flexDirection: 'row', justifyContent: 'space-around'}}>
                    {
                        buttonItems.map((item) => (
                            <TouchableOpacity
                                onPress={() => receivedDelivery(item.title)}
                            >
                                <View
                                    style={{backgroundColor: COLORS.primary, height: 50, width: 80, justifyContent: 'center', alignItems: 'center', borderRadius: 10}}
                                >
                                    {/* <Icons name='delete-restore' size={40} color={COLORS.white} /> */}
                                    <Text style={{fontSize: 18, color: 'white', fontWeight: 500}}>{item.title}</Text>
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
    {id: 1, title: 'Delivering', backgroundColor: 'blue', color: 'white'},
    {id: 2, title: 'Delivered', backgroundColor: 'green', color: 'white'},
    {id: 3, title: 'Cancel', backgroundColor: 'red', color: 'white'},
]
const styles = StyleSheet.create({
    header: {
        paddingVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
    }
})

export default DeliveryDetailScreen
