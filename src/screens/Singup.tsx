import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

function SingUp() {
  return (
    <View style={[styles.main]}>
      <Text style={[styles.text]}>SINGUP PAGE </Text>
    </View>
  )
}

export default SingUp;




const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'yellow'
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 6,
    padding: 10,
    backgroundColor: 'black'

  }
})