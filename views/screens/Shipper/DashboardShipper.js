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
import { useNavigation } from '@react-navigation/native'
const DashboardShipper = () => {
    const navigation = useNavigation();
    const shipperID = 6;
    const [orderShipper, setOrderShipper] = useState([]);
    const [recentDelivery, setRecentDelivery] = useState([]);
    const [shipperData, setShipperData] = useState();
    const [linkAvatar, setLinkAvatar] = useState('');
    // GET ORDER BY SHIPPER ID
    useEffect(() => {
        axios.get(`${BaseURL}/api/v1/delivery/shipper?shipperId=${shipperID}`)
            .then((res) => {
                setOrderShipper(res.data);
                // RECENT DELIVERY
                let x = res.data.filter(
                    (item) => item.status === 'Wait_Delivering'
                )
                setRecentDelivery(x);
            })
            .catch((err) => console.log(err))
        axios.get(`${BaseURL}/api/v1/user/${2}`)
            .then((res) => {
                setShipperData(res.data);
                axios.get(`${BaseURL}/api/v1/user/image?filename=${res.data.image}`)
                    .then((res) => setLinkAvatar(res.data))
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    }, [])
    
    // REVENUE ORDER OF SHIPPER
    const revenueSuccess = orderShipper.filter((item) => item.status==='Done').reduce((acc, cur) => {
        return acc + cur.totalPrice
    }, 0)
    const revenueProcessing = orderShipper.filter((item) => item.status!=='Done'&& item.status!=='Cancel').reduce((acc, cur) => {
        return acc + cur.totalPrice
    }, 0)
    const revenueCancel = orderShipper.filter((item) => item.status==='Cancel').reduce((acc, cur) => {
        return acc + cur.totalPrice
    }, 0)
    // TOTAL ORDER BY STATUS:
    const amountDone = orderShipper.filter((item) => item.status==='Done').reduce((acc, cur) => {
        return acc+1
    }, 0)
    const amountWait_Delivering = orderShipper.filter((item) => item.status==='Wait_Delivering').reduce((acc, cur) => {
        return acc+1
    }, 0)
    const amountDelivering = orderShipper.filter((item) => item.status==='Delivering').reduce((acc, cur) => {
        return acc+1
    }, 0)
    const amountDelivered = orderShipper.filter((item) => item.status==='Delivered').reduce((acc, cur) => {
        return acc+1
    }, 0)
    const amountCancel = orderShipper.filter((item) => item.status==='Cancel').reduce((acc, cur) => {
        return acc+1
    }, 0)


    return (
        <SafeAreaView>
            <View style={styles.header}>
                <Image source={{uri: linkAvatar.slice(0,-1)}} style={styles.headerAvatar} />

                <View>
                    <Text style={{ fontSize: 22, marginLeft: 10 }}>Hello shipper,</Text>
                    <Text style={styles.headerName}>{shipperData?.name}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate("TestScreen")}
                >
                    <View style={{
                        backgroundColor: COLORS.light, padding: 10, borderRadius: 10, marginLeft: 120, position: 'relative',
                        width: 50, height: 50
                    }}>
                        <Icon name='topic' size={30} />
                        <View style={{
                            position: 'absolute', top: -10, right: -10, zIndex: 100, backgroundColor: COLORS.primary,
                            paddingHorizontal: 10, padding: 5, borderRadius: 10
                        }}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }} >{recentDelivery.length}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
            <ScrollView>
                <Text style={{ fontSize: 23, fontWeight: 'bold', marginBottom: 10, marginTop: 20, marginHorizontal: 20 }}>Statics</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                >
                < View style = {{ backgroundColor: COLORS.light, width: 180, height: 180, margin: 10, borderRadius: 30 }}>
                    <Text style={{ color: 'grey', padding: 10, fontSize: 16, fontWeight: 600}}>SUCCESS</Text>
                    <View style={{ alignItems: 'center', marginTop: 0 }}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>{revenueSuccess}$</Text>
                        <Icons name='cash-check' size={100} color={'green'} />
                    </View>
                </View>
                <View style={{ backgroundColor: COLORS.light, width: 180, height: 180, margin: 10, borderRadius: 30 }}>
                    <Text style={{ color: 'grey', padding: 10, fontSize: 16, fontWeight: 600}}>PROCESSING</Text>
                    <View style={{ alignItems: 'center', marginTop: 0 }}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>{revenueProcessing}$</Text>
                        <Icons name='cash-fast' size={100} color={'#998100'} />
                    </View>
                </View>
                <View style={{ backgroundColor: COLORS.light, width: 180, height: 180, margin: 10, borderRadius: 30 }}>
                    <Text style={{ color: 'grey', padding: 10, fontSize: 16, fontWeight: 600}}>CANCELED</Text>
                    <View style={{ alignItems: 'center', marginTop: 0 }}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>{revenueCancel}$</Text>
                        <Icons name='cash-remove' size={100} color={'#df2020'} />
                    </View>
                </View>
            </ScrollView>

            <View style={{ marginTop: 20, marginHorizontal: 20 }}>
                <Text style={{ fontSize: 23, fontWeight: 'bold', marginBottom: 10 }}>My delivery</Text>
                <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                    <View style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', marginVertical: 5 }}>{amountWait_Delivering}</Text>
                        <View style={{ height: 20*amountWait_Delivering, width: 20, backgroundColor: COLORS.primary }}></View>
                        <Text style={{ fontWeight: 'bold', marginVertical: 10 }}>Wait delivery</Text>
                    </View>
                    <View style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', marginVertical: 5 }}>{amountDelivering}</Text>
                        <View style={{ height: 20*amountDelivering, width: 20, backgroundColor: COLORS.primary }}></View>
                        <Text style={{ fontWeight: 'bold', marginVertical: 10 }}>Delivering</Text>
                    </View>
                    <View style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', marginVertical: 5 }}>{amountDelivered}</Text>
                        <View style={{ height: 20*amountDelivered, width: 20, backgroundColor: COLORS.primary }}></View>
                        <Text style={{ fontWeight: 'bold', marginVertical: 10 }}>Delivered</Text>
                    </View>
                    <View style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', marginVertical: 5 }}>{amountDone}</Text>
                        <View style={{ height: 20*amountDone, width: 20, backgroundColor: COLORS.primary }}></View>
                        <Text style={{ fontWeight: 'bold', marginVertical: 10 }}>Done</Text>
                    </View>
                    <View style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', marginVertical: 5 }}>{amountCancel}</Text>
                        <View style={{ height: 20*amountCancel, width: 20, backgroundColor: COLORS.primary }}></View>
                        <Text style={{ fontWeight: 'bold', marginVertical: 10 }}>Cancel</Text>
                    </View>

                </View>
                <Text style={{ fontSize: 23, fontWeight: 'bold', marginVertical: 10 }}>Recent delivery</Text>
                {
                    recentDelivery.map((item) => (
                        <View style={{ backgroundColor: COLORS.light, width: 360, marginVertical: 5, borderRadius: 15, height: 80, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ height: 60, width: 60, backgroundColor: COLORS.primary, borderRadius: 10, marginLeft: 10, justifyContent: 'center', alignItems: 'center' }}>
                                <Icons name='truck-delivery' size={50} style={{}} />
                            </View>
                            <View style={{ marginHorizontal: 20 }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', marginVertical: 2, width: 150 }}>{item.deliveryWard}, {item.deliveryDistrict}, {item.deliveryProvince}</Text>
                                <Text style={{ fontSize: 16, marginVertical: 2 }}>{item.totalPrice}đ</Text>
                            </View>
                            <TouchableOpacity onPress={() => navigation.navigate('DeliveryDetailScreen', item)}>
                                <View style={{ marginLeft: 30 }}>
                                    <View style={{ backgroundColor: COLORS.primary, padding: 10, color: COLORS.white, fontWeight: 'bold', borderRadius: 10 }}>
                                        <Icon name='add' size={25} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ))
                }
            </View>
        </ScrollView>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    header: {
        marginTop: 20,
        marginHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    headerName: {
        fontSize: 25, fontWeight: 'bold', marginLeft: 10
    },

})

export default DashboardShipper