import React, {useState} from "react";
import COLORS from "../../../consts/colors";
import Icon from 'react-native-vector-icons/FontAwesome5'
import Icons from 'react-native-vector-icons/MaterialIcons'
import { StyleSheet, View, SafeAreaView, Text, Image } from 'react-native'

import { PrimaryButton } from "../../components/Button";

const SuccessOrder = ({navigation, route}) => {
    
    return (
        <SafeAreaView style={{backgroundColor: COLORS.white, height: '100%'}}>
            
            <View style={{ justifyContent: "center", alignItems: "center", marginTop: 150, marginHorizontal: 10 }}>
                <Text style={{fontSize: 20}}>Place an order successfully</Text>
                <Image
                   source={{uri: 'https://semisearch.in/site-assets/images/no-cart.gif'}}
                   style={{width: 300, height: 300}} 
                />
            </View>
            <View style={{marginHorizontal: 10, marginTop: 100}}>
                <PrimaryButton title={'DONE'} onPress={() => navigation.navigate('HomeScreen')}/>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    
})

export default SuccessOrder;