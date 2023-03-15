import { Alert, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MapView, { Callout, Circle, Geojson, Heatmap, Marker, Overlay, Polygon, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { getDistance } from 'geolib'

const CustomMarker = ({ item }) => (
  <View>
    <Image source={{ uri: item.image }} style={{ width: 20, height: 20 }} />
  </View>
)

const App = () => {

  const [dynamicMarker, setDynamicMarker] = useState({
    latitude: 3.1433014,
    longitude: 101.662330,
  })
  const [title, setTitle] = useState('')
  const marker = [
    {
      title: 'First',
      description: 'First Description',
      coordinates: {
        latitude: 3.148120,
        longitude: 101.652578
      },
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8a6EsTEf93twyOpS9_URWzGMhR9oPT5tSRw&usqp=CAU'
    },
    {
      title: 'Second',
      description: 'Second description',
      coordinates: {
        latitude: 3.149771,
        longitude: 101.655449
      },
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8a6EsTEf93twyOpS9_URWzGMhR9oPT5tSRw&usqp=CAU'
    },
    {
      title: 'Third',
      description: 'Third Description',
      coordinates: {
        latitude: 3.149700,
        longitude: 101.652300
      },
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8a6EsTEf93twyOpS9_URWzGMhR9oPT5tSRw&usqp=CAU'
    },
    {
      title: 'Third',
      description: 'Third Description',
      coordinates: {
        latitude: 3.142700,
        longitude: 101.649100
      },
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8a6EsTEf93twyOpS9_URWzGMhR9oPT5tSRw&usqp=CAU'
    },
  ];

  console.log('jk -- ', marker[1].title)
  const myPlace = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          name: 'bridge',
          sym: 'Waypoint',
        },
        geometry: {
          type: 'Point',
          coordinates: [3.15533169, 101.65609717],
        },
      },
    ],
  };
  const [coordinates] = useState([
    {
      latitude: 3.145549957670, longitude: 101.6626915999823
    },
    {
      latitude: 3.149054109495895, longitude: 101.6625076532363
    },
  ]);

  const GOOGLE_MAPS_APIKEY = 'AIzaSyBwDnoS4202yVlCbY0B-X48y0qmf67CJbU';

  const calculateDistance = () => {
    let dis = getDistance(
      coordinates[0], coordinates[1]
    );
    Alert.alert(`Distance ${dis} Meter \n OR \n ${dis / 1000} KM`)
  }
  console.log('coordinates -- ', marker)
  console.log('dynamic -- ', dynamicMarker)

  console.log('first -- ', coordinates[1].latitude)

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180)
  }

  const getDistanceFromLatLongInKm = (lat1, lon1, lat2, lon2) => {
    let R = 6371;
    let dLat = deg2rad(lat2 - lat1)
    let dLng = deg2rad(lon2 - lon1)

    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)


    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    let d = R * c;

    return d

  }
  useEffect(() => {
    Alert.alert('distance -- ', getDistanceFromLatLongInKm(
      coordinates[0].latitude,
      coordinates[0].longitude,
      coordinates[1].latitude,
      coordinates[1].longitude).toFixed(3))
    // calculateDistance()
  }, [])
  return (
    <View>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ width: '100%', height: '100%' }}
        initialRegion={{
          // latitude: coordinates[0].latitude,
          // longitude: coordinates[0].longitude,
          latitude: dynamicMarker.latitude,
          longitude: dynamicMarker.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        onPoiClick={(e) => {
          setDynamicMarker(e.nativeEvent.coordinate),
            setTitle(e.nativeEvent.name)
          console.log('co ---- >  ', e.nativeEvent.placeId, ' --- ', e.nativeEvent.name)
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      // mapPadding={50}
      >
        {dynamicMarker &&
          <Marker
            coordinate={dynamicMarker}
            title={title}
          />
        }
        <Marker
          coordinate={{
            latitude: myPlace.features[0].geometry.coordinates[0],
            longitude: myPlace.features[0].geometry.coordinates[1],
          }}
          title={myPlace.features[0].geometry.type}
          description={myPlace.features[0].properties.name}
        />
        {marker.map(marker => (
          <Marker
            coordinate={marker.coordinates}
            title={marker.title}
            pinColor='green'
            draggable>
            <CustomMarker item={marker} />
            <Callout>
              <View style={{ width: 140, height: 40 }}>
                <Text>{marker.title}</Text>
                <Text>{marker.description}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
        <Polyline
          coordinates={marker.map(marker => {
            return { latitude: marker.coordinates.latitude, longitude: marker.coordinates.longitude }
          })}
          strokeWidth={2}
          strokeColors={['#d2f', "#235", "red"]}
        />
        {/* <Polygon
          coordinates={marker.map(marker => {
            return { latitude: marker.coordinates.latitude, longitude: marker.coordinates.longitude }
          })}
          strokeWidth={2}
          strokeColor={'#bbc456'}
          fillColor={'#edf321'}
          lineCap='butt'
          onPress={() => { console.log('polygn pressed') }}
          tappable={true}
        /> */}
        {marker.map(marker => (
          <Circle
            center={{ latitude: marker.coordinates.latitude, longitude: marker.coordinates.longitude }}
            radius={30}
          />
        ))}
        <Heatmap
          points={marker.map(marker => {
            return { latitude: marker.coordinates.latitude, longitude: marker.coordinates.longitude, }
          })}
          radius={150}
          opacity={0.5}
          gradient={{
            colors: ['red', 'blue'],
            startPoints: [0.2, 1.0],
            colorMapSize: 20
          }}
        />
        <Geojson
          geojson={myPlace}
          strokeColor='red'
          fillColor='green'
          strokeWidth={2}
          lineDashPhase={5}
        />
        <Overlay
          image={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8a6EsTEf93twyOpS9_URWzGMhR9oPT5tSRw&usqp=CAU' }}
          bounds={[[3.151, 101.656], [3.151250, 101.658]]}
          bearing={360}
          tappable={true}
          opacity={0.5}
        />
        <Marker
          coordinate={coordinates[0]}
        />
        <Marker
          coordinate={coordinates[1]}
        />
        <Polyline
          coordinates={coordinates}
          strokeColor='red'
          strokeWidth={2}
        />
        <MapViewDirections
          origin={coordinates[0]}
          destination={coordinates[1]}
          apikey={GOOGLE_MAPS_APIKEY}
        />
      </MapView>
    </View>
  )
}

export default App

const styles = StyleSheet.create({})