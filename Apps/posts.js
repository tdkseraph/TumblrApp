import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    StatusBar,
    Image,
    TouchableOpacity,
    RefreshControl,
    ListView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Symbol from 'react-native-vector-icons/MaterialIcons';

const uriTumblr = 'https://api.tumblr.com/v2/blog/xkcn.info/posts/photo?api_key=Q6vHoaVm5L1u2ZAW1fq' +
        'v3Jw48gFzYVg9P0vH0VHl3GVy6quoGV';
var oldData = [];

export default class Post extends Component {
    constructor(props) {
        super(props);

        this.ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.state = {
            dataSource: this
                .ds
                .cloneWithRows([])
        };
    }

    componentDidMount() {
        this.getMoviesFromApiAsync();
    }

    timeConverter(previous) {
        var msPerMinute = 60 * 10000;
        var msPerHour = msPerMinute * 60;
        var msPerDay = msPerHour * 24;
        var msPerMonth = msPerDay * 30;
        var msPerYear = msPerDay * 365;

        var current = new Date().getTime();
        var elapsed = current - previous;

        if (elapsed < msPerMinute) {
            return Math.round(elapsed / 1000) + ' seconds ago';
        } else if (elapsed < msPerHour) {
            return Math.round(elapsed / msPerMinute) + ' minutes ago';
        } else if (elapsed < msPerDay) {
            return Math.round(elapsed / msPerHour) + ' hours ago';
        } else {
            return Math.round(elapsed / msPerYear) + ' hours ago';
        }
    }

    reRender() {
        this.setState({
            dataSource: this
                .ds
                .cloneWithRows(oldData)
        })
    }
    calculateLikes(rowID) {
        console.log(oldData);
        if (!oldData[rowID].can_like) {
            oldData[rowID].can_like = true;
        } else {
            oldData[rowID].can_like = false;
        }
        this.reRender();
    }

    showHeart(displayHeart) {
        if (!displayHeart) {
            return (<Icon name='heart' color='white' size={20}/>)
        }
        return (<Icon name='heart' color='pink' size={20}/>)
    }

    renderMovieCell(rowData, sectionID, rowID) {
        return (
            <View
                style={{backgroundColor: '#FFF',margin: 5}}>
                <TouchableOpacity onPress={() => this.calculateLikes(rowID)}>
                    <View
                        style={{
                        flexDirection: 'row'
                    }}>
                        <Image
                            style={{
                            height: 300,
                            flex: 1,
                            resizeMode: 'cover'
                        }}
                            source={{
                            uri: rowData.photos[0].original_size.url
                        }}/>
                    </View>
                </TouchableOpacity>
                <View
                    style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingTop: 10,
                    paddingBottom: 10
                }}>

                    <Text style={{
                        textAlign: 'left'
                    }}>
                        {this.showHeart(rowData.can_like)} Like</Text>

                    <Text
                        style={{
                        textAlign: 'right'
                    }}>
                        {this.timeConverter(rowData.timestamp)}
                    </Text>

                </View>

                <View style={{
                    padding: 3
                }}>
                    <View>
                        <Text>
                            {rowData.summary}</Text>
                    </View>
                </View>

                <View style={{
                    alignItems: 'center'
                }}>
                    <View
                        style={{
                        width: 200,
                        height: 2,
                        backgroundColor: '#000',
                        margin: 10
                    }}></View>
                </View>

                <View>
                    <Text
                        style={{
                        alignItems: 'center',
                        paddingBottom: 20
                    }}>{rowData
                            .tags
                            .map(x => ' #' + x)}</Text>
                </View>

                <View
                    style={{
                    backgroundColor: '#000',
                    height: 2,
                    marginTop: 10
                }}></View>
            </View>
        )
    }

    getMoviesFromApiAsync() {
        return fetch(uriTumblr).then((response) => response.json()).then((responseJson) => {
            responseJson
                .response
                .posts
                .forEach(function (post) {
                    post.can_like = false;
                });
            this.setState({
                dataSource: this
                    .state
                    .dataSource
                    .cloneWithRows(responseJson.response.posts)
            })
            oldData = responseJson.response.posts;
        }).catch((error) => {
            console.error(error);
        });
    }

    _onEndReached() {
        alert("This is the end of list")
    }

    _onRefresh() {
        this.getMoviesFromApiAsync();
    }

    render() {
        return (
            <View>
            <StatusBar backgroundColor='orange' barStyle='dark-content'/>
             <View style={{backgroundColor:'white', marginTop:20}}>
                    
                    <Text style={{fontSize:35, fontWeight:'bold', textAlign:'center'}}> 
                    <Symbol name='camera' color='#BB6622' size={50}/> Tumblr </Text>
                </View>
                <ListView
                    enableEmptySections={true}
                    onEndReached={() => this._onEndReached()}
                    dataSource={this.state.dataSource}
                    renderRow={(rowData, sectionID, rowID) => this.renderMovieCell(rowData, sectionID, rowID)}
                    renderFooter={this.renderFooter}
                    refreshControl={
                        <RefreshControl refreshing = {false}
                    onRefresh = {() => this._onRefresh.bind(this)} 
                    />
                }/>
            </View>
        );
    }
}