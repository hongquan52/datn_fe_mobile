import React from "react";
import { Text,View, SafeAreaView, Image } from 'react-native'
import { PrimaryButton } from "../../components/Button";
const ChangePassSucess = ({navigation}) => {
    
    return (
        <SafeAreaView style={{ backgroundColor: 'white' }}>
            
            <View style={{ justifyContent: "center", alignItems: "center", marginTop: 100, marginHorizontal: 10}}>
                <Image style={{height: 300, width: 300}} source={require('../../../assets/pass_reset.gif')} />
                <Text style={{fontSize: 20, fontWeight: "bold"}}>The password has been changed</Text>
            </View>
            <View style={{marginHorizontal: 10, marginTop: 50}}>
                <PrimaryButton title={'Done'} onPress={() => navigation.navigate("CustomerInfoScreen")}/>
            </View>
        </SafeAreaView>
    )
}


export default ChangePassSucess;