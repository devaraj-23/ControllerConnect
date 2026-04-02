import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { BleManager, Device, Subscription } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { RootStackParamList } from './App';

type ConnectedPageNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Connected'
>;
type ConnectedPageRouteProp = RouteProp<RootStackParamList, 'Connected'>;

type Props = {
  navigation: ConnectedPageNavigationProp;
  route: ConnectedPageRouteProp;
};

// Must match your ESP32 firmware UUIDs
const SERVICE_UUID = '66666666-6666-6666-6666-666666666666';
const CHARACTERISTIC_UUID = '77777777-7777-7777-7777-777777777777';

const manager = new BleManager();

const ConnectedPage: React.FC<Props> = ({ navigation, route }) => {
  const { deviceId } = route.params;

  const [device, setDevice] = useState<Device | null>(null);
  const [receivedData, setReceivedData] = useState<string[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let activeDevice: Device | null = null;
    let subscription: Subscription | null = null;

    const connect = async () => {
      try {
        const connectedDevice = await manager.connectToDevice(deviceId, {
          autoConnect: true,
        });
        activeDevice = connectedDevice;

        await connectedDevice.discoverAllServicesAndCharacteristics();
        setDevice(connectedDevice);
        setIsReady(true);

        // Read initial value once in case ESP32 already wrote "Connected..."
        try {
          const char = await connectedDevice.readCharacteristicForService(
            SERVICE_UUID,
            CHARACTERISTIC_UUID
          );
          if (char?.value) {
            const data = Buffer.from(char.value, 'base64').toString('utf-8');
            setReceivedData(prev => [...prev, data]);
          }
        } catch (err) {
          console.warn('Initial read failed:', err);
        }

        // Subscribe for notifications for future updates
        subscription = connectedDevice.monitorCharacteristicForService(
          SERVICE_UUID,
          CHARACTERISTIC_UUID,
          (error, char) => {
            if (error) {
              console.warn('Receive error:', error);
              return;
            }
            if (char?.value) {
              const data = Buffer.from(char.value, 'base64').toString('utf-8');
              setReceivedData(prev => [...prev, data]);
            }
          }
        );
      } catch (err) {
        console.warn('Connection error:', err);
        Alert.alert('Error', 'Failed to connect to device');
      }
    };

    connect();

    return () => {
      if (subscription) {
        subscription.remove();
      }
      if (activeDevice) {
        activeDevice.cancelConnection().catch(() => {});
      }
    };
  }, [deviceId]);

  // Send data to ESP32
  const sendData = async () => {
    if (!device || !inputText.trim()) return;

    try {
      const base64Value = Buffer.from(inputText, 'utf-8').toString('base64');
      await device.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        base64Value
      );
      setInputText('');
    } catch (err) {
      console.warn('Send error:', err);
      Alert.alert('Error', 'Failed to send data');
    }
  };

  // Disconnect
  const handleDisconnect = async () => {
    try {
      if (device) {
        await device.cancelConnection();
      }
    } catch (err) {
      console.warn('Disconnect error:', err);
    }
    navigation.replace('Search');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Connected to Device</Text>
      <Text style={styles.deviceId}>Device ID: {deviceId}</Text>

      <View style={styles.sendContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter text to send"
          value={inputText}
          onChangeText={setInputText}
        />
        <Button title="Send" onPress={sendData}  />
      </View>

      <Text style={styles.subTitle}>Received Data:</Text>
      <FlatList
        data={receivedData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.dataContainer}>
            <Text>{item}</Text>
          </View>
        )}
      />

      <Button title="Disconnect" onPress={handleDisconnect} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 10 },
  deviceId: { marginBottom: 20 },
  sendContainer: { flexDirection: 'row', marginBottom: 20 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  subTitle: { fontSize: 18, fontWeight: '500', marginBottom: 10 },
  dataContainer: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    marginBottom: 5,
  },
});

export default ConnectedPage;
