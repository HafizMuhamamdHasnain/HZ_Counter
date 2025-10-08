import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  // useEffect
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin, statusCodes, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';
import SystemSetting from "react-native-system-setting";


function Login() {


  const navigation = useNavigation<any>();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '270777183328-a84vkdvepi23nclgo6gha1amokremmdo.apps.googleusercontent.com',
      offlineAccess: false,
      forceCodeForRefreshToken: false,
    });
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };



  const handleLogin = () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    Alert.alert('Success', 'Logged in successfully!');
    navigation.navigate('Landing');
  };

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const result = await GoogleSignin.signIn();

      if (result.type !== 'success') {
        return;
      }

      const { idToken } = result.data;
      if (!idToken) {
        Alert.alert('Google Sign-In', 'No idToken returned');
        return;
      }
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      navigation.navigate('Landing');
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        return;
      }
      if (error.code === statusCodes.IN_PROGRESS) {
        return;
      }
      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Google Play Services', 'Not available or outdated');
        return;
      }
      Alert.alert('Google Sign-In Error', error?.message ?? 'Unknown error');
    }
  };



  return (
    <LinearGradient
      colors={['#0F4C3A', '#1a472a', '#2E8B57', '#32CD32']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.overlay} />
        <View style={styles.islamicPattern} />
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* <Image
            source={require('../../src/assets/counter-high-resolution-logo-transparent.png')}
          /> */}

          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <View style={styles.kalmaTop}>
                <Text style={styles.kalmaText}>لَا إِلَٰهَ إِلَّا ٱللَّٰهُ</Text>
              </View>
              <View style={styles.kalmaLeft}>
                <Text style={styles.kalmaTextVertical}>مُحَمَّدٌ</Text>
              </View>
              <Text style={styles.icon}>🕌</Text>
              <View style={styles.kalmaRight}>
                <Text style={styles.kalmaTextVertical}>رَسُولُ ٱللَّٰهِ</Text>
              </View>
              <View style={styles.kalmaBottom}>
                <Text style={styles.kalmaText}>مُحَمَّدٌ رَسُولُ ٱللَّٰهِ</Text>
              </View>
            </View>

            <Text style={styles.title}>مَرْحَبًا</Text>
            <Text style={styles.subtitle}>Welcome back to the community</Text>
          </View>

          <LinearGradient
            colors={['#fffbe6', '#f7e8ff', '#e0f7fa']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.formCard}
          >
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>بِسْمِ ٱللَّٰهِ</Text>
              <Text style={styles.formSubtitle}>Sign in to continue</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>📧 Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter email address"
                  value={formData.email}
                  onChangeText={value => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#bdc3c7"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>🔒 Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter password"
                    value={formData.password}
                    onChangeText={value => handleInputChange('password', value)}
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#bdc3c7"
                  />
                  <TouchableOpacity 
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Text style={styles.eyeText}>
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <LinearGradient
                colors={['#1a472a', '#32CD32']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.signInButton}
                // @ts-ignore
                onTouchEnd={handleLogin}
              >
                <Text style={styles.signInButtonText}>🕌 Sign In</Text>
              </LinearGradient>

              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity onPress={handleGoogleLogin} activeOpacity={0.85}>
                <LinearGradient
                  colors={['#b2f0ff', '#5ec6e7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.googleButton}
                >
                  <View style={styles.googleIconContainer}>
                    <Text style={styles.googleIcon}>G</Text>
                  </View>
                  <Text style={styles.googleButtonText}>Continue with Google</Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SingUp')}>
                  <Text style={styles.loginLink}>Create Account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  islamicPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(26, 71, 42, 0.05)',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica-Bold' : 'Roboto-Bold',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  subtitle: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica-Light' : 'Roboto-Light',
    fontWeight: '300',
    letterSpacing: 0.5,
    opacity: 0.9,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica-Medium' : 'Roboto-Medium',
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2c3e50',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'Roboto-Regular',
    fontWeight: '400',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2c3e50',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'Roboto-Regular',
    fontWeight: '400',
  },
  eyeButton: {
    padding: 8,
  },
  eyeText: {
    fontSize: 18,
  },
  signInButton: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    shadowColor: '#3498db',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  signInButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica-Bold' : 'Roboto-Bold',
    letterSpacing: 0.5,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: '#34495e',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'Roboto-Regular',
    fontWeight: '400',
  },
  loginLink: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica-Medium' : 'Roboto-Medium',
    letterSpacing: 0.2,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: 'rgba(255, 215, 0, 0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
  },
  kalmaTop: {
    position: 'absolute',
    top: 5,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  kalmaBottom: {
    position: 'absolute',
    bottom: 5,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  kalmaLeft: {
    position: 'absolute',
    left: 5,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kalmaRight: {
    position: 'absolute',
    right: 5,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kalmaText: {
    fontSize: 9,
    color: 'rgba(255, 215, 0, 0.9)',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'Roboto-Regular',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 11,
    writingDirection: 'rtl',
  },
  kalmaTextVertical: {
    fontSize: 8,
    color: 'rgba(255, 215, 0, 0.9)',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'Roboto-Regular',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 10,
    writingDirection: 'rtl',
  },
  icon: {
    fontSize: 40,
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 25,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 25,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica-Bold' : 'Roboto-Bold',
    marginBottom: 5,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  formSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'Roboto-Regular',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#2c3e50',
  },
  dividerText: {
    marginHorizontal: 15,
    fontSize: 20,
    color: '#7f8c8d',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'Roboto-Regular',
    fontWeight: '500',
  },
  googleButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dadce0',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285f4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  googleIcon: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica-Bold' : 'Roboto-Bold',
  },
  googleButtonText: {
    color: '#3c4043',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica-Medium' : 'Roboto-Medium',
    letterSpacing: 0.3,
  },
});
