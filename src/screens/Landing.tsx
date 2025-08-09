import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

function Landing() {
    return (
        <View style={[styles.main]}>

            {/* <Text style={[styles.text]}>LANDING PAGE </Text> */}
        </View>

    )
}

const styles = StyleSheet.create({

    main: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'purple'
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

export default Landing;