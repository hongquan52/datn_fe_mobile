import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, SafeAreaView, Image, Button, Alert, ScrollView, Modal, Pressable, Linking } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import Iconss from 'react-native-vector-icons/Foundation'
import COLORS from '../../consts/colors'
import { RadioButton } from 'react-native-paper';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { PrimaryButton } from '../components/Button';
import axios from 'axios'
import { BaseURL } from '../../consts/BaseURL'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useForm, Controller, set } from 'react-hook-form'

const CheckoutScreen = ({ navigation }) => {
    const [cartIDD, setCartIDD] = useState(0);
    // STATE PRICE
    const [shippingState, setShippingState] = useState(0);
    const [shippingStateOriginal, setShippingStateOriginal] = useState(20000);
    const [subtotalStateOriginal, setSubtotalStateOriginal] = useState(0)
    const [subtotalState, setSubtotalState] = useState(0);

    // DATA API
    const [voucherData, setVoucherData] = useState([]);
    const [addressData, setAddressData] = useState([]);
    const [productData, setProductData] = useState([]);


    // RADIO BUTTON PAYMENT METHOD
    const [checked, setChecked] = React.useState('COD');
    // RADIO BUTTON ADDRESS
    const [voucherIdSelected, setVoucherIdSelected] = useState(3);
    // DEFAULT ADDRESS : CALL API AFTER
    const [addressSelected, setAddressSelected] = useState({
        "id": 9,
        "apartmentNumber": "Default apartment",
        "ward": "default ward",
        "district": "default district",
        "province": "default province"
    })

    const [addressConfirm, setAddressConfirm] = useState(false);

    // RADIO BUTTON VOUCHER
    const [voucherIddSelected, setVoucherIddSelected] = useState(0);
    // DEFAULT VOUCHER: CALL API AFTER
    const [voucherSelected, setVoucherSelected] = useState({});

    // EXTEND ORDER LIST
    const [extendProduct, setExtendProduct] = useState(false);

    // MODAL STATE:
    const [modalAddressVisible, setModalAddressVisible] = useState(false);
    const [modalVoucherVisible, setModalVoucherVisible] = useState(false);

    // ADD PRODUCT FROM CART TO ORDER
    const addProductToOrder = (orderId) => {
        productData.map((item) => {
            axios.post(`${BaseURL}/api/v1/order/orderProduct?orderId=${orderId}&productId=${item.productId}&amount=${item.amount}`)
                .then((res) => console.log(res.data.message))
                .catch((err) => console.log("Response add porduct to ordeer", err))
        })
    }
    // DELETE ALL PRODUCT IN CART WHEN CREATE ORDER:
    const clearCart = () => {
        axios.delete(`${BaseURL}/api/v1/cart/product/clear-all?cartId=${cartIDD}`)
            .then((res) => console.log(res.data.message))
            .catch((err) => console.log("CLear cart err: ", err))
    }
    // USEFORM SUBMIT
    const { control, handleSubmit } = useForm();
    const onSubmit = async (data) => {

        const userID = await AsyncStorage.getItem("userId");
        const userID2 = parseInt(userID)
        var dataForm = JSON.stringify({
            "totalPrice": subtotalStateOriginal - subtotalState,
            "shippingFee": shippingStateOriginal - shippingState,
            "finalPrice": subtotalStateOriginal - subtotalState + shippingStateOriginal - shippingState,
            "note": data.note,
            "paymentMethod": checked,
            "addressId": voucherIdSelected,
        });
        // PLACE AN ORDER
        axios.post(`${BaseURL}/api/v1/order?userId=${userID2}`, dataForm, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                console.log("Create order res: ", res.data.message);
                addProductToOrder(res.data.data.orderId)
                clearCart();

            })
            .catch((err) => {
                console.log('Create order error: ', err);
            })

        navigation.navigate('SuccessOrder');

        // // VNPAY METHOD:
        // if(checked === 'VNPAY') {
        //     axios.get(`${BaseURL}/create-payment?amount=${subtotalStateOriginal-subtotalState+shippingStateOriginal-shippingState}&orderId=${4}`)
        //     .then((res) => {
        //         Linking.openURL(res.data.data);
        //     })
        //     .catch((err) => console.log("Payment VNPAY error: ", err))
        // }
        // else {
            
        // }

    }

    useEffect(() => {
        // CALCULATE SHIPPING FEE
        if (addressSelected.ward[0] === '{' && addressSelected.district[0] === '{') {
            let wardObject = JSON.parse(addressSelected.ward)
            let districtObject = JSON.parse(addressSelected.district)
            // console.log("ssssssssssssssssssss: ", `type of ward: ${(wardObject.ward_id)}`, `type of district: ${(districtObject.district_id)}`)
            var dataJSON1 = JSON.stringify({
                "shop_id": 4311551,
                "from_district": 3695,
                "to_district": districtObject.district_id
            });
            axios.post('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services', dataJSON1, {
                headers: { 
                    'token': '466cdca6-febd-11ed-a967-deea53ba3605', 
                    'Content-Type': 'application/json'
                  },
            })
                .then((res) => {
                    calculateShipping(res.data.data[0].service_id)
                })
                .catch((err) => console.log(err))
            
            
        }
    }, [addressConfirm])

    // CACULATE SHIPPING FEE FUNCTION:
    const calculateShipping = (serviceID) => {
        if(addressSelected.ward[0] === '{' && addressSelected.district[0] === '{') {
            let wardObject = JSON.parse(addressSelected.ward)
            let districtObject = JSON.parse(addressSelected.district);

            var dataJSON = JSON.stringify({
                "service_id": serviceID,
                "insurance_value": subtotalStateOriginal,
                "coupon": null,
                "from_district_id": 3695,
                "to_district_id": districtObject.district_id,
                "to_ward_code": wardObject.ward_id,
                "height": 15,
                "length": 15,
                "weight": 1000,
                "width": 15
            });
            // alert(serviceID);
    
            axios.post(`https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee`, dataJSON, {
                headers: {
                    'token': '466cdca6-febd-11ed-a967-deea53ba3605',
                    'shop_id': '4311551',
                    'Content-Type': 'application/json'
                }
            })
                .then((res) => {
                    setShippingStateOriginal(res.data.data.total);
                })
                .catch((err) => console.log(err))
        }
    }
    // END=========

    // LOAD DATA
    useEffect(async () => {
        const userID = await AsyncStorage.getItem("userId");
        const userID2 = parseInt(userID)

        // CALL API GET VOUCHER BY USER
        axios.get(`${BaseURL}/api/v1/voucher/user?userId=${userID2}`)
            .then((res) => {

                setVoucherData(res.data);
            })
            .catch((err) => {
                console.log("Error my voucher: ", err);
            })
        // CALL API GET ADDRESS BY USER

        axios.get(`${BaseURL}/api/v1/address/user?userId=${userID2}`)
            .then((res) => {
                setAddressData(res.data);
                const x = res.data.filter((item) => {
                    return item.defaultAddress === true;
                })
                setAddressSelected(x[0].address);
                setAddressConfirm(!addressConfirm);

            })
            .catch((error) => console.log("Error: ", error))
        // .finally(() => setLoading(false))

        // GET PRODUCT IN CART TO ORDER LIST
        const cartID = await AsyncStorage.getItem("cartId");
        const cartId2 = parseInt(cartID)
        setCartIDD(cartId2);

        axios.get(`${BaseURL}/api/v1/cart/product?cartId=${cartId2}`)
            .then((res) => {
                setProductData(res.data);
                const total = res.data.reduce((acc, item) => {
                    return acc + item.price * item.amount;
                }, 0)
                setSubtotalStateOriginal(total);
            })
            .catch((error) => console.log("Error: ", error))

    }, [])

    // CHANGE USER ADDRESS WHEN CHOOSE ADDRESS LIST
    useEffect(() => {
        const userAddressSelected = addressData.filter((item) => {
            return item?.address.id == voucherIdSelected;
        })

        setAddressSelected(userAddressSelected[0]?.address);

    }, [voucherIdSelected])

    // CHANGE USER VOUCHER WHEN CHOOSE VOUCHER LIST
    useEffect(() => {
        const x = voucherData.filter((item) => {
            return item?.voucher.id == voucherIddSelected;
        })

        setVoucherSelected(x[0]?.voucher);

    }, [voucherIddSelected])
    // CHANGE VOUCHER PRICE WHEN CHANGE VOUCHER
    useEffect(() => {
        if (voucherSelected?.voucherType?.id == 2) {
            const x = (voucherSelected?.percent) / 100 * shippingStateOriginal;
            if (x < voucherSelected?.upTo) {
                setShippingState(x)
                setSubtotalState(0);
            }
            else {
                setShippingState(voucherSelected?.upTo);
                setSubtotalState(0)
                // setShippingState();s
            }
        } else if (voucherSelected?.voucherType?.id == 1) {
            const y = (voucherSelected?.percent) / 100 * subtotalStateOriginal;
            console.log("Subtotal discount voucher: ", y)
            if (y < voucherSelected?.upTo) {
                setSubtotalState(y);
                setShippingState(0);
            }
            else {
                setSubtotalState(voucherSelected?.upTo);
                setShippingState(0)
            }
        }

    }, [voucherSelected])
    const Productcard = ({ item }) => {
        return (
            <View style={{
                height: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                borderBottomColor: COLORS.dark, borderBottomWidth: 0.25, marginVertical: 5
            }}>
                <Image source={{ uri: item?.productImage.slice(0, -1), width: 50, height: 50, }} />

                <Text style={{ fontWeight: 'bold', width: 130 }}>{item?.productName}</Text>
                <Text>{item?.price}</Text>

                <Text>x{item?.amount}</Text>
            </View>
        )
    }
    return (
        <SafeAreaView style={{ backgroundColor: COLORS.white, flex: 1 }}>
            {/* Modal Address Choose */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalAddressVisible}
            >
                <View style={styles.centeredView1}>
                    <View style={styles.modalView}>
                        <Pressable>
                            <Icon
                                style={{ padding: 2, marginLeft: -190 }}
                                size={30}
                                name='close'
                                onPress={() => setModalAddressVisible(!modalAddressVisible)} />
                        </Pressable>
                        {
                            addressData.map((item) => {
                                return (
                                    <TouchableOpacity onPress={() => setVoucherIdSelected(item.address.id)}>
                                        <View style={[styles.addressCard, { marginHorizontal: 5 }]}>
                                            <Icon name='location-pin' size={40} />
                                            <Text style={{ width: 300, fontSize: 16, marginRight: 0 }}>{item?.address.apartmentNumber},
                                            {item?.address.ward[0] === '{' ? JSON.parse(item?.address.ward).ward_name : item?.address.ward},
                                            {item?.address.district[0] === '{' ? JSON.parse(item?.address.district).district_name : item?.address.district},
                                            {item?.address.province}</Text>

                                            <RadioButton
                                                value="first"
                                                status={voucherIdSelected === item?.address.id ? 'checked' : 'unchecked'}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        }
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => {
                                setModalAddressVisible(!modalAddressVisible);
                                setAddressConfirm(!addressConfirm);
                            }}
                        >
                            <Text style={styles.textStyle}>Xác nhận</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.button, styles.buttonClose, styles.buttonContainer]}
                            onPress={() => {
                                setModalAddressVisible(!modalAddressVisible);
                                navigation.navigate("NewAddressScreen");
                            }}
                        >
                            <Icon name='add-circle' color={COLORS.white} size={16} />
                            <Text style={styles.textStyle}>Địa chỉ mới</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            {/* Modal Voucher Choose */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVoucherVisible}
            >
                <View style={styles.centeredView1}>
                    <View style={styles.modalView}>
                        <Pressable>
                            <Icon
                                style={{ padding: 2, marginLeft: -190 }}
                                size={30}
                                name='close'
                                onPress={() => setModalVoucherVisible(!modalVoucherVisible)} />
                        </Pressable>
                        <ScrollView>
                            {
                                voucherData.map((item) => {
                                    return (
                                        <TouchableOpacity onPress={() => setVoucherIddSelected(item.voucher.id)}>
                                            <View style={[styles.voucherCard, { marginVertical: 10 }]}>
                                                <View style={styles.voucherItem}>
                                                    <View style={{ marginRight: -50, width: 320, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                        <Image style={{ height: 60, width: 60 }} source={{ uri: item.voucher.thumbnail }} />
                                                        <View style={{ marginLeft: 10, width: 150 }}>
                                                            <Text style={{ fontSize: 16, fontWeight: 600 }}>{item.voucher.title}</Text>
                                                            <Text>{item.voucher.description}</Text>
                                                        </View>
                                                    </View>
                                                    <RadioButton
                                                        value="first"
                                                        status={voucherIddSelected === item.voucher.id ? 'checked' : 'unchecked'}

                                                    />
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => {
                                    setModalVoucherVisible(!modalVoucherVisible);

                                }}
                            >
                                <Text style={styles.textStyle}>Xác nhận</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.buttonClose, { backgroundColor: COLORS.light }]}
                                onPress={() => {
                                    setVoucherIddSelected(0)
                                    setModalVoucherVisible(!modalVoucherVisible);
                                    setShippingState(0);
                                    setSubtotalState(0);
                                }}
                            >
                                <Text style={[styles.textStyle, { color: 'red' }]}>Không dùng</Text>
                            </Pressable>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
            <View style={styles.header}>
                <Icon name='arrow-back-ios' size={28} onPress={navigation.goBack} />
                <Text style={{ fontWeight: 'bold' }}>Đặt hàng</Text>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
            >

                <View style={{ marginHorizontal: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.label}>Danh sách sản phẩm</Text>
                            <Text style={{ fontSize: 18, marginLeft: 15 }}>({productData.length} sản phẩm)</Text>
                        </View>
                        <TouchableOpacity onPress={() => setExtendProduct(!extendProduct)}>
                            {
                                extendProduct ? <Iconss name='arrows-compress' size={20} /> :
                                    <Iconss name='arrows-expand' size={20} />
                            }
                        </TouchableOpacity>
                    </View>
                    <View style={{}}>
                        {
                            extendProduct ?
                                productData.map((item) => <Productcard item={item} />) :
                                <Productcard item={productData[0]} />

                        }
                    </View>
                    <Text style={styles.label}>Địa chỉ giao hàng</Text>
                    <Text style={{ fontSize: 17, fontWeight: 500, color: COLORS.primary }}>Nguyễn Lê Quỳnh Trang (+8442394898)</Text>
                    <View style={styles.addressCard}>
                        <Icon name='location-pin' size={40} />
                        <Text style={{ width: 200, fontSize: 16, marginRight: 50 }}>{addressSelected?.apartmentNumber},
                            {addressSelected?.ward[0] === '{' ? JSON.parse(addressSelected?.ward).ward_name : addressSelected?.ward},
                            {addressSelected?.district[0] === '{' ? JSON.parse(addressSelected?.district).district_name : addressSelected?.district},
                            {addressSelected?.province}</Text>
                        <Button title='Edit' color={COLORS.primary} onPress={() => setModalAddressVisible(true)} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                        <Text style={styles.label}>Lưu ý</Text>
                        <Controller
                            name='note'
                            defaultValue={''}
                            control={control}
                            render={({ field: { value, onChange, onBlur } }) => (
                                <TextInput
                                    focusable
                                    style={{
                                        borderColor: 'black', borderWidth: 0.3, marginLeft: 10,
                                        borderRadius: 5, width: 340, fontSize: 18, height: 50
                                    }}
                                    onChangeText={onChange}
                                    value={value}

                                />
                            )}
                        />
                    </View>
                    <Text style={styles.label}>Choose voucher</Text>
                    <View style={styles.voucherCard}>
                        <View style={styles.voucherItem}>
                            {
                                voucherIddSelected == 0 ?
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ color: 'red', marginRight: 5 }}>No voucher is used</Text>
                                        <Icon name='remove-circle' size={20} color={'red'} />
                                    </View>
                                    :
                                    <View style={{ width: 230, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                        <Image style={{ height: 60, width: 60 }} source={{ uri: voucherSelected?.thumbnail }} />
                                        <View style={{ marginLeft: 10 }}>
                                            <Text style={{ fontSize: 16, fontWeight: 'bold', lineHeight: 30 }}>{voucherSelected?.title}</Text>
                                            <Text style={{ width: 170 }}>{voucherSelected?.description}</Text>
                                        </View>
                                    </View>
                            }
                            <Button title='Add voucher' color={COLORS.primary} onPress={() => {
                                setModalVoucherVisible(true);

                            }} />
                        </View>
                    </View>

                    <Text style={styles.label}>Please choose payment method:</Text>
                    <View style={{ marginHorizontal: 20, flexDirection: 'row', justifyContent: 'space-around' }}>
                        <TouchableOpacity onPress={() => setChecked('VNPAY')}>
                            <View style={{
                                backgroundColor: COLORS.primary, marginVertical: 10, height: 70, backgroundColor: checked == 'VNPAY' ? COLORS.primary : COLORS.light, flexDirection: 'row',
                                justifyContent: 'space-between', alignItems: 'center', width: 170, borderRadius: 20
                            }}>
                                <Image source={require('../../assets/vnpay.png')} style={{ height: 50, width: 50, borderRadius: 20, marginLeft: 10 }} />
                                <Text style={{ marginLeft: 7, fontSize: 14, fontWeight: 'bold', width: 60 }}>QR CODE</Text>
                                <View style={{ marginRight: 10 }}>
                                    <RadioButton
                                        value="VNPAY"
                                        status={checked === 'VNPAY' ? 'checked' : 'unchecked'}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setChecked('COD')}>
                            <View style={{
                                backgroundColor: COLORS.primary, marginVertical: 10, height: 70, backgroundColor: checked == 'COD' ? COLORS.primary : COLORS.light, flexDirection: 'row',
                                justifyContent: 'space-between', alignItems: 'center', width: 170, borderRadius: 20
                            }}>
                                <Image source={require('../../assets/COD.png')} style={{ height: 50, width: 50, borderRadius: 20, marginLeft: 10 }} />
                                <Text style={{ marginLeft: 7, fontSize: 14, fontWeight: 'bold', width: 60 }}>SHIP COD</Text>
                                <View style={{ marginRight: 10 }}>
                                    <RadioButton
                                        value="COD"
                                        status={checked === 'COD' ? 'checked' : 'unchecked'}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.label}>Payment detail</Text>
                    <View>
                        <View style={styles.paymentPrice}>
                            <Text style={{ fontSize: 18 }}>Subtotal</Text>
                            <Text style={{ fontSize: 18 }}>{subtotalStateOriginal} $</Text>
                        </View>
                        <View style={styles.paymentPrice}>
                            <Text style={{ fontSize: 18 }}>Shipping</Text>
                            <Text style={{ fontSize: 18 }}>{shippingStateOriginal} $</Text>
                        </View>
                        <View style={styles.paymentPrice}>
                            <Text style={{ fontSize: 18 }}>Voucher (Order)</Text>
                            <Text style={{ fontSize: 18 }}>-{subtotalState} $</Text>
                        </View>
                        <View style={styles.paymentPrice}>
                            <Text style={{ fontSize: 18 }}>Voucher (Shipping)</Text>
                            <Text style={{ fontSize: 18 }}>-{shippingState} $</Text>
                        </View>
                        <View style={styles.paymentTotal}>
                            <Text style={{ fontSize: 22, fontWeight: 'bold', marginTop: 10 }}>Total</Text>
                            <Text style={{ fontSize: 22, color: COLORS.primary, marginTop: 10 }}>{-subtotalState - shippingState + subtotalStateOriginal + shippingStateOriginal} $</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.footer}>
                <PrimaryButton title={"Place an order"} onPress={handleSubmit(onSubmit)} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    header: {
        paddingVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        marginBottom: 20,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 18,
        marginVertical: 10,
    },
    addressCard: {
        backgroundColor: COLORS.white,
        borderColor: COLORS.dark,
        borderWidth: 0.5,
        height: 60,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginVertical: 5,
    },
    voucherCard: {
        height: 60
    },
    voucherItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // backgroundColor: COLORS.light,
        height: 60,
        padding: 10,
    },
    paymentPrice: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5
    },
    paymentTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5,
        borderTopColor: 'black',
        borderTopWidth: 0.5,
    },
    footer: {
        marginHorizontal: 10,
    },

    // MODAL ADDRESS
    centeredView1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,


    },
    modalView: {
        width: 400,
        height: 600,
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
        height: 50,
        width: 300,
        marginVertical: 10,
    },
    buttonClose: {
        backgroundColor: COLORS.primary,
        padding: 10,

    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
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
    modalTitle: {
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 20,
        width: 200,
        lineHeight: 30,
        fontWeight: 'bold',
    },

})

