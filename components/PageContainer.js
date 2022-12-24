import { View, StyleSheet } from "react-native";

const PageContainer = props => {
    return <View style={styles.container}>
        {props.children}
    </View>
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        flex: 1,
        backgroundColor: 'White'
    }
})

export default PageContainer;