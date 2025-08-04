import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
  };

  return (
    <>
    {/* <SafeAreaView style={[styles.container, backgroundStyle]}> */}
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
       <View style={styles.content}>
        <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
          Welcome to React Native!
        </Text>
       </View>
    {/* </SafeAreaView> */}

    </>
      );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  
});

export default App;
