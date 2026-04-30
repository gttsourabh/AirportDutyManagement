import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {changePasswordApi} from '../../api/authApi';
import {colors} from '../../theme/colors';
import {shadows} from '../../theme/spacing';

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmPassword)
      return Alert.alert('Error', 'All fields are required');
    if (newPassword.length < 6)
      return Alert.alert('Error', 'New password must be at least 6 characters');
    if (newPassword !== confirmPassword)
      return Alert.alert('Error', 'New passwords do not match');
    if (currentPassword === newPassword)
      return Alert.alert('Error', 'New password must be different from current password');

    setLoading(true);
    try {
      await changePasswordApi(currentPassword, newPassword);
      Alert.alert('Success', 'Password changed successfully', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (err) {
      Alert.alert('Error', err?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Change Password</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Current Password</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry={!showCurrent}
            placeholder="Enter current password"
            placeholderTextColor={colors.textDisabled}
          />
          <TouchableOpacity onPress={() => setShowCurrent(v => !v)}>
            <Text style={styles.eye}>{showCurrent ? '🙈' : '👁'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>New Password</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showNew}
            placeholder="At least 6 characters"
            placeholderTextColor={colors.textDisabled}
          />
          <TouchableOpacity onPress={() => setShowNew(v => !v)}>
            <Text style={styles.eye}>{showNew ? '🙈' : '👁'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Confirm New Password</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirm}
            placeholder="Re-enter new password"
            placeholderTextColor={colors.textDisabled}
          />
          <TouchableOpacity onPress={() => setShowConfirm(v => !v)}>
            <Text style={styles.eye}>{showConfirm ? '🙈' : '👁'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleSubmit} disabled={loading}>
          {loading
            ? <ActivityIndicator color={colors.white} />
            : <Text style={styles.btnText}>Change Password</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.background},
  header: {flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border},
  backBtn: {marginRight: 12},
  backText: {color: colors.primary, fontSize: 15, fontWeight: '500'},
  title: {fontSize: 18, fontWeight: '700', color: colors.text},
  card: {margin: 16, backgroundColor: colors.white, borderRadius: 12, padding: 20, ...shadows.sm},
  label: {fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 6, marginTop: 14},
  inputRow: {flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 12, backgroundColor: colors.background},
  input: {flex: 1, paddingVertical: 12, fontSize: 15, color: colors.text},
  eye: {fontSize: 18, paddingLeft: 8},
  btn: {backgroundColor: colors.primary, borderRadius: 10, padding: 15, alignItems: 'center', marginTop: 24},
  btnText: {color: colors.white, fontWeight: '700', fontSize: 15},
});

export default ChangePasswordScreen;
