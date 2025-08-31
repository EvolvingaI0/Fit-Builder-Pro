import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api';
import { MealLog } from '@/lib/types';
import Card from '@/components/ui/Card';
import MealLogCard from '@/components/MealLogCard';

export default function AnalyzeScreen() {
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MealLog | null>(null);

  const pickImage = async (useCamera: boolean) => {
    let permissionResult;
    if (useCamera) {
      permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    } else {
      permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    }

    if (permissionResult.granted === false) {
      Alert.alert("Permission required", "You've refused to allow this app to access your photos/camera.");
      return;
    }

    const pickerFunc = useCamera ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync;
    
    const result = await pickerFunc({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    
    if (!result.canceled) {
      setImage(result.assets[0]);
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('image', {
      uri: image.uri,
      name: image.fileName || 'photo.jpg',
      type: image.mimeType || 'image/jpeg',
    } as any);

    try {
      const response = await api.post('/food/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
    } catch (error: any) {
      console.error('Analysis error:', error);
      Alert.alert('Analysis Failed', error.response?.data?.message || 'Could not analyze the image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!image && (
        <View style={styles.placeholder}>
            <Text style={styles.placeholderTitle}>Analyze a Meal</Text>
            <Text style={styles.placeholderText}>Pick an image from your gallery or take a new photo to get an instant nutritional analysis.</Text>
        </View>
      )}

      {image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image.uri }} style={styles.image} />
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Pick from Gallery" onPress={() => pickImage(false)} style={{ flex: 1 }} variant="secondary" />
        <Button title="Use Camera" onPress={() => pickImage(true)} style={{ flex: 1, marginLeft: 10 }} variant="secondary" />
      </View>

      <Button title="Analyze Meal" onPress={handleAnalyze} disabled={!image || loading} loading={loading} />

      {result && (
        <Card style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Analysis Result</Text>
          <MealLogCard meal={result} />
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F7F8FA',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 12,
    marginBottom: 24,
    backgroundColor: '#fff',
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  placeholderText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  resultsContainer: {
    marginTop: 24,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
