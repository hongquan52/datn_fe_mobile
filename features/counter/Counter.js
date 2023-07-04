import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment, incrementByAmount } from './counterSlice'
import { View, Button, Text, SafeAreaView } from 'react-native'

const  Counter = () => {
  const count = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <SafeAreaView >
      <View style={{marginTop: 100}}>
        <Button
          title="Increment value"
          onPress={() => dispatch(increment())}
        >
          Increment
        </Button>
        <Text>{count}</Text>
        <Button
          title="Decrement value"
          onPress={() => dispatch(decrement())}
        >
          Decrement
        </Button>
        <Button
          title="Decrement value"
          onPress={() => dispatch(incrementByAmount())}
        >
          Decrement
        </Button>
      </View>
    </SafeAreaView>
  )
}
export default Counter