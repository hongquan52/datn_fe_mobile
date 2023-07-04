import * as React from 'react';
import { View, useWindowDimensions, StyleSheet, Text, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icons from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../../consts/colors';
import { FlatList } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import axios from 'axios';
import { BaseURL } from '../../consts/BaseURL';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { Rating } from 'react-native-elements';
const stars = [
    {
        star: 5
    },
    {
        star: 4
    },
    {
        star: 3
    },
    {
        star: 2
    },
    {
        star: 1
    },
]

const ReviewProductScreen = ({ navigation, route }) => {
    const productID = route.params;

    // REVIEW DATA
    const [star, setStar] = useState(5);
    const [reviewList, setReviewList] = useState([]);
    const [reviewListOriginal, setReviewListOriginal] = useState([]);

    const setStarFilter = (star) => {
        setReviewList([...reviewListOriginal.filter(item => item.vote === star)]);
        setStar(star);
    }


    useEffect(async () => {
        // GET REVIEW BY PRODUCT ID
        axios.get(`${BaseURL}/api/v1/review/product?productId=${productID}`)
            .then((res) => {
                let x = res.data.list.filter(
                    (item) => item.vote === 5
                )
                setReviewList(x);
                setReviewListOriginal(res.data.list);
            })
            .catch((err) => console.log(err))
    }, [])

    const renderItem = ({ item, index }) => {
        return (
            <View key={index} style={styles.itemContainer}>
                <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>{item.userName}</Text>
                <Rating
                    imageSize={16}
                    style={{ marginVertical: 5 }}
                    readonly
                    startingValue={item.vote}
                />
                <Text style={{marginLeft: 10}}>{item.content}</Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Icons name='arrow-back-ios' size={28} onPress={navigation.goBack} />
                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Review product</Text>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={true}
                contentContainerStyle={styles.scrollContainer}

            >

                {stars.map(e => (
                    <TouchableOpacity
                        style={[styles.btnTab, star === e.star && styles.btnTabActive]}
                        onPress={() => setStarFilter(e.star)}
                    >
                        <Text style={{ fontSize: 20, color: star === e.star ? 'white' : 'black' }}>{e.star} <Icons name='star-rate' size={20} /></Text>
                    </TouchableOpacity>
                ))}

            </ScrollView>
            
            <FlatList
                data={reviewList}
                keyExtractor={(e, i) => i.toString()}
                renderItem={renderItem}
            />
        </SafeAreaView>
    )
}

export default ReviewProductScreen;

const styles = StyleSheet.create({
    header: {
        paddingVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
    },
    container: {
        flex: 1,
        paddingHorizontal: 10,
        justifyContent: 'center',
    },

    listTab: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: COLORS.grey,
        height: 100,
    },
    btnTab: {
        flexDirection: 'row',
        // width: Dimensions.get('window').width / 4,
        width: 125,
        borderWidth: 0.5,
        borderColor: COLORS.white,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        backgroundColor: COLORS.light
    },
    btnTabActive: {
        backgroundColor: COLORS.primary,
    },
    itemContainer: {
        marginHorizontal: 10,
        paddingVertical: 15,
        backgroundColor: COLORS.light,
        marginVertical: 5,
        borderRadius: 20,
        height: 130,
    },
    scrollContainer: {

    }
})