import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import diamond from "./assets/diamond.png";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity,
  Platform,
} from "react-native";
import uploadToAnonymousFilesAsync from "anonymous-files";
import * as ImagePicker from "expo-image-picker";
import * as Sharing from "expo-sharing";

export default function App() {
  const [image, setImage] = useState(null);

  const openImagePickerAsync = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access camera is required");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.cancelled) {
      return;
    }

    if (Platform.OS === "web") {
      const remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
      setImage({ localUri: pickerResult.uri, remoteUri });
    } else {
      setImage({ localUri: pickerResult.uri });
    }
  };

  const openSharedDialog = async () => {
    const isAvailableSharing = await Sharing.isAvailableAsync();

    if (!isAvailableSharing) {
      alert(`The image is availbale on the link: ${image.remoteUri}`);
      return;
    }

    await Sharing.shareAsync(image?.localUri);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pick an Image!</Text>
      <Image style={styles.image} source={diamond} />
      <TouchableOpacity onPress={openImagePickerAsync}>
        <Image
          style={styles.image}
          source={{
            uri:
              image?.localUri ||
              image?.remoteUri ||
              "https://picsum.photos/200/200",
          }}
        />
      </TouchableOpacity>
      {image && <Button title="SHARED IMAGE" onPress={openSharedDialog} />}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    color: "#fff",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    resizeMode: "contain",
    margin: 10,
  },
  button: {
    backgroundColor: "blue",
    borderRadius: 100,
    margin: 7,
    padding: 10,
  },
  buttonText: {
    color: "#fff",
  },
});
