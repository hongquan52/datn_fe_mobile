import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { FlatList, Swipeable } from 'react-native-gesture-handler'
import { Animated, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import COLORS from '../../../consts/colors'
import axios from 'axios'
import { BaseURL } from '../../../consts/BaseURL';
import AsyncStorage from '@react-native-async-storage/async-storage'

const VoucherListScreen = ({ navigation }) => {
    // CLAIM BUTTON STATE
    const [claimed, setClaimed] = useState({});
    // const [indexButton , setIndexButton ] = useState();
    // SEARCH VOUCHERS
    const [data, setData] = useState([]);
    const [voucherData, setVoucherData] = React.useState([]);
    const [userVoucher, setUserVoucher] = useState([]);
    console.log("--------------------------------------------");
    console.log("user VOUCHER: ", claimed);


    const searchHandle = (searchTerm) => {
        const searchedProduct = data.filter((item) => {
            if (searchTerm.value === '')
                return item;
            if (item.title.toLowerCase().includes(searchTerm.toLowerCase()))
                return item;
        })
        setVoucherData(searchedProduct);
    }
    // HANDLE CLAIM
    const addItem = async (id) => {
        const userID = await AsyncStorage.getItem("userId");
        const userID2 = parseInt(userID)
        axios.post(`${BaseURL}/api/v1/voucher/user?userId=${userID2}&voucherId=${id}`)
            .then((res) => {
                console.log("Add voucher res: ", res.data.message);
            })
            .catch((err) => {
                console.log("Error add voucher: ", err);
            })
    }

    // CALL API GET ALL VOUCHERS
    useEffect(async() => {
        axios.get(`${BaseURL}/api/v1/voucher`)
            .then((res) => {
                console.log("voucher data: ", res.data);
                setData(res.data);
                setVoucherData(res.data);
            })
            .catch((err) => {
                console.log("Error voucher: ", err);
            })
        
        const userID =  await AsyncStorage.getItem("userId");
        const userID2 = parseInt(userID)
        // CALL API GET VOUCHER BY USER
        axios.get(`${BaseURL}/api/v1/voucher/user?userId=${userID2}`)
            .then((res) => {
                console.log("MY vouchcer data: ", res.data);
                setUserVoucher(res.data);
                setClaimed(res.data.reduce((_o,_c) => ({..._o,[_c.voucher.id]: true}), {}));
            })
            .catch((err) => {
                console.log("Error my voucher: ", err);
            })
    }, [])

    const VoucherCard = ({ item }) => {
        console.log("=====================================")
        console.log(claimed?.[item.id], item.id)
        // DELETE ITEM BY SWIPE LEFT
        const leftSwipe = (progress, dragX) => {
            const scale = dragX.interpolate({
                inputRange: [0, 100],
                outputRange: [0, 1],
                extrapolate: 'clamp',
            });
            return (
                <View style={{ flexDirection: 'row' }}>

                    <TouchableOpacity activeOpacity={0.6} style={{ marginLeft: 5, }}>
                        <View style={styles.deleteBox}>
                            <Animated.Text style={{ transform: [{ scale: scale }] }}>
                                <View>
                                    <Icon name='delete' size={40} color={COLORS.white} />
                                    <Text style={{ fontWeight: 'bold', color: COLORS.white }}>Delete</Text>
                                </View>
                            </Animated.Text>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        };
        // ====end====
        return (
            <Swipeable renderLeftActions={leftSwipe}>
                <View style={styles.voucherCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image style={{ height: 100, width: 100 }} source={{ uri: item.thumbnail }} />
                            <View style={{ marginLeft: 5, height: 80, justifyContent: 'space-around' }}>
                                <Text style={{ fontSize: 20, fontWeight: 600, width: 200 }}>{item.title}</Text>
                                <Text style={{ width: 180 }}>{item.description}</Text>
                            </View>
                        </View>
                        <View>
                            <View style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center' }}>
                                <Icon name='lock-clock' size={25} />
                                <Text style={{ marginLeft: 5, fontWeight: 'bold', width: 50, color: 5 == 1 ? 'red' : 'green' }}>{5} days</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    addItem(item.id);
                                    setClaimed(prev=>({...prev, [item.id]: true}));
                                }}
                            >
                                <View style={
                                    claimed?.[item.id] ? styles.claimBtnUnactive : styles.claimBtn
                                    // item.id==1 ? styles.claimBtnUnactive : styles.claimBtn
                                        
                                }>
                                    <Text style={{ fontSize: 15, color: COLORS.white, fontWeight: 'bold' }}>Claim</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </Swipeable>
        )
    }
    return (
        <SafeAreaView>
            <View style={styles.header}>
                <Icon name='arrow-back-ios' size={28} onPress={() => {
                    navigation.navigate('HomeScreen');
                    navigation.navigate('VoucherScreen');
                }} />
                <Text style={{ fontWeight: 'bold' }}>Hot vouchers</Text>
            </View>
            <View
                style={{
                    marginTop: 20,
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                }}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={{ flex: 1, fontSize: 18 }}
                        placeholder="Search voucher"
                        onChangeText={(text) => searchHandle(text)}
                    />
                </View>
                <View style={styles.sortBtn}>
                    <Icon name="search" size={28} color={COLORS.white} />
                </View>
            </View>
            <FlatList
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}

                data={voucherData}
                renderItem={({ item }) => <VoucherCard item={item} />}

                // footer
                ListFooterComponentStyle={{ marginBottom: 70, marginHorizontal: 10 }}
                ListFooterComponent={() => (
                    null
                )}
            />
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
        flex: 1,
        height: 50,
        borderRadius: 10,
        flexDirection: 'row',
        backgroundColor: COLORS.light,
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sortBtn: {
        width: 50,
        height: 50,
        marginLeft: 10,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteBox: {
        height: 100,
        width: 80,
        elevation: 15,
        borderRadius: 10,
        backgroundColor: 'black',
        marginVertical: 10,
        opacity: 0.8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    voucherCard: {
        marginBottom: 10,
        borderBottomColor: COLORS.dark,
        borderBottomWidth: 0.25,
        marginHorizontal: 10,
    },
    claimBtn: {
        backgroundColor: COLORS.primary,
        marginRight: 10,
        paddingHorizontal:10,
        paddingVertical: 10,
        borderRadius: 5
    },
    claimBtnUnactive: {
        backgroundColor: COLORS.grey,
        marginRight: 10,
        paddingHorizontal:10,
        paddingVertical: 10,
        borderRadius: 5,
    },
    
})

export default VoucherListScreen

