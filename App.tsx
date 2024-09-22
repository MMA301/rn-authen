import { StatusBar } from "expo-status-bar";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { Entypo } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import * as LocalAuthentication from "expo-local-authentication";

export default function App() {
  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  });

  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  const fallBackToDefaultAuth = () => {
    console.info("Fallback to password authentication");
  };

  const handleBiometricAuth = async () => {
    console.info("Biometric authentication started");
    const isBiometricSupported = await LocalAuthentication.hasHardwareAsync();
    setIsBiometricSupported(isBiometricSupported);

    if (!isBiometricSupported) {
      return fallBackToDefaultAuth();
    }

    const isBiometricEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!isBiometricEnrolled) {
      return fallBackToDefaultAuth();
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to login",
      cancelLabel: "Cancel",
      disableDeviceFallback: true,
    });

    if (result.success) {
      console.info("Biometric authentication successful");
      Alert.alert("Success", "Biometric authentication successful");
    }
  };

  return (
    <View style={tw`flex-1 bg-white items-center justify-center`}>
      <View style={tw`mb-[100px]`}>
        <Text style={tw`text-center text-lg`}>Welcome my app</Text>
        <Text>
          {" "}
          {isBiometricSupported
            ? "Your device is compatible with Biometrics"
            : "Face or Fingerprint scanner is available on this device"}
        </Text>
      </View>

      <View style={tw`flex flex-row items-center gap-4`}>
        <TouchableOpacity onPress={handleBiometricAuth}>
          <Entypo name="fingerprint" size={50} color="black" />
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}