export default CheckoutScreen

const productOrders = [
    {
        'id': 1,
        'name': 'GVN MINION i1650',
        'price': '9900000$',
        'amount': 3,
        'productImage': 'https://product.hstatic.net/1000026716/product/minion_i1650_95fbed26b7604412a1689d18f11edb0a.png',
    },
    {
        'id': 2,
        'name': 'GVN Homework R5',
        'price': '24000$',
        'amount': 1,
        'productImage': 'https://product.hstatic.net/1000026716/product/r5_b7c4882b4f784613910df5125bac2fd0.png',
    },
    {
        'id': 3,
        'name': 'Macbook Pro M12',
        'price': '24000$',
        'amount': 4,
        'productImage': 'https://salt.tikicdn.com/cache/280x280/media/catalog/producttmp/5d/50/5e/1d977cb23133c625f0baf7f4326cf523.jpg',
    },

]

const userAddress = [
    {
        "user": 1,
        "address": {
            "id": 3,
            "apartmentNumber": "Richmond city",
            "ward": "Phường 12",
            "district": "Bình Thạnh",
            "province": "TP Hồ Chí Minh"
        },
        "defaultAddress": false
    },
    {
        "user": 1,
        "address": {
            "id": 7,
            "apartmentNumber": "12/2 street 5",
            "ward": "Linh Chiểu",
            "district": "Thủ Đức",
            "province": "TP Hồ Chí Minh"
        },
        "defaultAddress": false
    },
    {
        "user": 1,
        "address": {
            "id": 8,
            "apartmentNumber": "116 Xuân Diệu",
            "ward": "Thị Trấn Nghèn",
            "district": "Can Lộc",
            "province": "Hà Tĩnh"
        },
        "defaultAddress": false
    },
    {
        "user": 1,
        "address": {
            "id": 9,
            "apartmentNumber": "Ấp 10",
            "ward": "Lộc Thiện",
            "district": "Lộc Ninh",
            "province": "Bình Phước"
        },
        "defaultAddress": false
    }
]

