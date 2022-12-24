import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import PageContainer from '../components/PageContainer';


import SignUpForm from '../components/SignUpForm';
import SignInForm from '../components/SignInForm';
import colors from '../constants/colors';

import logo from '../assets/images/logo.png';

// ScrollView ,KeyboardAvoidingView iis for because while typing in pawword we cant see pawword field  what we are writing so we use this
const AuthScreen = props => {

    const [isSignUp, setIsSignUp] = useState(false);

    return <SafeAreaView style={{ flex: 1 }}>
        <PageContainer>
            <ScrollView>
                <KeyboardAvoidingView
                    style={styles.keyboardAvoidingView}
                    behavior={Platform.OS === "ios" ? "height" : undefined}
                    keyboardVerticalOffset={100}>



                    <View style={styles.ImageContainer}>
                        <Image
                            style={styles.Image}
                            source={logo}
                            resizeMode='contain' />
                    </View>
                    {
                        isSignUp ?
                            <SignUpForm /> :
                            <SignInForm />
                    }
                    <TouchableOpacity
                        onPress={() => setIsSignUp(prevState => !prevState)}
                        style={styles.linkContainer}>
                        <Text style={styles.link}>{`Switch to ${isSignUp ? "sign in" : "sign up"}`}</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </ScrollView>

        </PageContainer>

    </SafeAreaView>

};
const styles = StyleSheet.create({
    linkContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 15

    },
    link: {
        color: colors.blue,
        fontFamily: 'medium',
        letterSpacing: 0.3
    },
    ImageContainer: {
        justifyContent: "center",
        alignItems: 'center'
    },
    Image: {
        width: '50%'
    },
    KeyboardAvoidingView: {
        flex: 1,
        justifyContent: 'center'
    }

})
export default AuthScreen;