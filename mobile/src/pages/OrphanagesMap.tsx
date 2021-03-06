import React,{useEffect, useState} from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker,Callout} from 'react-native-maps';
import mapMarker from '../img/map-marker.png';
import {Feather} from '@expo/vector-icons';
import {useFonts} from 'expo-font';
import {Nunito_600SemiBold,Nunito_700Bold,Nunito_800ExtraBold} from '@expo-google-fonts/nunito';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import api from '../../services/api';

export default function OrphanagesMap(){

  interface Orphanage{
    id: number;
    name: string;
    longitude: number;
    latitude: number;
  }

   const [orphanages, setOrphanages]= useState<Orphanage[]>([]);


  useFocusEffect( ()=> {
    api.get('/orphanages').then(res => setOrphanages(res.data))
  },[])
  
  const navigation =useNavigation();
    const [fontsLoaded] = useFonts({
        Nunito_600SemiBold,
        Nunito_700Bold,
        Nunito_800ExtraBold
      });
      if(!fontsLoaded) return null;


      function handleNavigationToCreateOrphanage(){
        navigation.navigate('SelectMapPosition')
      }

      function handleNavigateToOrphanageDetail(id:number){
        navigation.navigate('OrphanageDetails', {id})
      }



    return (
        <View style={styles.container}>
          

        <MapView style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude:-22.5089417,
          longitude:-43.1810531,
          latitudeDelta: 0.8,
          longitudeDelta: 0.8,
          }}
          >
            {
              orphanages.map(orphanage => {
                return (
                  <Marker 
                key={orphanage.id}
              icon={mapMarker}
              calloutAnchor={{
                x:2.7,
                y:0.8
              }}
              coordinate={{
                latitude:orphanage.latitude,
                longitude:orphanage.longitude
              }}
            >
              <Callout tooltip={true} onPress={() => handleNavigateToOrphanageDetail(orphanage.id)}>
                <View style={styles.calloutContainer}>
            <Text style={styles.calloutText}>{orphanage.name}</Text>
                </View>
              </Callout>
            </Marker>
                )
              })

            }
  
          </MapView>
  
          <View style={styles.footer}>
            <Text style={styles.footerText}>{orphanages.length} Orfanatos encontrados</Text>
            <RectButton style={styles.createOrphanageButton} onPress={handleNavigationToCreateOrphanage}> 
                <Feather name="plus" size={20} color="#FFF"/>
            </RectButton>
          </View>
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
    calloutContainer:{
      width:160,
      height:40,
      paddingHorizontal:16,
      backgroundColor: `rgba(255,255,255,0.8)`,
      borderRadius:16,
      justifyContent:'center',
      elevation:20
    },
    calloutText:{
      color: '#0089a5',
      fontSize:14,
      fontFamily: 'Nunito_600SemiBold'
    },
    footer:{
      position: 'absolute',
      bottom: 32,
      left: 24,
      right: 24,
      backgroundColor: '#FFF',
      borderRadius:28,
      height: 56,
      paddingLeft: 24,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      elevation:20
    },
    footerText:{
      color: '#8fa7b3',
      fontFamily: 'Nunito_700Bold'
    },
    createOrphanageButton:{
      width:56,
      height:56,
      backgroundColor: '#15c3d6',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20
    }
  });
  