import React, { useCallback, useEffect, useReducer, useState } from "react";
import Input from '../components/Input';
import { Feather } from '@expo/vector-icons';
import SubmitButton from '../components/SubmitButton';

import { validateEmail, validatePassword, validateString } from "../utils/validationConstraints";
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducer";
import { signIn } from "../utils/actions/authActions";
import { ActivityIndicator, Alert } from "react-native";
import { useDispatch } from "react-redux";
import colors from "../constants/colors";

const isTestMode = true;

const initialState = {
    inputValues: {
        email: isTestMode ? "ms@gmail.com" : "",
        password: isTestMode ? "1234567" : "",
    },
    inputValidities: {
        email: isTestMode,
        password: isTestMode,
    },
    formIsValid: isTestMode
}

const SignInForm = props => {

    const dispatch = useDispatch();


    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [formState, dispatchFromState] = useReducer(reducer, initialState)

    const inputChangedHandler = useCallback((inputId, inputValue) => {
        const result = validateInput(inputId, inputValue);
        dispatchFromState({ inputId, validationResult: result, inputValue })

    }, [dispatchFromState]);

    useEffect(() => {
        if (error) {
            Alert.alert("An error occured", error, [{ text: "Okay" }]);
        }
    }, [error])


    const authHandler = useCallback(async () => {
        try {
            setIsLoading(true);
            const action = signIn(

                formState.inputValues.email,
                formState.inputValues.password,
            )
            setError(null);
            await dispatch(action);

        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    }, [dispatch, formState])

    return (
        <>

            <Input
                id="email"
                label="Email"
                icon="mail"
                autoCapitalize="none"
                keyboardType="email-address"
                iconPack={Feather}
                onInputChanged={inputChangedHandler}
                initialValue={formState.inputValues.email}
                errorText={formState.inputValidities["email"]}
            />
            <Input
                id="password"
                label="Password"
                icon="lock"
                autoCapitalize="none"
                secureTextEntry
                keyboardType="default"
                iconPack={Feather}
                onInputChanged={inputChangedHandler}
                initialValue={formState.inputValues.password}
                errorText={formState.inputValidities["password"]}
            />

            {
                isLoading ?
                    <ActivityIndicator size={"small"} color={colors.primary} style={{ marginTop: 10 }} /> :
                    <SubmitButton
                        title="Sign In"
                        onPress={authHandler}
                        style={{ marginTop: 20 }}
                        disabled={!formState.formIsValid}
                    />
            }
        </>
    )
}
export default SignInForm;