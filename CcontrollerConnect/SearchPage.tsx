import React, { useRef, useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './App'; // your navigator types
import {
  View,
  Text,
  Button,
  FlatList,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';

// ESP32 service UUID
const SERVICE_UUID = '66666666-6666-6666-6666-666666666666';
const SCAN_DURATION = 5000; 
const CONNECTION_TIMEOUT = 5000; 
type SearchPageNavigationProp = StackNavigationProp<RootStackParamList, 'Search'>;

const manager = new BleManager();

const SearchPage: React.FC = () => {
  const navigation = useNavigation<SearchPageNavigationProp>();
  const [devices, setDevices] = useState<Device[]>([]);
  const [scanning, setScanning] = useState(false);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const discoveredIds = useRef<Set<string>>(new Set());

  // Request Android permissions
  const requestPermissions = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;

    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    ]);

    return Object.values(granted).every(v => v === PermissionsAndroid.RESULTS.GRANTED);
  };

  // Scan BLE devices
  const startScan = async () => {
    const ok = await requestPermissions();
    if (!ok) {
      setMessage('Bluetooth permissions required.');
      return;
    }

    setDevices([]);
    discoveredIds.current.clear();
    setScanning(true);
    setMessage('');

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.warn('Scan error:', error);
        setScanning(false);
        setMessage('Scan error: ' + error.message);
        return;
      }

      // Only named devices and not already discovered
      if (!device || !device.name || discoveredIds.current.has(device.id)) return;

      discoveredIds.current.add(device.id);
      setDevices(prev => [...prev, device]);
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      setScanning(false);
    }, SCAN_DURATION);
  };

  // Connect to device and check service UUID
  const connectDevice = async (device: Device) => {
    if (connectingId) return;
    setConnectingId(device.id);
    setMessage('');

    try {
      manager.stopDeviceScan();

      const connected: Device = await Promise.race([
        manager.connectToDevice(device.id),
        new Promise<Device>((_, reject) =>
          setTimeout(() => reject(new Error('Connection timeout')), CONNECTION_TIMEOUT)
        ),
      ]);

      await connected.discoverAllServicesAndCharacteristics();

      const services = await connected.services();
      console.log(`Services of ${device.name}:`);
      services.forEach(s => console.log(' -', s.uuid));

      const hasService = services.some(
        s => s.uuid.toLowerCase() === SERVICE_UUID.toLowerCase()
      );

      if (!hasService) {
        await connected.cancelConnection();
        setMessage('Device does not have required Service UUID');
        return;
      }
      if (hasService){
           setMessage('Connected! Device has correct Service UUID');
          // Navigate to Connected page
          navigation.replace('Connected', { deviceId: connected.id });
      }
    } catch (err: unknown) {
      console.warn('Connection error:', err instanceof Error ? err.message : err);
      setMessage(err instanceof Error ? err.message : 'Connection failed.');
    } finally {
      setConnectingId(null);
    }
  };

  // Cleanup scanning when unmount
  useEffect(() => {
    return () => {
      manager.stopDeviceScan();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Button
        title={scanning ? 'Scanning...' : 'Scan Devices'}
        onPress={startScan}
        disabled={scanning}
      />

      {scanning && (
        <ActivityIndicator size="large" color="#007bff" style={{ marginVertical: 10 }} />
      )}

      {message.length > 0 && <Text style={styles.message}>{message}</Text>}

      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.deviceContainer}>
            <Text style={styles.deviceText}>{item.name}</Text>
            <Text style={styles.deviceText}>ID: {item.id}</Text>
            <Button
              title={connectingId === item.id ? 'Connecting...' : 'Connect'}
              onPress={() => connectDevice(item)}
              disabled={!!connectingId}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  deviceContainer: { marginVertical: 5, padding: 10, backgroundColor: '#eee', borderRadius: 5 },
  deviceText: { marginBottom: 5 },
  message: { color: 'green', marginVertical: 10, fontWeight: '600' },
});

export default SearchPage;
