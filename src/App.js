import React, { useRef } from 'react'
import { StyleSheet, Text, View, StatusBar, Animated, Image, Dimensions, FlatList} from 'react-native'
import { dataSlider, ImgPlant0, ImgPlant1, ImgPlant2, ImgPlant3 } from './assets'

const {width, height} = Dimensions.get('screen')
const bgcolor = ['#2ecc71', '#27ae60', '#1abc9c', '#16a085'];

const Background = ({scrollX}) => {
    const color = scrollX.interpolate({
        inputRange: bgcolor.map((_, i) => i * width),
        outputRange: bgcolor.map((bg) => bg)
    })
    return <Animated.View 
                style={[
                    StyleSheet.absoluteFillObject,
                    { backgroundColor: color }
                ]}
            />
}

const Square = ({scrollX}) => {
    const YOLO = Animated.modulo(Animated.divide(
      Animated.modulo(scrollX, width),
      new Animated.Value(width)
    ), 1)
  
    const rotate = YOLO.interpolate({
      inputRange: [0, .5, 1],
      outputRange: ['35deg', '0deg', '35deg']
    })
  
    const translateX = YOLO.interpolate({
      inputRange: [0, .5, 1],
      outputRange: [0, -height, 0]
    })
  
    return <Animated.View
                style={{
                    width: height,
                    height: height - StatusBar.currentHeight,
                    backgroundColor: '#FFF',
                    borderRadius: 86,
                    position: 'absolute',
                    top: -height * 0.6,
                    left: -height * 0.3,
                    transform: [
                        { rotate },
                        { translateX }
                    ]
                }}
            />
}

const Indicator = ({scrollX}) => {
    return <View style={styles.wrapperIndicator}>
                {dataSlider.data.map((_, i) => {
                    const inputRange = [(i - 1) * width, i * width, (i + 1) * width,  ]
                    const scale = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.8, 1.4, 0.8],
                        extrapolate: 'clamp'
                    })
                    const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.6, 0.9, 0.8],
                    extrapolate: 'clamp'
                })
                    return <Animated.View
                                key={`indicator-${i}`}
                                style={styles.itemIndicator(scale, opacity)}
                            />
                })}
            </View>
}
  

const App = () => {
    const scrollX = useRef(new Animated.Value(0)).current;
    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <Background scrollX={scrollX} />
            <Square scrollX={scrollX} />
            <Animated.FlatList
                data={dataSlider.data}
                keyExtractor={item => item.key}
                horizontal
                scrollEventThrottle={32}
                onScroll={Animated.event(
                    [{nativeEvent: {contentOffset: {x: scrollX}}}],
                    {useNativeDriver: false}
                )}
                contentContainerStyle={{paddingBottom: 100}}
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                renderItem={({item}) => {
                    let img = ImgPlant0
                    switch (item.key) {
                        case '1':
                            img = ImgPlant0
                            break;
                        case '2':
                            img = ImgPlant1
                            break;
                        case '3':
                            img = ImgPlant2
                            break;
                        case '4':
                            img = ImgPlant3
                            break;
                        default:
                            break;
                    }
                    return <View style={styles.wrapperItem}>
                                <View style={styles.wrapperImage}>
                                    <Image source={img} style={styles.image} />
                                </View>
                                <View style={{flex: .3}}>
                                    <Text style={styles.textTitle}>
                                        {item.title}
                                    </Text>
                                    <Text style={styles.textDesc}>
                                        {item.description}
                                    </Text>
                                </View>  
                            </View>
                }}
            />
            <Indicator scrollX={scrollX} />
        </View>
    )
}

export default App

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF'
    },
    wrapperItem: {
        width: width, 
        alignItems: 'center', 
        padding: 20
    },
    wrapperImage: {
        flex: .7, 
        justifyContent: 'center'
    },
    image: {
        width: width / 2, 
        height: width / 2, 
        resizeMode: 'contain'
    },
    textTitle: {
        fontWeight: '800', 
        fontSize: 28, 
        marginBottom: 10, 
        color: '#FFF'
    },
    textDesc: {
        fontWeight: '300',
        color: '#FFF'
    },
    wrapperIndicator: {
        position: 'absolute', 
        flexDirection: 'row',
        bottom: 100
    },
    itemIndicator: (opacity, scale) => ({
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: '#FFF',
        opacity,
        margin: 10,
        transform: [
            {
                scale,
            }
        ]
    })
})
