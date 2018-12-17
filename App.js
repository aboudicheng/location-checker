import * as React from 'react';
import { Text, View, StyleSheet, Modal, Alert } from 'react-native';
import { Button, List, ListItem } from 'react-native-elements';
import LocationModal from './components/LocationModal';
import Swipeout from 'react-native-swipeout';
import { Constants } from 'expo';
import Geocoder from 'react-native-geocoding';
import { getDistanceFromLatLonInKm } from './helpers';

// You can import from local files
import AssetExample from './components/AssetExample';

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';

Geocoder.init('AIzaSyA5piMjNTfMzHqS7Ag7vtdtzMLN8xv6neI');

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
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  handleModal = modalVisible => {
    this.setState({ modalVisible });
  };

  addLocation = location => {
    const { latitude, longitude } = this.state;
    const distance = parseInt(getDistanceFromLatLonInKm(37.874643,32.493155, latitude, longitude ));

    console.log(distance)

    this.setState(prevState => ({
      locations: [...prevState.locations, {name: location, distance}],
    }));

    // Geocoder.from(location)
    //   .then(json => {
    //     var loc = json.results[0].geometry.location;
        
    //   })
    //   .catch(error => console.warn(error));
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
              <ListItem key={i} title={location.name} subtitle={`${location.distance} km`} />
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
