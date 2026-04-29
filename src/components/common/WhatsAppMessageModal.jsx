import React, {useState, useEffect} from 'react';
import {
  Modal, View, Text, StyleSheet, TouchableOpacity,
  TextInput, ScrollView, Share,
} from 'react-native';
import {colors} from '../../theme/colors';
import {shadows} from '../../theme/spacing';

const buildMessage = ({travellerName, senderName, subordinateName, airportName, terminalName, date, flightNo, flightTime, from, to, arrivalDeparture, phone}) => {
  const arrDep = arrivalDeparture === 'ARRIVAL' ? 'Arrival' : 'Departure';
  const lines = [
    `Dear ${travellerName || '__________'},`,
    '',
    `This side ${senderName},`,
    `Income Tax Officer (HQ) Airport Protocol, Mumbai.`,
    '',
    `${subordinateName} (Subordinate) will be facilitating you at`,
    `${airportName}${terminalName ? `, ${terminalName}` : ''} on ${date}`,
    `for your ${arrDep} — Flight ${flightNo} at ${flightTime}`,
    `(${from} → ${to}).`,
    '',
    `Contact No: ${phone || '__________'}`,
    '',
    `Regards,`,
    senderName,
  ];
  return lines.join('\n');
};

const WhatsAppMessageModal = ({visible, duty, senderName, senderPhone, subordinatePhone, onClose}) => {
  const [travellerName, setTravellerName] = useState('');

  useEffect(() => {
    if (visible) setTravellerName('');
  }, [visible]);

  const phone = duty?.officerName === senderName ? senderPhone : subordinatePhone;

  const message = buildMessage({
    travellerName,
    senderName: senderName || '',
    subordinateName: duty?.officerName || '',
    airportName: duty?.airportName || '',
    terminalName: duty?.terminalName || '',
    date: duty?.date || '',
    flightNo: duty?.flightNo || '',
    flightTime: duty?.flightTime || '',
    from: duty?.from || '',
    to: duty?.to || '',
    arrivalDeparture: duty?.arrivalDeparture || '',
    phone,
  });

  const handleShare = async () => {
    try {
      await Share.share({message});
    } catch {}
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>

          <View style={styles.header}>
            <Text style={styles.title}>📤 WhatsApp Message</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
              <Text style={styles.closeX}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subTitle}>Duty created successfully. Generate a message to share with the traveller.</Text>

          <Text style={styles.label}>Name of Traveller</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter traveller name"
            placeholderTextColor={colors.textSecondary}
            value={travellerName}
            onChangeText={setTravellerName}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Message Preview</Text>
          <ScrollView style={styles.previewBox} nestedScrollEnabled showsVerticalScrollIndicator={false}>
            <Text style={styles.previewText} selectable>{message}</Text>
          </ScrollView>

          <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
            <Text style={styles.shareBtnText}>📲 Share / Copy via WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
            <Text style={styles.doneBtnText}>Done</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 20, maxHeight: '90%', ...shadows.md,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 6,
  },
  title: {fontSize: 17, fontWeight: '700', color: colors.text},
  closeX: {fontSize: 18, color: colors.textSecondary, fontWeight: '600'},
  subTitle: {fontSize: 12, color: colors.textSecondary, marginBottom: 14, lineHeight: 17},
  label: {fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 6},
  input: {
    borderWidth: 1.5, borderColor: colors.border, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 15,
    color: colors.text, backgroundColor: colors.surface, marginBottom: 14,
  },
  previewBox: {
    backgroundColor: '#F0FDF4', borderRadius: 10, padding: 14,
    borderWidth: 1, borderColor: '#86EFAC', maxHeight: 200, marginBottom: 16,
  },
  previewText: {fontSize: 13, color: '#166534', lineHeight: 20},
  shareBtn: {
    backgroundColor: '#25D366', borderRadius: 10, paddingVertical: 14,
    alignItems: 'center', marginBottom: 10,
  },
  shareBtnText: {color: colors.white, fontSize: 15, fontWeight: '700'},
  doneBtn: {
    borderWidth: 1.5, borderColor: colors.border, borderRadius: 10,
    paddingVertical: 12, alignItems: 'center',
  },
  doneBtnText: {fontSize: 14, color: colors.textSecondary, fontWeight: '500'},
});

export default WhatsAppMessageModal;
