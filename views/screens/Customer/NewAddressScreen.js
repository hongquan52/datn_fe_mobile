import React, {useState} from 'react'
import { View, Text } from 'react-native'
import { SafeAreaView, StyleSheet } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'
import COLORS from '../../../consts/colors'
import SelectBox from 'react-native-multi-selectbox'
import { PrimaryButton } from '../../components/Button'
import FormAddress from '../../components/FormAddress'

const NewAddressScreen = ({navigation}) => {

  return (
    <SafeAreaView>
        <View style={styles.header}>
            <Icon name='arrow-back-ios' size={28} onPress={navigation.goBack} />
            <Text style={{ fontWeight: 'bold' }}>New Address</Text>
        </View>
        
        <FormAddress navigation={navigation} />
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
    formContainer: {
        marginTop: 10,
    },
    inputContainer: {
        marginVertical: 20,

    }
})

export default NewAddressScreen;
