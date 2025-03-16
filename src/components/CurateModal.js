import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CurateModal = ({ visible, onClose, onStartFromScratch }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#ffffff" />
          </TouchableOpacity>
          
          <Image 
            source={{ uri: 'https://stl.parium.org/_next/image?url=https%3A%2F%2Fjh3ara5st4lltzzi.public.blob.vercel-storage.com%2Fstlparium_assets%2F1751ec73ad3cb3313915e24c4382ee11ea4dc0d6c8d3062b362d81d5150fccbf_delete-lVjFs7YNXsxy3rypP7B6wzs3dhnJpS.jpg&w=3840&q=75' }} 
            style={styles.experienceImage}
            resizeMode="cover"
          />
          
          <Text style={styles.modalTitle}>Create an Experience</Text>
          <Text style={styles.modalDescription}>
            Design a perfect experience in St. Louis by selecting places to visit, 
            adding notes, and creating a shareable itinerary. Curated experiences 
            help you and others discover the best of STL.
          </Text>
          
          <TouchableOpacity
            style={styles.startButton}
            onPress={onStartFromScratch}
          >
            <Text style={styles.startButtonText}>Create Experience</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    padding: 30,
    width: '90%',
    maxWidth: 350,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 2, // Add padding to visually center the X
  },
  experienceImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#ffffff',
  },
  modalDescription: {
    fontSize: 16,
    color: '#dddddd',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  startButton: {
    backgroundColor: '#3498db',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    width: '100%',
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  }
});

export default CurateModal;