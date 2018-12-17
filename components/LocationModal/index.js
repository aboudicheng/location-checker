import React, { Component } from 'react';
import { Text, View, StyleSheet, Modal, Alert } from 'react-native';
import {
  Button,
  FormLabel,
  FormInput,
  FormValidationMessage,
} from 'react-native-elements';

class LocationModal extends Component {
  state = {
    locationField: '',
    errorMessage: '',
  };

  handleLocationField = text => {
    this.setState({ locationField: text });
  };

  validateLocation = location => {
    if (location.length === 0) {
      this.setState({ errorMessage: 'Please type something!' });
      return false;
    } else {
      this.setState({ locationField: '', errorMessage: '' });
      return true;
    }
  };

  handleAddButton = () => {
    const { modalVisible, handleModal, addLocation } = this.props;
    const { locationField, errorMessage } = this.state;

    if (this.validateLocation(locationField)) {
      addLocation(locationField);
      handleModal(!modalVisible);
    }
  };

  render() {
    const { locationField, errorMessage } = this.state;
    const { modalVisible } = this.props;
    return (
      <View>
        <Modal animationType="slide" transparent={false} visible={modalVisible}>
          <View style={styles.container}>
            <View style={{ width: '100%' }}>
              <FormLabel>Location</FormLabel>
              <FormInput onChangeText={this.handleLocationField} />
              <FormValidationMessage>
                {errorMessage}
              </FormValidationMessage>
            </View>
            <View style={{ width: '100%' }}>
              <Button title="Add" onPress={this.handleAddButton}>
                <Text>Hide Modal</Text>
              </Button>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexFlow: 'row wrap',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    padding: 15,
  },
});

export default LocationModal;
