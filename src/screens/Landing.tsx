import { StyleSheet, Text, TouchableOpacity, View, Animated, useColorScheme, Dimensions } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'

function Landing() {
    const [count, setCount] = useState(0)
    const [borderColorIndex, setBorderColorIndex] = useState(0)
    const [screenData, setScreenData] = useState(Dimensions.get('window'))
    const isDarkMode = useColorScheme() === 'dark'
    const scaleAnim = useRef(new Animated.Value(1)).current
    const fadeAnim = useRef(new Animated.Value(0)).current
    const slideAnim = useRef(new Animated.Value(50)).current
    const rotateAnim = useRef(new Animated.Value(0)).current
    const glowRotateAnim = useRef(new Animated.Value(0)).current

    // Array of beautiful border colors that cycle through
    const borderColors = [
        '#ffd700', // Gold
        '#ff6b6b', // Red
        '#4ecdc4', // Teal
        '#45b7d1', // Blue
        '#96ceb4', // Green
        '#ffeaa7', // Yellow
        '#fd79a8', // Pink
        '#fdcb6e', // Orange
        '#6c5ce7', // Purple
        '#a29bfe', // Light Purple
        '#fd79a8', // Hot Pink
        '#00b894', // Emerald
    ]

    useEffect(() => {
        // Listen for orientation changes
        const onChange = (result) => {
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
            flexDirection: isLandscape ? 'row' : 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
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
            paddingHorizontal: width * 0.1,
        },
    }

    return (
        <View style={[styles.main, isDarkMode && styles.mainDark]}>
            <Animated.View
                style={[
                    styles.container,
                    dynamicStyles.mainContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }]
                    }
                ]}
            >
                <Text style={[styles.title, isDarkMode && styles.titleDark, dynamicStyles.title]}>
                    Counter
                </Text>

                <Animated.View
                    style={[
                        styles.counterContainer,
                        dynamicStyles.counterContainer,
                        { transform: [{ scale: scaleAnim }] }
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
                        isDarkMode && styles.counterDark,
                        {
                            borderColor: borderColors[borderColorIndex]
                        }
                    ]}>
                        {/* Inner gradient background */}
                        <View style={[styles.innerHex, isDarkMode && styles.innerHexDark]}>
                            <Text style={[styles.counterText, isDarkMode && styles.counterTextDark, dynamicStyles.counterText]}>
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
                    <View style={styles.infoItem}>
                        <Text style={[styles.infoLabel, isDarkMode && styles.infoLabelDark]}>Current Value</Text>
                        <Text style={[styles.infoValue, isDarkMode && styles.infoValueDark]}>{count}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={[styles.infoLabel, isDarkMode && styles.infoLabelDark]}>Status</Text>
                        <Text style={[styles.infoValue, isDarkMode && styles.infoValueDark]}>
                            {count === 0 ? 'Zero' : count > 0 ? 'Positive' : 'Negative'}
                        </Text>
                    </View>
                </View>
            </Animated.View>
        </View>
    )
}



const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#667eea',
    },
    mainDark: {
        backgroundColor: '#1a1a2e',
    },
    container: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 30,
        textAlign: 'center',
        letterSpacing: 3,
        textTransform: 'uppercase',
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 0, height: 3 },
        textShadowRadius: 6,
        opacity: 0.9,
    },
    titleDark: {
        color: '#ffffff',
        textShadowColor: 'rgba(255, 255, 255, 0.1)',
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
    counterDark: {
        backgroundColor: 'rgba(45, 45, 58, 0.95)',
    },
    innerHex: {
        width: '85%',
        height: '85%',
        borderRadius: 20,
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    innerHexDark: {
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
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
        color: '#667eea',
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    counterTextDark: {
        color: '#ff6b6b',
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
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
    },
    infoItem: {
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 15,
        minWidth: 120,
    },
    infoLabel: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 5,
        opacity: 0.9,
    },
    infoLabelDark: {
        color: '#f0f0f0',
    },
    infoValue: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    infoValueDark: {
        color: '#ff6b6b',
    },
})

export default Landing;