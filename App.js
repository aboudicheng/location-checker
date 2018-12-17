import * as React from 'react';
import { Text, View, StyleSheet, Modal, Alert } from 'react-native';
import { Button, List, ListItem } from 'react-native-elements';
import LocationModal from './components/LocationModal';
import Swipeout from 'react-native-swipeout';
import { Constants } from 'expo';
import { getDistanceFromLatLonInKm } from './helpers';

// You can import from local files
import AssetExample from './components/AssetExample';

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';

const access_token =
  'pk.eyJ1IjoiYWJvdWRpY2hlbmciLCJhIjoiY2pwc3B0cjNuMHZuOTQybWg4aDQzZTY3aiJ9.7kmPDh-Z0RQTNexDxB5aVA';

export default class App extends React.Component {
  state = {
    locations: [],
    locationField: '',
    modalVisible: false,
    latitude: null,
    longitude: null,
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        console.log(position);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  handleModal = modalVisible => {
    this.setState({ modalVisible });
  };

  addLocation = location => {
    const { latitude, longitude } = this.state;
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${access_token}`
    )
      .then(res => res.json())
      .then(data => {
        const long = data.features[0].center[0];
        const lat = data.features[0].center[1];

        const dist = getDistanceFromLatLonInKm(lat, long, latitude, longitude);

        let distance;
        if (dist < 2) {
          distance = parseInt(dist * 1000) + ' m';
        } else {
          distance = parseInt(dist) + ' km';
        }

        console.log(distance);
        this.setState(prevState => ({
          locations: [...prevState.locations, { name: location, distance }],
        }));
      });
  };

  deleteItem = key => {
    const arr = [...this.state.locations];
    arr.splice(key, 1);
    this.setState({ locations: arr });
  };

  render() {
    const { locations, locationField, modalVisible } = this.state;

    return (
      <View style={styles.container}>
        <LocationModal
          modalVisible={modalVisible}
          handleModal={this.handleModal}
          addLocation={this.addLocation}
        />

        <List containerStyle={{ marginBottom: 20 }}>
          {locations.map((location, i) => (
            <Swipeout
              right={[
                {
                  text: 'remove',
                  backgroundColor: 'red',
                  underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
                  onPress: () => this.deleteItem(i),
                },
              ]}
              autoClose="true"
              backgroundColor="transparent">
              <ListItem
                key={i}
                title={location.name}
                subtitle={`${location.distance}`}
              />
            </Swipeout>
          ))}
        </List>

        <View>
          <Text style={styles.paragraph}>
            Insert the name of any location you are planning to visit sometime!
          </Text>

          <Button
            style={styles.addButton}
            title="Add Location"
            onPress={() => this.handleModal(true)}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexFlow: 'row wrap',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addButton: {
    position: 'relative',
    right: 0,
    bottom: 0,
  },
});
