import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useI18n } from '../contexts/I18nContext';

interface Props {
  visible: boolean;
  onClose: () => void;
  onLogout?: () => void; // optional logout handler (for driver)
}

export default function SettingsModal({ visible, onClose, onLogout }: Props) {
  const { theme, mode, toggleMode } = useTheme();
  const { lang, setLang, t } = useI18n();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}> 
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{t('settings')}</Text>

          <View style={styles.row}> 
            <Text style={[styles.label, { color: theme.colors.textPrimary }]}>{t('theme')}</Text>
            <View style={styles.rowRight}>
              <Text style={{ color: theme.colors.textSecondary, marginRight: 8 }}>{mode === 'dark' ? t('dark') : t('light')}</Text>
              <Switch value={mode === 'dark'} onValueChange={toggleMode} />
            </View>
          </View>

          <View style={styles.row}> 
            <Text style={[styles.label, { color: theme.colors.textPrimary }]}>{t('language')}</Text>
            <View style={styles.rowRight}>
              <TouchableOpacity style={[styles.pill, { borderColor: theme.colors.border, backgroundColor: lang === 'en' ? theme.colors.searchBg : 'transparent' }]} onPress={() => setLang('en')}>
                <Text style={{ color: theme.colors.textPrimary }}>{t('english')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.pill, { borderColor: theme.colors.border, backgroundColor: lang === 'ar' ? theme.colors.searchBg : 'transparent' }]} onPress={() => setLang('ar')}>
                <Text style={{ color: theme.colors.textPrimary }}>{t('arabic')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {onLogout && (
            <TouchableOpacity style={[styles.logoutBtn, { borderColor: theme.colors.border }]} onPress={onLogout}>
              <Text style={[styles.logoutText, { color: '#FF3B30' }]}>Logout</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={[styles.closeBtn, { backgroundColor: theme.colors.primary }]} onPress={onClose}>
            <Text style={styles.closeText}>{t('close')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    marginLeft: 8,
  },
  closeBtn: {
    marginTop: 16,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutBtn: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
  },
  closeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});


