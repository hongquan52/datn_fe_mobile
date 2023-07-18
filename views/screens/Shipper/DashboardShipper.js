import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, StyleSheet, Image, Modal, Pressable, TouchableOpacity, Button } from 'react-native'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import COLORS from '../../../consts/colors'
import { PrimaryButton, SecondaryButton } from '../../components/Button'
import axios from 'axios'
import { BaseURL } from '../../../consts/BaseURL'
import { TextInput } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const DashboardShipper = () => {
    const navigation = useNavigation();

    const [orderShipper, setOrderShipper] = useState([]);
    const [recentDelivery, setRecentDelivery] = useState([]);
    const [shipperData, setShipperData] = useState();
    const [linkAvatar, setLinkAvatar] = useState('');
    const [orderWaitDelivering, setOrderWaitDelvering] = useState([]);
    const [shipperID2, setShipperID2] = useState();

    const [addressShipper, setAddressShipper] = useState({});
    const [reload, setReload] = useState(false);
    // GET ORDER BY SHIPPER ID
    useEffect(async () => {
        const userID = await AsyncStorage.getItem("userId");
        const shipperID = parseInt(userID)
        setShipperID2(shipperID);
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
        // GET INFO SHIPPER
        axios.get(`${BaseURL}/api/v1/user/${shipperID}`)
            .then((res) => {
                setShipperData(res.data);

                axios.get(`${BaseURL}/api/v1/user/image?filename=${res.data.image}`)
                    .then((res) => setLinkAvatar(res.data))
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
        // GET ORDER WAIT DELIVERING
        axios.get(`${BaseURL}/api/v1/order/list-order-for-shipper?shipperId=${shipperID}`)
            .then((res) => {
                setOrderWaitDelvering(res.data)

            })
            .catch((err) => console.log(err))
        axios.get(`${BaseURL}/api/v1/address/user?userId=${shipperID}`)
            .then((res) => {
                let x = res.data.find(
                    (item) => item.defaultAddress === true
                )
                setAddressShipper(x);
            })
    }, [])
    useEffect(() => {
        // GET ORDER WAIT DELIVERING
        axios.get(`${BaseURL}/api/v1/order/list-order-for-shipper?shipperId=${shipperID2}`)
            .then((res) => {
                setOrderWaitDelvering(res.data)

            })
            .catch((err) => console.log(err))
        axios.get(`${BaseURL}/api/v1/address/user?userId=${shipperID2}`)
            .then((res) => {
                let x = res.data.find(
                    (item) => item.defaultAddress === true
                )
                setAddressShipper(x);
            })
    }, [reload])
    // LOGOUT FUNCTION
    const logOutShipper = () => {
        AsyncStorage.clear();
        navigation.navigate("LoginScreen");
    }
    const createDelivery = (orderID, addressID) => {
        var data = new FormData();
        data.append('addressId', addressID);
        data.append('orderId', orderID);
        data.append('shipperId', shipperID2);
        axios.post(`${BaseURL}/api/v1/delivery`, data)
            .then((res) => {
                alert("Nhận đơn thành công");
                setReload(!reload);
            })
            .catch((err) => console.log(err))
        // console.log(orderID, addressID, shipperID2)
    }
    // const updateStatus = (item) => {

    //     let dataRaw = JSON.stringify({
    //         "totalPrice": item.totalPrice,
    //         "shippingFee": item.shippingFee,
    //         "finalPrice": item.finalPrice,
    //         "addressId": item.addressId,
    //         "note": item.note,
    //         "status": 'Delivering',
    //         "paymentMethod": item.paymentMethod
    //     });
    //     let config = {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //     };
    //     axios.put(`${BaseURL}/api/v1/order?orderId=${item.orderId}`, dataRaw, config)
    //         .then((res) => {
    //             alert(res.data.message);
    //             setReload(!reload);
    //         })
    //         .catch((err) => console.log("Update status: ", err))

    // }

    // REVENUE ORDER OF SHIPPER
    const revenueSuccess = orderShipper.filter((item) => item.status === 'Done').reduce((acc, cur) => {
        return acc + cur.totalPrice
    }, 0)
    const revenueProcessing = orderShipper.filter((item) => item.status !== 'Done' && item.status !== 'Cancel').reduce((acc, cur) => {
        return acc + cur.totalPrice
    }, 0)
    const revenueCancel = orderShipper.filter((item) => item.status === 'Cancel').reduce((acc, cur) => {
        return acc + cur.totalPrice
    }, 0)
    // TOTAL ORDER BY STATUS:
    const amountDone = orderShipper.filter((item) => item.status === 'Done').reduce((acc, cur) => {
        return acc + 1
    }, 0)
    const amountWait_Delivering = orderShipper.filter((item) => item.status === 'Wait_Delivering').reduce((acc, cur) => {
        return acc + 1
    }, 0)
    const amountDelivering = orderShipper.filter((item) => item.status === 'Delivering').reduce((acc, cur) => {
        return acc + 1
    }, 0)
    const amountDelivered = orderShipper.filter((item) => item.status === 'Delivered').reduce((acc, cur) => {
        return acc + 1
    }, 0)
    const amountCancel = orderShipper.filter((item) => item.status === 'Cancel').reduce((acc, cur) => {
        return acc + 1
    }, 0)


    return (
        <SafeAreaView>
            <View style={styles.header}>
                <Image source={{ uri: linkAvatar.slice(0, -1) }} style={styles.headerAvatar} />
                <View>
                    <TouchableOpacity onPress={() => logOutShipper()}>
                        <Text style={{ fontSize: 22, marginLeft: 10 }}>Chào shipper,</Text>
                    </TouchableOpacity>
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
                <Text style={{ fontSize: 23, fontWeight: 'bold', marginBottom: 10, marginTop: 20, marginHorizontal: 20 }}>Thống kê</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                >
                    < View style={{ backgroundColor: COLORS.light, width: 180, height: 180, margin: 10, borderRadius: 30 }}>
                        <Text style={{ color: 'grey', padding: 10, fontSize: 16, fontWeight: 600 }}>THÀNH CÔNG</Text>
                        <View style={{ alignItems: 'center', marginTop: 0 }}>
                            <Text style={{ fontSize: 25, fontWeight: 'bold' }}>{revenueSuccess}đ</Text>
                            <Icons name='cash-check' size={100} color={'green'} />
                        </View>
                    </View>
                    <View style={{ backgroundColor: COLORS.light, width: 180, height: 180, margin: 10, borderRadius: 30 }}>
                        <Text style={{ color: 'grey', padding: 10, fontSize: 16, fontWeight: 600 }}>ĐANG XỬ LÝ</Text>
                        <View style={{ alignItems: 'center', marginTop: 0 }}>
                            <Text style={{ fontSize: 25, fontWeight: 'bold' }}>{revenueProcessing}đ</Text>
                            <Icons name='cash-fast' size={100} color={'#998100'} />
                        </View>
                    </View>
                    <View style={{ backgroundColor: COLORS.light, width: 180, height: 180, margin: 10, borderRadius: 30 }}>
                        <Text style={{ color: 'grey', padding: 10, fontSize: 16, fontWeight: 600 }}>ĐƠN HỦY</Text>
                        <View style={{ alignItems: 'center', marginTop: 0 }}>
                            <Text style={{ fontSize: 25, fontWeight: 'bold' }}>{revenueCancel}đ</Text>
                            <Icons name='cash-remove' size={100} color={'#df2020'} />
                        </View>
                    </View>
                </ScrollView>

                <View style={{ marginTop: 20, marginHorizontal: 20 }}>
                    <Text style={{ fontSize: 23, fontWeight: 'bold', marginBottom: 10 }}></Text>
                    <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                        <View style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', marginVertical: 5 }}>{amountWait_Delivering}</Text>
                            <View style={{ height: 20 * amountWait_Delivering, width: 20, backgroundColor: COLORS.primary }}></View>
                            <Text style={{ fontWeight: 'bold', marginVertical: 10 }}>Đang chờ giao</Text>
                        </View>
                        <View style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', marginVertical: 5 }}>{amountDelivering}</Text>
                            <View style={{ height: 20 * amountDelivering, width: 20, backgroundColor: COLORS.primary }}></View>
                            <Text style={{ fontWeight: 'bold', marginVertical: 10 }}>Đang giao</Text>
                        </View>
                        <View style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', marginVertical: 5 }}>{amountDelivered}</Text>
                            <View style={{ height: 20 * amountDelivered, width: 20, backgroundColor: COLORS.primary }}></View>
                            <Text style={{ fontWeight: 'bold', marginVertical: 10 }}>Đã giao</Text>
                        </View>
                        <View style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', marginVertical: 5 }}>{amountDone}</Text>
                            <View style={{ height: 20 * amountDone, width: 20, backgroundColor: COLORS.primary }}></View>
                            <Text style={{ fontWeight: 'bold', marginVertical: 10 }}>Hoàn tất</Text>
                        </View>
                        <View style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', marginVertical: 5 }}>{amountCancel}</Text>
                            <View style={{ height: 20 * amountCancel, width: 20, backgroundColor: COLORS.primary }}></View>
                            <Text style={{ fontWeight: 'bold', marginVertical: 10 }}>Đơn hủy</Text>
                        </View>

                    </View>
                    <View>
                        <Text style={{ fontSize: 23, fontWeight: 'bold', marginVertical: 10 }}>Khu vực hoạt động</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 18, marginRight: 30 }}>{addressShipper?.address?.province}</Text>
                            <Button color={COLORS.primary} title='Đổi khu vực' onPress={() => navigation.navigate('AddressScreen')} />
                            <Button color={COLORS.primary} title='Tải lại' onPress={() => setReload(!reload)} />
                        </View>
                    </View>
                    <Text style={{ fontSize: 23, fontWeight: 'bold', marginVertical: 10 }}>Đơn gần đây</Text>
                    <View style={{ paddingBottom: 100 }}>

                        {
                            orderWaitDelivering.filter(
                                (item) => item.deliveryWard !== null
                            )
                                .map((item) => (
                                    <View style={{ backgroundColor: COLORS.light, width: 360, marginVertical: 5, borderRadius: 15, height: 80, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ height: 60, width: 60, backgroundColor: COLORS.primary, borderRadius: 10, marginLeft: 10, justifyContent: 'center', alignItems: 'center' }}>
                                            <Icons name='truck-delivery' size={50} style={{}} />
                                        </View>
                                        <View style={{ marginHorizontal: 20 }}>
                                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginVertical: 2, width: 150 }}>
                                                {item.deliveryWard[0] === '{' ? JSON.parse(item.deliveryWard).ward_name : item.deliveryWard},
                                                {item.deliveryDistrict[0] === '{' ? JSON.parse(item.deliveryDistrict).district_name : item.deliveryDistrict},
                                                {item.deliveryProvince}
                                            </Text>
                                            <Text style={{ fontSize: 16, marginVertical: 2 }}>{item.totalPrice}đ</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => {
                                            createDelivery(item.orderId, item.addressId);
                                            // updateStatus(item);
                                        }}>
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