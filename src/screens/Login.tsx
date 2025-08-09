import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

function Login() {
  return (
    <View style={[styles.main]}>
      <Text style={[styles.text]}>HELLO WORLD</Text>
    </View>
  )
}

export default Login;




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