const userVoucher = [
    {
        "id": "1",
        "name": "Quỳnh Trang Nè",
        "voucher": {
            "id": 1,
            "title": "Miễn phí vận chuyển",
            "percent": 100.0,
            "status": true,
            "description": "Miễn phí vận chuyển cho đơn hàng bất kì",
            "thumbnail": "https://channel.mediacdn.vn/thumb_w/640/2022/3/15/photo-1-16473361345291376373809.jpg",
            "type": "MPVC",
            "code": "MPVC01",
            "startDate": null,
            "endDate": null,
            "createdDate": null,
            "updatedDate": null
        }
    },
    {
        "id": "1",
        "name": "Quỳnh Trang Nè",
        "voucher": {
            "id": 2,
            "title": "Giảm 10K",
            "percent": 99.0,
            "status": true,
            "description": "Giảm giá 10K cho đơn bất kì",
            "thumbnail": "https://channel.mediacdn.vn/thumb_w/640/2022/3/15/photo-1-16473361345291376373809.jpg",
            "type": "GGSP",
            "code": "G10K01",
            "startDate": null,
            "endDate": null,
            "createdDate": null,
            "updatedDate": null
        }
    },
    {
        "id": "1",
        "name": "Quỳnh Trang Nè",
        "voucher": {
            "id": 3,
            "title": "Giảm 15K",
            "percent": 99.0,
            "status": true,
            "description": "Giảm giá 15K cho đơn bất kì",
            "thumbnail": "https://channel.mediacdn.vn/thumb_w/640/2022/3/15/photo-1-16473361345291376373809.jpg",
            "type": "GGSP",
            "code": "G10K01",
            "startDate": null,
            "endDate": null,
            "createdDate": null,
            "updatedDate": null
        }
    },
    {
        "id": "1",
        "name": "Quỳnh Trang Nè",
        "voucher": {
            "id": 4,
            "title": "Giảm 2%",
            "percent": 99.0,
            "status": true,
            "description": "Giảm giá 2% cho đơn bất kì",
            "thumbnail": "https://channel.mediacdn.vn/thumb_w/640/2022/3/15/photo-1-16473361345291376373809.jpg",
            "type": "GGSP",
            "code": "G10K01",
            "startDate": null,
            "endDate": null,
            "createdDate": null,
            "updatedDate": null
        }
    }
]