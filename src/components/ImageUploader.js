/**
 * ImageUploader Component
 * Component for selecting and previewing product images
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';

const ImageUploader = ({ images = [], onAddImage, onRemoveImage, maxImages = 4 }) => {
  const handleAddImage = () => {
    if (Platform.OS === 'web') {
      // On web, directly open the file picker (gallery)
      // Browsers often allow taking a photo from the file picker interface on mobile
      onAddImage('gallery');
      return;
    }

    Alert.alert(
      STRINGS.selectImage,
      '',
      [
        {
          text: STRINGS.cancel,
          style: 'cancel',
        },
        {
          text: STRINGS.takePhoto,
          onPress: () => onAddImage('camera'),
        },
        {
          text: STRINGS.chooseFromGallery,
          onPress: () => onAddImage('gallery'),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{STRINGS.productImages}</Text>
      <Text style={styles.subLabel}>{STRINGS.maxImages}</Text>

      <ScrollView horizontal style={styles.imageContainer} showsHorizontalScrollIndicator={false}>
        {images.map((image, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri: image.uri }} style={styles.image} resizeMode="cover" />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => onRemoveImage(index)}
            >
              <Ionicons name="close-circle" size={24} color={COLORS.error} />
            </TouchableOpacity>
          </View>
        ))}

        {images.length < maxImages && (
          <TouchableOpacity style={styles.addButton} onPress={handleAddImage}>
            <Ionicons name="add-circle" size={40} color={COLORS.primary} />
            <Text style={styles.addButtonText}>{STRINGS.uploadImage}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  subLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginBottom: 12,
  },
  imageContainer: {
    flexDirection: 'row',
  },
  imageWrapper: {
    position: 'relative',
    marginLeft: 8,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  addButtonText: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 4,
    fontWeight: 'bold',
  },
});

export default ImageUploader;
