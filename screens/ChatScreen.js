import { View, Text, Button, ImageBackground, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, FlatList, Image, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import backgroundImage from '../assets/images/wp5586493.png'
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import colors from '../constants/colors';
import { Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import PageContainer from "../components/PageContainer";
import Bubble from "../components/Bubble";
import { createChat, sendImage, sendTextMessage } from '../utils/actions/chatActions';
import ReplyTo from '../components/ReplyTo';

import { launchImagePicker, openCamera, uploadImageAsync } from '../utils/imagePickerHelper';
import AwesomeAlert from 'react-native-awesome-alerts';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../components/CustomHeaderButton';


const ChatScreen = (props) => {

    const [chatUsers, setChatUsers] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [chatId, setChatId] = useState(props.route?.params?.chatId);
    const [errorBannerText, setErrorBannerText] = useState("");
    const [replyingTo, setReplyingTo] = useState();
    const [tempImageUri, setTempImageUri] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const flatList = useRef();

    const userData = useSelector(state => state.auth.userData);
    const storedUsers = useSelector(state => state.users.storedUsers);
    const storedChats = useSelector(state => state.chats.chatsData);
    const chatMessages = useSelector(state => {
        if (!chatId) return [];
        const chatMessagesData = state.messages.messagesData[chatId];

        if (!chatMessagesData) return [];

        const messageList = [];
        for (const key in chatMessagesData) {
            const message = chatMessagesData[key];

            messageList.push({
                key,
                ...message
            });
        }
        return messageList;

    });

    const chatData = (chatId && storedChats[chatId]) || props.route?.params?.newChatData || {};

    const getChatTitleFromName = () => {


        const otherUserId = chatUsers.find(uid => uid !== userData.userId)
        const otherUserData = storedUsers[otherUserId];

        return otherUserData && ` ${otherUserData.firstName} ${otherUserData.lastName}`
            ;
    }



    useEffect(() => {
        if (!chatData) return;
        props.navigation.setOptions({
            headerTitle: chatData.chatName ?? getChatTitleFromName(),
            headerTitleAlign: 'center',
            headerRight: () => {
                return <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                    {
                        chatId &&
                        <Item
                            title='Chat settings'
                            iconName='settings-outline'
                            onPress={() => chatData.isGroupChat ?
                                props.navigation.navigate("ChatSettings", { chatId }) :
                                props.navigation.navigate("Contact", { uid: chatUsers.find(uid => uid !== userData.userId) })}


                        />
                    }


                </HeaderButtons>
            }
        })
        setChatUsers(chatData.users)
    }, [chatUsers])


    //sending message goes desappier from textbox
    const sentMessage = useCallback(async () => {

        try {

            let id = chatId;
            if (!id) {
                //nochat id .create the chat
                id = await createChat(userData.userId, props.route.params.newChatData);
                setChatId(id);
            }

            await sendTextMessage(id, userData, messageText, replyingTo && replyingTo.key, chatUsers);

            setMessageText("")
            setReplyingTo(null);
        } catch (error) {
            console.log(error);
            setErrorBannerText("Message failed to send");
            setTimeout(() => setErrorBannerText(""), 5000);
        }


    }, [messageText, chatId])

    const pickImage = useCallback(async () => {
        try {
            const tempUri = await launchImagePicker();
            if (!tempUri) return;

            setTempImageUri(tempUri);
        } catch (error) {
            console.log(error);
        }
    }, [tempImageUri])

    const takePhoto = useCallback(async () => {
        try {
            const tempUri = await openCamera();
            if (!tempUri) return;

            setTempImageUri(tempUri);
        } catch (error) {
            console.log(error);
        }
    }, [tempImageUri])

    const uploadImage = useCallback(async () => {
        setIsLoading(true);

        try {

            let id = chatId;
            if (!id) {
                //nochat id .create the chat
                id = await createChat(userData.userId, props.route.params.newChatData);
                setChatId(id);
            }

            const uploadUri = await uploadImageAsync(tempImageUri, true);
            setIsLoading(false);

            await sendImage(id, userData, uploadUri, replyingTo && replyingTo.key, chatUsers)
            setReplyingTo(null);
            setTimeout(() => setTempImageUri(""), 500);

        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }

    }, [isLoading, tempImageUri, chatId])

    return (
        <SafeAreaView
            edges={['right', 'left', 'bottom']}
            style={styles.container}>

            <KeyboardAvoidingView //KeyboardAvoidingView this is for ios device because input text box hide behind keyboard
                style={styles.screen}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={100}
            >


                <ImageBackground source={backgroundImage} style={styles.backgroundImage}>

                    <PageContainer style={{ backgroundColor: 'transparent' }}>

                        {
                            !chatId && <Bubble text='This is a new chat . say hi...' type="system" />
                        }

                        {
                            errorBannerText !== "" && <Bubble text={errorBannerText} type="error" />

                        }


                        {
                            chatId &&
                            <FlatList
                                ref={(ref) => flatList.current = ref} // is scroll dwon to chat
                                onContentSizeChange={() => flatList.current.scrollToEnd({ animated: false })} // same as up
                                onLayout={() => flatList.current.scrollToEnd({ animated: false })} // same as up
                                data={chatMessages}
                                renderItem={(itemData) => {
                                    const message = itemData.item;

                                    const isOwnMessage = message.sentBy === userData.userId;


                                    let messageType;
                                    if (message.type && message.type === "info") {
                                        messageType = "info"
                                    }
                                    else if (isOwnMessage) {
                                        messageType = "myMessage"
                                    }
                                    else {
                                        messageType = "theirMessage"
                                    }

                                    const sender = message.sentBy && storedUsers[message.sentBy] // users name in chats
                                    const name = sender && `${sender.firstName} ${sender.lastName}`;
                                    return <Bubble
                                        type={messageType}
                                        text={message.text}
                                        messageId={message.key}
                                        userId={userData.userId}
                                        chatId={chatId}
                                        date={message.sentAt}
                                        name={!chatData.isGroupChat || isOwnMessage ? undefined : name} // user name in group chat
                                        setReply={() => setReplyingTo(message)}
                                        replyingTo={message.replyTo && chatMessages.find(i => i.key === message.replyTo)}
                                        imageUrl={message.imageUrl}

                                    />
                                }}
                            />
                        }
                    </PageContainer>
                    {
                        replyingTo &&
                        <ReplyTo
                            text={replyingTo.text}
                            user={storedUsers[replyingTo.sentBy]}
                            onCancel={() => setReplyingTo(null)} // cancel the reply use null value
                        />
                    }

                </ImageBackground>
                <View style={styles.inputContainer}>
                    <TouchableOpacity style={styles.mediaButton} onPress={pickImage}>
                        <AntDesign name="plus" size={24} color={colors.blue} />
                    </TouchableOpacity>

                    <TextInput
                        style={styles.textbox}
                        value={messageText}
                        onChangeText={text => setMessageText(text)}
                        onSubmitEditing={sentMessage} //onSubmitEditing is use for submitting from keyboard
                    />

                    {
                        messageText === "" &&
                        <TouchableOpacity onPress={takePhoto}>
                            <EvilIcons name="camera" size={32} color={colors.blue} />
                        </TouchableOpacity>
                    }
                    {
                        messageText !== "" && (
                            <TouchableOpacity
                                style={{ ...styles.mediaButton, ...styles.sendButton }}
                                onPress={sentMessage}>

                                <Feather name="send" size={18} color={"white"} />
                            </TouchableOpacity>
                        )}
                    <AwesomeAlert style={styles.textt}
                        show={tempImageUri !== ""}
                        title='Send image?'
                        closeOnHardwareBackPress={false}
                        closeOnTouchOutside={true}
                        showCancelButton={true}
                        showConfirmButton={true}
                        cancelText='Cancel'
                        confirmText="Send image"
                        confirmButtonColor={colors.primary}
                        cancelButtonColor={colors.red}
                        titleStyle={styles.popupTitleStyle}
                        onCancelPressed={() => setTempImageUri("")}
                        onConfirmPressed={uploadImage}
                        onDismiss={() => setTempImageUri("")}
                        customView={(

                            <View>
                                {
                                    isLoading &&
                                    <ActivityIndicator size='small' color={colors.primary} />
                                }
                                {
                                    !isLoading && tempImageUri !== "" &&
                                    <Image source={{ uri: tempImageUri }} style={{ width: 200, height: 200 }} />
                                }
                            </View>

                        )}
                    />




                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    screen: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1
    },
    inputContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 8
    },
    textbox: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 50,
        borderColor: colors.lightgrey,
        marginHorizontal: 15,
        paddingHorizontal: 12
    },
    mediaButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 35
    },
    sendButton: {
        backgroundColor: colors.blue,
        borderRadius: 50,
        padding: 5
    },
    popupTitleStyle: {
        fontFamily: 'medium',
        letterSpacing: 0.3,
        color: colors.textColor
    },

})
export default ChatScreen;