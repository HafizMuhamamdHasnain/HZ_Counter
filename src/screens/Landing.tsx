import { StyleSheet, Text, TouchableOpacity, View, Animated, useColorScheme, Dimensions, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'

function Landing() {
    const navigation = useNavigation<any>()
    const [count, setCount] = useState(0)
    const [borderColorIndex, setBorderColorIndex] = useState(0)
    const [screenData, setScreenData] = useState(Dimensions.get('window'))
    const isDarkMode = useColorScheme() === 'dark'
    const scaleAnim = useRef(new Animated.Value(1)).current
    const fadeAnim = useRef(new Animated.Value(0)).current
    const slideAnim = useRef(new Animated.Value(50)).current
    const rotateAnim = useRef(new Animated.Value(0)).current
    const glowRotateAnim = useRef(new Animated.Value(0)).current

    // Array of Islamic-themed border colors that cycle through
    const borderColors = [
        '#ffd700', // Gold
        '#1a472a', // Islamic Green
        '#8B4513', // Brown
        '#DAA520', // Goldenrod
        '#228B22', // Forest Green
        '#B8860B', // Dark Goldenrod
        '#006400', // Dark Green
        '#FFD700', // Gold
        '#32CD32', // Lime Green
        '#9ACD32', // Yellow Green
        '#ADFF2F', // Green Yellow
        '#7CFC00', // Lawn Green
    ]

    useEffect(() => {
        // Listen for orientation changes
        const onChange = (result: any) => {
            setScreenData(result.window)
        }

        const subscription = Dimensions.addEventListener('change', onChange)

        // Initial animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            })
        ]).start()

        // Continuous rotation animations
        const startRotationAnimations = () => {
            // Reset animation values
            glowRotateAnim.setValue(0)

            // Only rotate the outer glow ring
            Animated.loop(
                Animated.timing(glowRotateAnim, {
                    toValue: 1,
                    duration: 4000, // 4 seconds for full rotation (slightly slower for elegance)
                    useNativeDriver: true,
                }),
                { resetBeforeIteration: true }
            ).start()
        }

        startRotationAnimations()

        return () => subscription?.remove()
    }, [])

    const animateCounter = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 1.1,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            })
        ]).start()
    }

    const increment = () => {
        setCount(count + 1)
        // Cycle to next border color
        setBorderColorIndex((borderColorIndex + 1) % borderColors.length)
        animateCounter()
    }

    const decrement = () => {
        setCount(count - 1)
        animateCounter()
    }

    const reset = () => {
        setCount(0)
        // Reset border color to initial gold
        setBorderColorIndex(0)
        animateCounter()
    }

    // Interpolate rotation values for outer glow ring only
    const glowRotateInterpolate = glowRotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    })

    // Responsive calculations
    const { width, height } = screenData
    const isLandscape = width > height
    const minDimension = Math.min(width, height)

    // Calculate responsive sizes
    const counterSize = Math.max(minDimension * 0.4, 150)
    const glowSize = counterSize + 60
    const buttonSize = Math.max(minDimension * 0.15, 60)

    // Dynamic styles with proper calculations
    const dynamicStyles = {
        mainContainer: {
            paddingHorizontal: width * 0.05,
            paddingVertical: isLandscape ? height * 0.02 : height * 0.05,
            justifyContent: isLandscape ? 'space-around' : 'center',
        },
        title: {
            fontSize: Math.max(minDimension * 0.06, 20),
            marginBottom: isLandscape ? 15 : 30,
        },
        counterContainer: {
            width: glowSize,
            height: glowSize,
            marginBottom: isLandscape ? 15 : 40,
            alignSelf: 'center' as const,
        },
        glowRing: {
            width: glowSize,
            height: glowSize,
        },
        counter: {
            width: counterSize,
            height: counterSize,
            top: (glowSize - counterSize) / 2,
            left: (glowSize - counterSize) / 2,
        },
        counterText: {
            fontSize: Math.max(counterSize * 0.25, 24),
        },
        buttonContainer: {
            marginBottom: isLandscape ? 10 : 30,
            paddingHorizontal: width * 0.05,
            flexDirection: 'row' as const,
            justifyContent: 'space-around' as const,
            alignItems: 'center' as const,
            width: '100%',
        },
        button: {
            width: buttonSize,
            height: buttonSize,
            borderRadius: buttonSize / 2,
        },
        resetButton: {
            width: buttonSize * 1.4,
            height: buttonSize,
            borderRadius: buttonSize / 2,
        },
        buttonText: {
            fontSize: Math.max(buttonSize * 0.3, 16),
        },
        infoContainer: {
            marginTop: isLandscape ? 10 : 20,
            paddingHorizontal: width * 0.05,
            alignItems: 'center' as const,
            flexDirection: isLandscape ? 'row' as const : 'row' as const,
            justifyContent: 'center' as const,
            gap: isLandscape ? 15 : 20,
        },
        navigationContainer: {
            marginTop: isLandscape ? 15 : 30,
            paddingHorizontal: width * 0.05,
            flexDirection: isLandscape ? 'row' as const : 'row' as const,
            justifyContent: 'center' as const,
            gap: isLandscape ? 10 : 15,
        },
        infoItem: {
            minWidth: isLandscape ? 100 : 120,
            maxWidth: isLandscape ? 140 : 160,
            flex: 1,
        },
    }

    return (
        <KeyboardAvoidingView
            style={styles.main}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.overlay} />
            <View style={styles.islamicPattern} />
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
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
                    <Text style={styles.title}>ٱلسَّلَامُ عَلَيْكُمْ</Text>
                    <Text style={styles.subtitle}>Welcome to our blessed community</Text>
                </View>

                <View style={styles.formCard}>
                    <View style={styles.formHeader}>
                        <Text style={styles.formTitle}>بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</Text>
                    </View>

                    <View style={styles.counterWrapper}>
                        <Animated.View
                            style={[
                                styles.counterContainer,
                                dynamicStyles.counterContainer,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }, { scale: scaleAnim }]
                                }
                            ]}
                        >
                            {/* Outer glow ring with rotation */}
                            <Animated.View style={[
                                styles.glowRing,
                                dynamicStyles.glowRing,
                                {
                                    borderColor: borderColors[borderColorIndex],
                                    transform: [{ rotate: glowRotateInterpolate }]
                                }
                            ]} />

                            {/* Main counter - now stationary */}
                            <View style={[
                                styles.counter,
                                dynamicStyles.counter,
                                {
                                    borderColor: borderColors[borderColorIndex]
                                }
                            ]}>
                                {/* Inner gradient background */}
                                <View style={styles.innerHex}>
                                    <Text style={[styles.counterText, dynamicStyles.counterText]}>
                                        {count}
                                    </Text>
                                </View>

                                {/* Corner accents */}
                                <View style={[styles.cornerAccent, styles.topLeft, { backgroundColor: borderColors[borderColorIndex] }]} />
                                <View style={[styles.cornerAccent, styles.topRight, { backgroundColor: borderColors[borderColorIndex] }]} />
                                <View style={[styles.cornerAccent, styles.bottomLeft, { backgroundColor: borderColors[borderColorIndex] }]} />
                                <View style={[styles.cornerAccent, styles.bottomRight, { backgroundColor: borderColors[borderColorIndex] }]} />
                            </View>
                        </Animated.View>
                    </View>

                    <View style={[styles.buttonContainer, dynamicStyles.buttonContainer]}>
                        <TouchableOpacity
                            style={[styles.button, styles.decrementButton, dynamicStyles.button]}
                            onPress={decrement}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.buttonText, dynamicStyles.buttonText]}>−</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.resetButton, dynamicStyles.resetButton]}
                            onPress={reset}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.buttonText, styles.resetButtonText, dynamicStyles.buttonText]}>Reset</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.incrementButton, dynamicStyles.button]}
                            onPress={increment}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.buttonText, dynamicStyles.buttonText]}>+</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.infoContainer, dynamicStyles.infoContainer]}>
                        <View style={[styles.infoItem, dynamicStyles.infoItem]}>
                            <Text style={styles.infoLabel}>Current Value</Text>
                            <Text style={styles.infoValue}>{count}</Text>
                        </View>
                        <View style={[styles.infoItem, dynamicStyles.infoItem]}>
                            <Text style={styles.infoLabel}>Status</Text>
                            <Text style={styles.infoValue}>
                                {count === 0 ? 'Zero' : count > 0 ? 'Positive' : 'Negative'}
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.navigationContainer, dynamicStyles.navigationContainer]}>
                        <TouchableOpacity
                            style={styles.navButton}
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text style={styles.navButtonText}>🕌 SignUp  In </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.navButton}
                            onPress={() => navigation.navigate('SingUp')}
                        >
                            <Text style={styles.navButtonText}>📝 Create Account</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}



