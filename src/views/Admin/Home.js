import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AddNewServices from './AddNewServices';
import ServiceDetails from './ServiceDetails';
import Profile from './Profile';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

const Stack = createStackNavigator();

const HomeScreen = ({ navigation, route }) => {
    const [services, setServices] = useState([]);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const servicesSnapshot = await firestore().collection('services').get();
                const servicesData = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setServices(servicesData);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        const fetchUserData = async () => {
            try {
                const userQuerySnapshot = await firestore().collection('user').get();
                userQuerySnapshot.forEach(doc => {
                    const user = doc.data();
                    setUsername(user.name);
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchServices();
        fetchUserData();

        const unsubscribe = navigation.addListener('focus', () => {
            fetchServices();
            fetchUserData();
        });

        return unsubscribe;
    }, [navigation]);


    const handleServicePress = (service) => {
        navigation.navigate('ServiceDetails', { service });
    };

    const renderItem = ({ item, index }) => (
        <TouchableOpacity style={styles.serviceItem} onPress={() => handleServicePress(item)}>
            <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{`${index + 1}. ${item.service}`}</Text>
                <Text style={styles.servicePrice}>{item.prices}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.upperView}>
                <Text style={styles.username}>{username}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <View style={styles.profileIcon}>
                        <Icon name="user" size={25} color="black" />
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../image/logolab3.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.header}>
                    <Text style={styles.headerText}>DANH SÁCH DỊCH VỤ</Text>
                    <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddNewServices')}>
                        <Text style={styles.buttonText}>+</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={services}
                    renderItem={renderItem}
                    keyExtractor={item => String(item.id)}
                    style={styles.serviceList}
                />
            </View>
        </View>
    );
};

const Home = ({ route }) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                initialParams={route.params}
            />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="AddNewServices" component={AddNewServices} />
            <Stack.Screen name="ServiceDetails" component={ServiceDetails} />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    upperView: {
        flexDirection: 'row',
        backgroundColor: '#FFC0CB',
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
        padding: 20,
    },
    serviceItem: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 10,
        padding: 15,
        elevation: 3,
    },
    serviceInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    serviceName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    servicePrice: {
        fontSize: 16,
        color: '#666',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#FF69B4',
        borderRadius: 50,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    buttonText: {
        fontSize: 24,
        color: 'white',
    },
    username: {
        fontSize: 18,
        marginRight: 'auto',
        marginLeft: 10,
    },
    profileIcon: {
        padding: 5,
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 200,
        height: 200,
    },
    serviceList: {
        flex: 1,
    },
});

export default Home;
