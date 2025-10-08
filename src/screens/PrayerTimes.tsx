import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Alert,
    Platform,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
// import AsyncStorage from '@react-native-async-storage/async-storage';

interface PrayerTime {
    name: string;
    time: string;
    arabic: string;
    icon: string;
    color: string;
}

interface LocationData {
    latitude: number;
    longitude: number;
    city: string;
    country: string;
}

const PrayerTimes = () => {
    const navigation = useNavigation<any>();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [location, setLocation] = useState<LocationData | null>(null);
    const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch prayer times from Aladhan API
    const fetchPrayerTimes = async (lat: number, lng: number, date: Date) => {
        try {
            const today = date.toISOString().split('T')[0];
            const response = await fetch(
                `http://api.aladhan.com/v1/timings/${today}?latitude=${lat}&longitude=${lng}&method=2&school=1`
            );
            const data = await response.json();

            if (data.code === 200 && data.data) {
                const timings = data.data.timings;
                const times = [
                    {
                        name: 'Fajr',
                        time: timings.Fajr,
                        arabic: 'الفجر',
                        icon: '🌅',
                        color: '#FF6B6B'
                    },
                    {
                        name: 'Dhuhr',
                        time: timings.Dhuhr,
                        arabic: 'الظهر',
                        icon: '☀️',
                        color: '#4ECDC4'
                    },
                    {
                        name: 'Asr',
                        time: timings.Asr,
                        arabic: 'العصر',
                        icon: '🌤️',
                        color: '#45B7D1'
                    },
                    {
                        name: 'Maghrib',
                        time: timings.Maghrib,
                        arabic: 'المغرب',
                        icon: '🌅',
                        color: '#96CEB4'
                    },
                    {
                        name: 'Isha',
                        time: timings.Isha,
                        arabic: 'العشاء',
                        icon: '🌙',
                        color: '#FFEAA7'
                    },
                ];
                return times;
            } else {
                throw new Error('Failed to fetch prayer times');
            }
        } catch (error) {
            console.error('Error fetching prayer times:', error);
            // Fallback to sample times if API fails
            return [
                { name: 'Fajr', time: '05:30', arabic: 'الفجر', icon: '🌅', color: '#FF6B6B' },
                { name: 'Dhuhr', time: '12:15', arabic: 'الظهر', icon: '☀️', color: '#4ECDC4' },
                { name: 'Asr', time: '15:45', arabic: 'العصر', icon: '🌤️', color: '#45B7D1' },
                { name: 'Maghrib', time: '18:20', arabic: 'المغرب', icon: '🌅', color: '#96CEB4' },
                { name: 'Isha', time: '19:45', arabic: 'العشاء', icon: '🌙', color: '#FFEAA7' },
            ];
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        loadLocationAndPrayerTimes();

        return () => clearInterval(timer);
    }, []);

    const loadLocationAndPrayerTimes = async () => {
        try {
            // Default to Makkah coordinates for now
            const defaultLocation = {
                latitude: 21.3891,
                longitude: 39.8579,
                city: 'Makkah',
                country: 'Saudi Arabia'
            };
            setLocation(defaultLocation);
            const times = await fetchPrayerTimes(defaultLocation.latitude, defaultLocation.longitude, currentTime);
            setPrayerTimes(times);
        } catch (error) {
            console.error('Error loading location:', error);
            Alert.alert('Error', 'Unable to load prayer times');
        } finally {
            setIsLoading(false);
        }
    };

    const getCurrentPrayer = () => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTimeMinutes = currentHour * 60 + currentMinute;

        for (let i = 0; i < prayerTimes.length; i++) {
            const [hours, minutes] = prayerTimes[i].time.split(':').map(Number);
            const prayerTimeMinutes = hours * 60 + minutes;

            if (currentTimeMinutes < prayerTimeMinutes) {
                return i;
            }
        }
        return 0; // Return Fajr if it's past Isha
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getTimeUntilNextPrayer = () => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTimeMinutes = currentHour * 60 + currentMinute;

        for (let i = 0; i < prayerTimes.length; i++) {
            const [prayerHours, prayerMinutes] = prayerTimes[i].time.split(':').map(Number);
            const prayerTimeMinutes = prayerHours * 60 + prayerMinutes;

            if (currentTimeMinutes < prayerTimeMinutes) {
                const diffMinutes = prayerTimeMinutes - currentTimeMinutes;
                const hoursLeft = Math.floor(diffMinutes / 60);
                const minsLeft = diffMinutes % 60;
                return `${hoursLeft}h ${minsLeft}m`;
            }
        }

        // If past Isha, calculate time until next Fajr
        const [fajrHours, fajrMinutes] = prayerTimes[0].time.split(':').map(Number);
        const fajrTimeMinutes = fajrHours * 60 + fajrMinutes;
        const nextDayFajr = fajrTimeMinutes + (24 * 60);
        const diffMinutes = nextDayFajr - currentTimeMinutes;
        const hoursLeft = Math.floor(diffMinutes / 60);
        const minsLeft = diffMinutes % 60;
        return `${hoursLeft}h ${minsLeft}m`;
    };

    if (isLoading) {
        return (
            <LinearGradient
                colors={['#0F4C3A', '#1a472a', '#2E8B57', '#32CD32']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.container}
            >
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading Prayer Times...</Text>
                </View>
            </LinearGradient>
        );
    }

    const currentPrayerIndex = getCurrentPrayer();

    return (
        <LinearGradient
            colors={['#0F4C3A', '#1a472a', '#2E8B57', '#32CD32']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <View style={styles.overlay} />
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.backButtonText}>‹</Text>
                        </TouchableOpacity>
                        <View style={styles.headerSpacer} />
                        <TouchableOpacity
                            style={styles.refreshButton}
                            onPress={() => {
                                setIsLoading(true);
                                loadLocationAndPrayerTimes();
                            }}
                        >
                            <Text style={styles.refreshButtonText}>🔄</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.title}>🕌 Prayer Times</Text>
                    <Text style={styles.subtitle}>
                        {location ? `${location.city}, ${location.country}` : 'Location not available'}
                    </Text>
                    <Text style={styles.dateText}>
                        {currentTime.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </Text>
                </View>

                {/* Current Time */}
                <LinearGradient
                    colors={['#fffbe6', '#f7e8ff', '#e0f7fa']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.currentTimeCard}
                >
                    <Text style={styles.currentTimeLabel}>Current Time</Text>
                    <Text style={styles.currentTimeText}>{formatTime(currentTime)}</Text>
                    <Text style={styles.nextPrayerText}>
                        Next Prayer: {prayerTimes[currentPrayerIndex]?.name} in {getTimeUntilNextPrayer()}
                    </Text>
                </LinearGradient>

                {/* Prayer Times List */}
                <View style={styles.prayerTimesContainer}>
                    {prayerTimes.map((prayer, index) => (
                        <LinearGradient
                            key={prayer.name}
                            colors={index === currentPrayerIndex ? ['#FFD700', '#FFA500'] : ['#ffffff', '#f8f9fa']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={[
                                styles.prayerCard,
                                index === currentPrayerIndex && styles.currentPrayerCard
                            ]}
                        >
                            <View style={styles.prayerInfo}>
                                <Text style={styles.prayerIcon}>{prayer.icon}</Text>
                                <View style={styles.prayerDetails}>
                                    <Text style={[
                                        styles.prayerArabic,
                                        index === currentPrayerIndex && styles.currentPrayerArabic
                                    ]}>
                                        {prayer.arabic}
                                    </Text>
                                    <Text style={[
                                        styles.prayerName,
                                        index === currentPrayerIndex && styles.currentPrayerText
                                    ]}>
                                        {prayer.name}
                                    </Text>
                                </View>
                            </View>
                            <Text style={[
                                styles.prayerTime,
                                index === currentPrayerIndex && styles.currentPrayerText
                            ]}>
                                {prayer.time}
                            </Text>
                        </LinearGradient>
                    ))}
                </View>

                {/* Islamic Quote */}
                <LinearGradient
                    colors={['#1a472a', '#2E8B57']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.quoteCard}
                >
                    <Text style={styles.quoteText}>
                        "And establish prayer for My remembrance"
                    </Text>
                    <Text style={styles.quoteReference}>- Quran 20:14</Text>
                </LinearGradient>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        color: '#ffffff',
        fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'Roboto-Regular',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 30,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    headerSpacer: {
        flex: 1,
    },
    backButton: {
        backgroundColor: '#1a472a',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#FFD700',
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 50,
        minHeight: 50,
    },
    backButtonText: {
        color: '#FFD700',
        fontSize: 24,
        fontWeight: '800',
        fontFamily: Platform.OS === 'ios' ? 'Helvetica-Bold' : 'Roboto-Bold',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    refreshButton: {
        backgroundColor: '#1a472a',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#FFD700',
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    refreshButtonText: {
        color: '#FFD700',
        fontSize: 18,
        fontWeight: '700',
        fontFamily: Platform.OS === 'ios' ? 'Helvetica-Bold' : 'Roboto-Bold',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#ffffff',
        marginBottom: 8,
        fontFamily: Platform.OS === 'ios' ? 'Helvetica-Bold' : 'Roboto-Bold',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'Roboto-Regular',
        marginBottom: 8,
    },
    dateText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'Roboto-Regular',
        fontStyle: 'italic',
    },
    currentTimeCard: {
        borderRadius: 20,
        padding: 25,
        marginBottom: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 15,
    },
    currentTimeLabel: {
        fontSize: 16,
        color: '#2c3e50',
        marginBottom: 10,
        fontFamily: Platform.OS === 'ios' ? 'Helvetica-Medium' : 'Roboto-Medium',
    },
    currentTimeText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#1a472a',
        marginBottom: 10,
        fontFamily: Platform.OS === 'ios' ? 'Helvetica-Bold' : 'Roboto-Bold',
    },
    nextPrayerText: {
        fontSize: 14,
        color: '#7f8c8d',
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'Roboto-Regular',
    },
    prayerTimesContainer: {
        marginBottom: 25,
    },
    prayerCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        marginBottom: 15,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    currentPrayerCard: {
        borderWidth: 2,
        borderColor: '#FFD700',
        shadowColor: '#FFD700',
        shadowOpacity: 0.3,
    },
    prayerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    prayerIcon: {
        fontSize: 24,
        marginRight: 15,
    },
    prayerDetails: {
        flex: 1,
    },
    prayerName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#7f8c8d',
        marginTop: 4,
        fontFamily: Platform.OS === 'ios' ? 'Helvetica-Medium' : 'Roboto-Medium',
    },
    prayerArabic: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1a472a',
        fontFamily: Platform.OS === 'ios' ? 'Helvetica-Bold' : 'Roboto-Bold',
        writingDirection: 'rtl',
        textAlign: 'right',
    },
    prayerTime: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a472a',
        fontFamily: Platform.OS === 'ios' ? 'Helvetica-Bold' : 'Roboto-Bold',
    },
    currentPrayerText: {
        color: '#1a472a',
    },
    currentPrayerArabic: {
        color: '#1a472a',
        fontSize: 24,
        fontWeight: '900',
    },
    quoteCard: {
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
    },
    quoteText: {
        fontSize: 16,
        color: '#ffffff',
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: 10,
        fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'Roboto-Regular',
    },
    quoteReference: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
        fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'Roboto-Regular',
    },
});

export default PrayerTimes;