const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#1a472a', // Islamic green
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    islamicPattern: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(26, 71, 42, 0.1)',
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
    counterContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    glowRing: {
        position: 'absolute',
        top: 0,
        left: 0,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#ffd700',
        opacity: 0.3,
        transform: [{ rotate: '45deg' }],
    },
    counter: {
        position: 'absolute',
        top: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderWidth: 4,
        borderColor: '#ffd700',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.4,
        shadowRadius: 30,
        elevation: 25,
        overflow: 'visible',
    },
    innerHex: {
        width: '85%',
        height: '85%',
        borderRadius: 20,
        backgroundColor: 'rgba(26, 71, 42, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 215, 0, 0.3)',
    },
    cornerAccent: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderRadius: 6,
        opacity: 0.8,
    },
    topLeft: {
        top: 15,
        left: 15,
    },
    topRight: {
        top: 15,
        right: 15,
    },
    bottomLeft: {
        bottom: 15,
        left: 15,
    },
    bottomRight: {
        bottom: 15,
        right: 15,
    },
    counterText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#1a472a',
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    incrementButton: {
        backgroundColor: '#4CAF50',
    },
    decrementButton: {
        backgroundColor: '#f44336',
    },
    resetButton: {
        backgroundColor: '#ff9800',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    resetButtonText: {
        fontSize: 16,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
        gap: 20,
    },
    infoItem: {
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 15,
        paddingHorizontal: 16,
        borderRadius: 15,
        borderWidth: 2,
        // borderColor: 'rgba(255, 215, 0, 0.6)',
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 4 },
        // shadowOpacity: 0.2,
        // shadowRadius: 8,
        // elevation: 5,
    },
    infoLabel: {
        color: '#2c3e50',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 5,
        opacity: 0.9,
    },
    infoValue: {
        color: '#1a472a',
        fontSize: 18,
        fontWeight: 'bold',
    },
    // Islamic theme styles
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
        backgroundColor: 'lightgrey',
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
    
    counterWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        paddingHorizontal: 20,
        gap: 15,
    },
    navButton: {
        backgroundColor: '#3498db',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#3498db',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        flex: 1,
        minHeight: 48,
    },
    navButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
        fontFamily: Platform.OS === 'ios' ? 'Helvetica-Bold' : 'Roboto-Bold',
        letterSpacing: 0.5,
        textAlign: 'center',
    },
})

export default Landing;