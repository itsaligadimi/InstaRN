import React, { Component } from 'react';
import { 
    Text, 
    View, 
    Image, 
    StyleSheet,
    ScrollView, 
    FlatList, 
    TextInput,
    StatusBar,
    ToastAndroid,
    Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const POST_SIZE = (width - 4) / 3;
const styles = StyleSheet.create({
    text:{
        color: '#333',
    },
    page:{
        backgroundColor: '#E5ECF4', 
        flex: 1,
    },
    usernameInput:{
        margin: 16,
        backgroundColor: '#fff',
        height: 40,
        borderRadius: 8,
        textAlign: "center",
        fontFamily: 'BloggerSans',
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginTop: 16,
    },
    fullname:{
        alignSelf: 'center',
        marginTop: 16,
        fontFamily: 'BloggerSansBold',
        fontSize: 20,
    },
    bio:{
        alignSelf: 'center',
        marginTop: 4,
        fontFamily: 'BloggerSans',
        fontSize: 16,
    }
});

export default class InstaRN extends Component {
    typingTimer;
    state = {
        profilePic: {uri: ''},
        fullname: '',
        bio: '',
        postsCount: 0,
        followers: 0,
        followings: 0,
        posts: []
    }

    downloadUserProfile(user)
    {
        this.typingTimer = setTimeout(() => {
            if(user != '')
            {
                fetch('https://www.instagram.com/' + user +'/?__a=1')
                    .then((response) => response.json())
                    .then((responseJson) => {
                        this.setState(previousState =>(
                               {
                                   profilePic: {uri: responseJson.graphql.user.profile_pic_url_hd},
                                   fullname: responseJson.graphql.user.full_name,
                                   bio: responseJson.graphql.user.biography,
                                   postsCount: responseJson.graphql.user.edge_owner_to_timeline_media.count,
                                   followers: responseJson.graphql.user.edge_followed_by.count,
                                   followings: responseJson.graphql.user.edge_follow.count,
                                   posts: responseJson.graphql.user.edge_owner_to_timeline_media.edges
                                }
                           ));
                    })
                    .catch((error) =>{
                        ToastAndroid.show("Failed to download profile", ToastAndroid.SHORT);
                    });
            }
        }, 600);
    }
    
    render() {
        return ( 
        <View style={styles.page}>
            <StatusBar backgroundColor="#E5ECF4" barStyle="dark-content" />
            <ScrollView>
                <TextInput 
                    style={styles.usernameInput} 
                    placeholder='Username'
                    onChangeText={text => {
                        clearTimeout(this.typingTimer);
                        this.downloadUserProfile(text);
                    }}/>
                <Image source={this.state.profilePic} style={styles.profilePic}/>
                <Text style={[styles.fullname, styles.text]}>{this.state.fullname}</Text> 
                <Text style={[styles.text, styles.bio]}>{this.state.bio}</Text> 

                <View style={{flexDirection: "row", marginTop: 32,}}>
                    <View style={{flex: 1}}>
                        <Text style={[styles.text, {fontFamily: 'BloggerSansBold', fontSize: 25, alignSelf: 'center'}]}>{this.state.postsCount}</Text> 
                        <Text style={[styles.text, {fontFamily: 'BloggerSans', fontSize: 18, alignSelf: 'center'}]}>posts</Text> 
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={[styles.text, {fontFamily: 'BloggerSansBold', fontSize: 25, alignSelf: 'center'}]}>{this.state.followers}</Text> 
                        <Text style={[styles.text, {fontFamily: 'BloggerSans', fontSize: 18, alignSelf: 'center'}]}>followers</Text> 
                    </View>                
                    <View style={{flex: 1}}>
                        <Text style={[styles.text, {fontFamily: 'BloggerSansBold', fontSize: 25, alignSelf: 'center'}]}>{this.state.followings}</Text> 
                        <Text style={[styles.text, {fontFamily: 'BloggerSans', fontSize: 18, alignSelf: 'center'}]}>followings</Text> 
                    </View>
                </View>
                

                <FlatList 
                    style={{marginTop: 16}}
                    data={this.state.posts}
                    renderItem={({item}) => 
                        <View style={{flexDirection: 'column', width: POST_SIZE, margin: 1, backgroundColor: '#aaddff', aspectRatio: 1}}>
                            <Image 
                                style={{width: POST_SIZE, aspectRatio: 1}}
                                source={{uri: item.node.display_url}}/>
                        </View>
                    }
                    numColumns={3}/>
            </ScrollView>
        </View>
        );
    }
}