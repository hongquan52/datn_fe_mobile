import React, { cloneElement } from "react";
import { Text, StyleSheet, View, Image } from "react-native";
import { SafeAreaView } from "react-native";
import COLORS from '../../consts/colors';
import {PrimaryButton} from "../components/Button";

const OnBoardScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <View style={{ height: 400 }}>
            <Image style={{
                width: '100%',
                resizeMode: 'contain',
                top: -150
            }} 
            source={require('../../assets/pc-gamer-gaming-logo-mouse-pad.jpg')} />
        </View>
        <View style={style.textContainer}>
            <View>
                <Text
                    style={{
                        fontSize: 32,
                        fontWeight:'bold',
                        textAlign: 'center',
                        
                    }}
                >QL Shop</Text>
                <Text
                    style={{
                        fontSize: 18,
                        marginTop: 20,
                        textAlign: 'center',
                        color: COLORS.grey,
                    }}
                > Luôn mang đến cho khách hàng sự yên tâm</Text>
            </View>
            <View style={style.indicatorContainer}>
                    <View style={style.currentIndicator}></View>
                    <View style={style.indicator}></View>
                    <View style={style.indicator}></View>
            </View>
            <PrimaryButton 
                onPress={() => navigation.navigate('LoginScreen')}
                title={"Khám phá ngay"}
            />
            
        </View>
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
    textContainer: {
        flex: 1,
        paddingHorizontal:50,
        justifyContent: 'space-between',
        paddingBottom: 40,
    },
    indicatorContainer: {
        height: 50,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    currentIndicator: {
        height: 12,
        width: 30,
        borderRadius: 10,
        backgroundColor: COLORS.primary,
        marginHorizontal: 5,
    },
    indicator: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: COLORS.grey,
        marginHorizontal: 5,
    }
})

export default OnBoardScreen