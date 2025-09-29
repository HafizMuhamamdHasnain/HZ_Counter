export function createDynamicStyles(params: {
    width: number
    height: number
    isLandscape: boolean
    minDimension: number
    counterSize: number
    glowSize: number
    buttonSize: number
}) {
    const { width, height, isLandscape, minDimension, counterSize, glowSize, buttonSize } = params
    return {
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
            justifyContent: 'center' as const,
            alignItems: 'center' as const,
            gap: Math.max(buttonSize * 0.25, 20),
        },
        button: {
            width: buttonSize,
            height: buttonSize,
            borderRadius: 25,
        },
        resetButton: {
            width: buttonSize * 1.4,
            height: buttonSize,
            borderRadius: 25,
            
        },
        buttonText: {
            fontSize: Math.max(buttonSize * 0.32, 16),
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
}


