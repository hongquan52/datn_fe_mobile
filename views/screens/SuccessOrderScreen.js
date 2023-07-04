import React from "react";
import { Text,View, SafeAreaView, Image } from 'react-native'
import { PrimaryButton } from "../components/Button";
const SuccessOrderScreen = ({navigation}) => {
    
    return (
        <SafeAreaView style={{ backgroundColor: 'white' }}>
            
            <View style={{ justifyContent: "center", alignItems: "center", marginTop: 100, marginHorizontal: 10}}>
                <Image style={{height: 300, width: 300}} source={require('../../assets/success1.gif')} />
                <Text style={{fontSize: 20, fontWeight: "bold"}}>Place an order successfully</Text>
            </View>
            <View style={{marginHorizontal: 10, marginTop: 50}}>
                <PrimaryButton title={'Done'} onPress={() => navigation.navigate("HomeScreen")}/>
            </View>
        </SafeAreaView>
    )
}


export default SuccessOrderScreen;