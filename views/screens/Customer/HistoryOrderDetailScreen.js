import React, { useEffect } from 'react'
import { View, Text, SafeAreaView, StyleSheet, Image, Modal, Pressable } from 'react-native'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import COLORS from '../../../consts/colors'
import { PrimaryButton, SecondaryButton } from '../../components/Button'
import axios from 'axios'
import { BaseURL } from '../../../consts/BaseURL'
import { useState } from 'react'


const HistoryOrderDetailScreen = ({ navigation, route }) => {
    const item = route.params;
    const [dataProduct, setDataProduct] = useState([]);
    const [deliveryData, setDeliveryData] = useState([]);
    const [reload, setReload] = useState(false);
    const [stateStatus, setStateStatus] = useState('');
    useEffect(() => {
        // CALL API GET ORDER PRODUCT BY ID
        axios.get(`${BaseURL}/api/v1/order/product?orderId=${item.orderId}`)
            .then((res) => {
                setDataProduct(res.data);
            })
            .catch((err) => {
                console.log("Order product error: ", err);
            })
        // GET DELIVERY BY ORDERID
        axios.get(`${BaseURL}/api/v1/delivery/order?orderId=${item.orderId}`)
            .then((res) => {
                setDeliveryData(res.data);
                setStateStatus(item.status);
                
            })
            .catch((err) => console.log(err))
    }, [])
   
    // UPDATE STATUS ORDER FUNCTION
    const updateOrderStatus = (status) => {
        var dataJson = JSON.stringify({
            "totalPrice": item.totalPrice,
            "shippingFee": item.shippingFee,
            "finalPrice": item.finalPrice,
            "addressId": item.addressId,
            "note": item.note,
            "status": status,
            "paymentMethod": item.paymentMethod
        });
        axios.put(`${BaseURL}/api/v1/order?orderId=${item.orderId}`,dataJson, {
            headers: { 
                'Content-Type': 'application/json'
            },
        })
            .then((res) => console.log(res.data.message))
            .catch((err) => console.log(err))
        
        // RELOAD DATA:
       setStateStatus(status);
    }
    const renderItem = ({ item, index }) => {
        return (
            <View style={styles.containerItem}>
                <View style={styles.imageItem}>
                    <Image
                        // source={require('../../../assets/meatPizza.png')}
                        source={{ uri: item.productImage.slice(0, -1) }}
                        style={{ width: 100, height: 100 }}
                    />
                </View>
                <View style={styles.detailItem}>
                    <Text style={{ marginVertical: 5, fontSize: 18, color: COLORS.white }}>{item.productName}</Text>
                    <Text style={{ marginVertical: 5, fontSize: 16, fontWeight: 'bold' }}>{item.price} đ</Text>
                    <View style={styles.amountItem}>
                        <Text style={{ marginVertical: 5, fontSize: 16, color: COLORS.dark }}>{item.amount}</Text>
                    </View>
                </View>
            </View>
        )
    }
    const [modalVisible, setModalVisible] = React.useState(false);
    return (

        <SafeAreaView>
            <Modal
                animationType='slide'
                transparent={true}
                visible={modalVisible}
                style={{}}
            >

                <View style={styles.deliveryContainer}>
                    <Pressable>
                        <Icon
                            style={{ padding: 2 }}
                            size={30}
                            name='close'
                            onPress={() => setModalVisible(!modalVisible)} />
                    </Pressable>
                    {
                        deliveryData.length > 0 ?
                        <View style={{ marginHorizontal: 10, flexDirection: "row", justifyContent: 'space-between', height: 300, alignItems: "flex-start" }}>
                            <View style={styles.orderInfo}>
                                <Text style={{ fontSize: 25, fontWeight: "bold", width: 150, marginVertical: 20 }}>Order Information</Text>
                                <View>

                                    <View style={styles.inputDelivery}>
                                        <Text style={{ lineHeight: 30, fontSize: 17, fontWeight: 600 }}>Mã đơn hàng</Text>
                                        <Text style={{ lineHeight: 30, fontSize: 17 }}>{item.orderId}</Text>
                                    </View>
                                    <View style={styles.inputDelivery}>
                                        <Text style={{ lineHeight: 30, fontSize: 17, fontWeight: 600 }}>Tổng giá</Text>
                                        <Text style={{ lineHeight: 30, fontSize: 17 }}>{item.totalPrice} đ</Text>
                                    </View>
                                    <View style={styles.inputDelivery}>
                                        <Text style={{ lineHeight: 30, fontSize: 17, fontWeight: 600 }}>Địa chỉ giao hàng</Text>
                                        <Text style={{ lineHeight: 30, fontSize: 17 }}>{deliveryData[0]?.deliveryApartmentNumber},
                                        {deliveryData[0]?.deliveryWard[0] === '{' ? JSON.parse(deliveryData[0]?.deliveryWard).ward_name : deliveryData[0]?.deliveryWard},
                                        {deliveryData[0]?.deliveryDistrict[0] === '{' ? JSON.parse(deliveryData[0]?.deliveryDistrict).district_name : deliveryData[0]?.deliveryDistrict},
                                        {deliveryData[0]?.deliveryProvince}</Text>
                                    </View>
                                    
                                </View>
                            </View>
                            <View style={styles.shipperInfo}>
                                <Text style={{ fontSize: 25, fontWeight: "bold", width: 150, marginVertical: 20 }}>Shipper Information</Text>
                                <View style={styles.inputDelivery}>
                                    <Text style={{ lineHeight: 30, fontSize: 17, fontWeight: 600 }}>Tên người giao hàng</Text>
                                    <Text style={{ lineHeight: 30, fontSize: 17 }}>{deliveryData[0]?.shipperName}</Text>
                                </View>
                                <View style={styles.inputDelivery}>
                                    <Text style={{ lineHeight: 30, fontSize: 17, fontWeight: 600 }}>SĐT người giao hàng</Text>

                                    <Text style={{ lineHeight: 30, fontSize: 17 }}>{deliveryData[0]?.shipperPhone}</Text>
                                </View>
                                
                                <View style={{
                                    borderColor: 'green',
                                    borderWidth: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: 30,
                                    paddingVertical: 10,
                                }}>
                                    <Text
                                        style={{
                                            fontSize: 25,
                                            color: 'green',
                                            fontWeight: 900
                                        }}
                                    >{deliveryData[0]?.status}</Text>
                                </View>
                            </View>
                        </View>
                        :
                        <View style={{ marginHorizontal: 10,justifyContent: 'center', height: 300, alignItems: "center" }}>
                            <Text style={{fontSize: 20, color: COLORS.primary, fontWeight: 'bold'}}>Đơn hàng chưa được vận chuyển</Text>
                        </View>
                    }
                </View>
            </Modal>
            <View style={styles.header}>
                <Icon name='arrow-back-ios' size={28} onPress={() => {
                    navigation.navigate('HomeScreen');
                    navigation.navigate('HistoryOrderScreen');
                }} />
                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Chi tiết đơn hàng</Text>
            </View>
            <View style={{ height: 50 }}>
                <View style={{ alignItems: 'center', marginBottom: 10, marginHorizontal: 10 }}>
                    <Text style={{
                        alignItems: 'center', fontSize: 20, fontWeight: 'bold', backgroundColor: COLORS.primary, color: COLORS.white,
                        paddingVertical: 10, width: '100%', textAlign: 'center'
                    }}>Bill ID: {item.orderId}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item.finalPrice} đ</Text>
                    {
                        stateStatus === 'Wait__Delivery' ? (
                            <Text style={{
                                fontSize: 20, fontWeight: 'bold', backgroundColor: COLORS.secondary, padding: 5, color: COLORS.dark
                            }}>Chờ giao</Text>
                        ) :
                            (
                                <Text style={{
                                    fontSize: 20, fontWeight: 'bold', backgroundColor: COLORS.secondary, padding: 5, color: COLORS.dark
                                }}>{stateStatus}</Text>
                            )
                    }
                </View>
            </View>
            <View style={{ marginHorizontal: 10, marginTop: 30 }}>
                <FlatList
                    data={dataProduct}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderItem}

                    ListFooterComponentStyle={{ paddingHorizontal: 20, marginTop: 20 }}
                    ListFooterComponent={() => (
                        <View style={{ marginBottom: 300 }}>
                            < PrimaryButton
                                title={"View delivery"}
                                onPress={() => setModalVisible(true)}
                            />
                            {
                                item.status === 'Ordered' &&
                                <View style={{marginTop: 10}}>
                                    < SecondaryButton
                                        title={"Cancel Order"}
                                        onPress={() => updateOrderStatus('Cancel')}
                                    />
                                </View>
                            }
                            {
                                item.status === 'Delivered' &&
                                <View style={{marginTop: 10}}>
                                    < SecondaryButton
                                        title={"Received"}
                                        onPress={() => updateOrderStatus('Received')}
                                    />
                                </View>
                            }
                        </View>
                    )}
                />
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
    containerItem: {
        flexDirection: 'row',
        height: 150,
        backgroundColor: COLORS.primary,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 20,
    },
    imageItem: {
        backgroundColor: COLORS.white,
        padding: 10,
        borderRadius: 20,
    },
    detailItem: {
        width: 230,
    },
    amountItem:
    {
        backgroundColor: COLORS.light,
        width: 40,
        height: 40,
        padding: 5,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    }
    ,
    // delivery
    deliveryContainer: {
        backgroundColor: COLORS.light,
        opacity: 0.95,
        marginTop: 200,
        marginHorizontal: 10,
        borderColor: COLORS.white,
        borderWidth: 1,

        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 10,
        shadowOffset: {
            height: 1,
            width: 1
        }
    },
    shipperInfo: {

    },
    orderInfo: {
        width: 200,
    },
    inputDelivery: {
        borderBottomColor: COLORS.dark, borderBottomWidth: 0.3,
    }

})

export default HistoryOrderDetailScreen

const statusBar = [
    {
        'id': 1,
        'name': 'Ordered',
        'status': 'Ordered',
        'description': 'Your order has been received',
    },
    {
        'id': 2,
        'name': 'Delivering',
        'status': 'delivering',
        'description': 'Your order has been received',
    },
    {
        'id': 3,
        'name': 'Done',
        'status': 'done',
        'description': 'Your order has been received',
    },
    {
        'id': 4,
        'name': 'Cancel',
        'status': 'cancel',
        'description': 'Your order has been received',
    },
]