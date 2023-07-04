import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { FlatList, Swipeable } from 'react-native-gesture-handler'
import { Animated, Dimensions } from 'react-native'

import Icon from 'react-native-vector-icons/MaterialIcons'

import listVoucher from '../../../consts/vouchers'
import COLORS from '../../../consts/colors'
import { PrimaryButton } from '../../components/Button'
import { useEffect } from 'react'
import axios from 'axios'
import { BaseURL } from '../../../consts/BaseURL'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useState } from 'react'
import {
    LayoutAnimation,
    UIManager,
    Platform,
} from 'react-native'

const { width } = Dimensions.get('window');
const layoutAnimConfig = {
    duration: 300,
    update: {
        type: LayoutAnimation.Types.easeInEaseOut,
    },
    delete: {
        duration: 100,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
    },
};

if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const VoucherScreen = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState('');

    //const [searchTerm, setSearchTerm] = useState('');

    // SEARCH VOUCHER
    useEffect(() => {
        const searchedProduct = data.filter((item) => {
            if (searchText === '')
                return item;
            if (item.voucher.title.toLowerCase().includes(searchText.toLowerCase()))
                return item;
        })
        setData(searchedProduct);
    }, [searchText])
    // DELETE HANDLE
    const removeItem = async (id) => {
        const userID = await AsyncStorage.getItem("userId");
        const userID2 = parseInt(userID)
        let arr = data.filter(function (item) {
            return item.voucher.id !== id
        })

        setData(arr);

        // CALL API REMOVE VOUCHER MY VOUCHER
        axios.delete(`${BaseURL}/api/v1/voucher/user?userId=${userID2}&voucherId=${id}`)
            .then((res) => {
                console.log("Delete voucher res: ", res.data.message);
            })
            .catch((err) => {
                console.log("Error delete voucher: ", err);
            })

        LayoutAnimation.configureNext(layoutAnimConfig)
    };

    useEffect(async () => {
        const userID = await AsyncStorage.getItem("userId");
        const userID2 = parseInt(userID)
        console.log("const userID: ", typeof (userID), userID)
        console.log("const userID2: ", typeof (userID2), userID2)

        // CALL API GET VOUCHER BY USER
        axios.get(`${BaseURL}/api/v1/voucher/user?userId=${userID2}`)
            .then((res) => {
                console.log("MY vouchcer data: ", res.data);
                setData(res.data);
            })
            .catch((err) => {
                console.log("Error my voucher: ", err);
            })
    }, [])

    // NOVOUCHER COMPONENT
    const NOVoucher = () => {
        return (
            <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={{uri: 'https://cdn3d.iconscout.com/3d/premium/thumb/empty-box-6219421-5102419.png'}}
                    style={{ height: 100, width: 100, marginVertical: 20 }} />
                <Text>Bạn chưa có mã giảm giá.</Text>
            </View>
        );
    }

    // VOUCHER CARD COMPONENT
    const VoucherCard = ({ item }) => {

        // delete item by swipe left
        const leftSwipe = (progress, dragX) => {
            const scale = dragX.interpolate({
                inputRange: [0, 100],
                outputRange: [0, 1],
                extrapolate: 'clamp',
            });
            return (
                <View style={{ flexDirection: 'row' }}>

                    <TouchableOpacity activeOpacity={0.6} style={{ marginLeft: 5 }}
                        onPress={() => removeItem(item.voucher.id)}
                    >
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
                            <Image style={{ height: 100, width: 100 }} source={{ uri: item.voucher.thumbnail }} />
                            <View style={{ marginLeft: 5, height: 80, justifyContent: 'space-around' }}>
                                <Text style={{ fontSize: 20, fontWeight: 600, width: 200 }}>{item.voucher.title}</Text>
                                <Text style={{ width: 180 }}>{item.voucher.description}</Text>
                            </View>
                        </View>
                        <Icon name='lock-clock' size={25} />
                        <Text style={{ fontWeight: 'bold', width: 50, color: item.expire == 1 ? 'red' : 'green' }}>{item.expire} days</Text>
                    </View>
                </View>
            </Swipeable>
        )
    }
    return (
        <SafeAreaView>
            <View style={styles.header}>
                <Icon name='arrow-back-ios' size={28} onPress={navigation.goBack} />
                <Text style={{ fontWeight: 'bold' }}>My voucher</Text>
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
                        onChangeText={(text) => setSearchText(text)}
                        
                    />
                </View>
                <View style={styles.sortBtn}>
                    <Icon name="search" size={28} color={COLORS.white} />
                </View>
            </View>
            {data.status === "BAD_REQUEST" && <NOVoucher />}
            <FlatList
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}

                data={data}
                renderItem={({ item }) => {
                    return (
                        <VoucherCard item={item} />
                    );
                }}

                // footer
                ListFooterComponentStyle={{ marginBottom: 100, marginHorizontal: 10 }}
                ListFooterComponent={() => (
                    <PrimaryButton title={"Take more vouchers"} onPress={() => navigation.navigate("VoucherListScreen")} />
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

})

export default VoucherScreen

