import React, { useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  Text,
} from "react-native";
import COLORS from "../../consts/colors";
import DropDownPicker from "react-native-dropdown-picker";
import { useForm, Controller, set } from 'react-hook-form';
import { SecondaryButton } from "../components/Button";
import axios from "axios";
import { BaseURL } from "../../consts/BaseURL";
import { useNavigation } from "@react-navigation/native";

const FormAddress = ({navigation}) => {
  const [id, setId] = useState();

  // ADDRESS STATE:
  const [provinceList, setProvinceList] = useState();

  // Alert
  const createOneButtonAlert = () =>
    Alert.alert('Thông báo', 'Create new address successfully', [
      {
        text: 'OK',
        onPress: () => {
          navigation.navigate('HomeScreen')
          navigation.navigate('AddressScreen');
        }
    },
    ]);
  // HANDLE FILTER DISTRICT BY PROVINCE
  const handleDistrict = () => {
    const districtFilter = district.filter((dis) => {
      return dis.provinceId === provinceValue;
    })
    setDistrict(districtFilter);
  }
  // PROVINCE
  const [provinceOpen, setProvinceOpen] = useState(false);
  const [provinceValue, setProvinceValue] = useState(null);
  const [province, setProvince] = useState([]);
  
  // DISTRICT
  const [districtOpen, setDistrictOpen] = useState(false);
  const [districtValue, setDistrictValue] = useState(null);
  const [district, setDistrict] = useState([]);
  // DISTRICT
  const [wardOpen, setWardOpen] = useState(false);
  const [wardValue, setWardValue] = useState(null);
  const [ward, setWard] = useState([]);
  // SET OPEN
  const onprovinceOpen = useCallback(() => {
    setDistrictOpen(false);
    setWardOpen(false);
  }, []);

  const ondistrictOpen = useCallback(() => {
    setProvinceOpen(false);
    setWardOpen(false);
  }, []);
  const onwardOpen = useCallback(() => {
    setProvinceOpen(false);
    setDistrictOpen(false);
  }, []);
  // SUBMIT FUNCTION
  const { handleSubmit, control } = useForm();
  const onSubmit = (data) => {
    
    // API
    var dataForm = new FormData();
    dataForm.append('apartmentNumber', data.apartmentNumber);
    dataForm.append('ward', data.ward);
    dataForm.append('district', data.district);
    dataForm.append('province', data.province);
    dataForm.append('defaultAddress', '0');

    axios.post(`${BaseURL}/api/v1/address/user?userId=${id}`, dataForm)
      .then((res) => {
        console.log("Response: ", res.data);
      })
      .catch((err) => {
        console.log("Create address error: ", err)
      })
      createOneButtonAlert();
    
  };
  useEffect( async() => {
    const userID = await  AsyncStorage.getItem("userId");
    const userID2 = parseInt(userID)
    console.log("const userID: ", typeof(userID), userID)
    console.log("const userID2: ", typeof(userID2), userID2)

    setId(userID2);

    
    // GET PROVINCE
    axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/province',
    {
      headers: {
        'token': '466cdca6-febd-11ed-a967-deea53ba3605'
    }}
    )
      .then((res) => {
        console.log("Response province: ", res.data.data.length);
        setProvinceList(res.data.data);

        var pickerProvinces = []
    
        res.data.data.forEach(item => {
          pickerProvinces.push({
                              label: item.ProvinceName,
                              value: item.ProvinceName,
                              value: item.ProvinceID,
                      })
                });
        setProvince(pickerProvinces);
      })
      .catch((err) => {
        console.log("Error province: ", err);
      })
      

      //DISTRICT

  }, []);

  useEffect(() => {
    
    axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceValue}`,
      {
        headers: {
          'token': '466cdca6-febd-11ed-a967-deea53ba3605',
          'Content-Type': 'application/json'
      }}
      )
        .then((res) => {
          console.log("Response district: ", res.data.data.length);
          var pickersDistrict = []
    
          res.data.data.forEach(item => {
            pickersDistrict.push({
                                label: item.DistrictName,
                                value: item.DistrictID,
                        })
                  });
          setDistrict(pickersDistrict);
        })
        .catch((err) => {
          console.log("Error district response: ", err);
        }) 
  }, [provinceValue])

  useEffect(() => {
    
    axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtValue}`,
    {
      headers: {
        'token': '466cdca6-febd-11ed-a967-deea53ba3605',
        'Content-Type': 'application/json'
    }}
    )
      .then((res) => {
        console.log("Response district: ", res.data.data.length);
        var pickersWard = []
  
        res.data.data.forEach(item => {
          pickersWard.push({
                              label: item.WardName,
                              value: item.WardCode,
                      })
                });
        setWard(pickersWard);
      })
      .catch((err) => {
        console.log("Error district response: ", err);
      }) 
  }, [districtValue])
  

  return (
    <SafeAreaView style={{}}>
      <View style={styles.container}>
        <View style={{width: 223}}>
          <View style={{position: "absolute", zIndex: 3}}>
            <Text style={styles.label}>Province</Text>
            <Controller
              name="province"
              defaultValue=""
              control={control}
              render={({ field: { onChange, value } }) => (
                <View style={styles.dropdownprovince}>
                  <DropDownPicker
                    
                    open={provinceOpen}
                    value={provinceValue}
                    items={province}
                    setOpen={setProvinceOpen}
                    setValue={setProvinceValue}
                    setItems={setProvince}
                    placeholder="Choose province"
                    placeholderStyle={styles.placeholderStyles}
                    onOpen={onprovinceOpen}
                    onChangeValue={onChange}
                    
                  />
                </View>
              )}
            />
          </View>
          <View style={{position: "absolute", top: 80, zIndex: 2}}>
            <Text style={styles.label}>District</Text>
            <Controller
              name="district"
              defaultValue=""
              control={control}
              render={({ field: { onChange, value } }) => (
                <View style={styles.dropdownprovince}>
                  <DropDownPicker
                    style={styles.dropdown}
                    open={districtOpen}
                    value={districtValue}
                    items={district}
                    setOpen={setDistrictOpen}
                    setValue={setDistrictValue}
                    setItems={setDistrict}
                    // setItems={handleDistrict}
                    placeholder="Choose district"
                    placeholderStyle={styles.placeholderStyles}
                    onOpen={ondistrictOpen}
                    onChangeValue={onChange}

                  />
                </View>
              )}
            />
          </View>
          <View style={{position: "absolute", top: 160, zIndex: 1}}>
            <Text style={styles.label}>Ward</Text>
            <Controller
              name="ward"
              defaultValue=""
              control={control}
              render={({ field: { onChange, value } }) => (
                <View style={styles.dropdownprovince}>
                  <DropDownPicker
                    style={styles.dropdown}
                    open={wardOpen}
                    value={wardValue}
                    items={ward}
                    setOpen={setWardOpen}
                    setValue={setWardValue}
                    setItems={setWard}
                    placeholder="Choose ward"
                    placeholderStyle={styles.placeholderStyles}
                    onOpen={onwardOpen}
                    onChangeValue={onChange}

                  />
                </View>
              )}
            />
          </View>
            
          <Text style={styles.labelApartmentNumber}>Apartment Number</Text>
          <Controller
            name="apartmentNumber"
            defaultValue=""
            control={control}
            render={({ field: { value, onChange } }) => (
              <TextInput
                    style={styles.inputApartmentNumber}
                    selectionColor={"#5188E3"}
                    onChangeText={onChange}
                    value={value}
              />
            )}
          />
        </View>
        <View style={{marginTop: 100}}>
          <SecondaryButton
              onPress={handleSubmit(onSubmit)}
              title={"Save"}
            />
          </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginTop: 20,

  },
  input: {
    borderStyle: "solid",
    borderColor: "#B7B7B7",
    borderRadius: 7,
    borderWidth: 1,
    fontSize: 15,
    height: 50,
    paddingStart: 10,
    marginBottom: 15,
  },
  inputApartmentNumber: {
    borderStyle: "solid",
    borderColor: "#B7B7B7",
    borderRadius: 7,
    borderWidth: 1,
    fontSize: 15,
    height: 50,
    paddingStart: 10,
    marginBottom: 15,
    width: 394
  },
  label: {
    marginBottom: 7,
    marginStart: 10,
    color: COLORS.dark,
  },
  labelApartmentNumber: {
    marginBottom: 7,
    marginStart: 10,
    color: COLORS.dark,
    marginTop: 250,
    
  }
})

export default FormAddress