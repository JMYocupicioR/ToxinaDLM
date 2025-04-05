import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  User, Info, Package, Bell, Moon, Sun, Languages, Lock, 
  HelpCircle, FileText, Trash2, ShieldCheck, Mail, ExternalLink
} from 'lucide-react-native';
import { getSettings, saveSettings, clearCalculationHistory, AppSettings } from '@/services/storageService';

export default function SettingsScreen() {
  // State
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [areNotificationsEnabled, setAreNotificationsEnabled] = useState(true);
  const [useMetricUnits, setUseMetricUnits] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  const version = '1.0.0';
  
  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const settings = await getSettings();
        if (settings) {
          setIsDarkMode(settings.isDarkMode);
          setAreNotificationsEnabled(settings.areNotificationsEnabled);
          setUseMetricUnits(settings.useMetricUnits);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, []);
  
  // Save settings to AsyncStorage
  const saveSettingsChanges = async (settings: AppSettings) => {
    try {
      await saveSettings(settings);
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings.');
    }
  };
  
  // Handle dark mode toggle
  const handleDarkModeToggle = (value: boolean) => {
    setIsDarkMode(value);
    saveSettingsChanges({
      isDarkMode: value,
      areNotificationsEnabled,
      useMetricUnits
    });
  };
  
  // Handle notifications toggle
  const handleNotificationsToggle = (value: boolean) => {
    setAreNotificationsEnabled(value);
    saveSettingsChanges({
      isDarkMode,
      areNotificationsEnabled: value,
      useMetricUnits
    });
  };
  
  // Handle metric units toggle
  const handleMetricUnitsToggle = (value: boolean) => {
    setUseMetricUnits(value);
    saveSettingsChanges({
      isDarkMode,
      areNotificationsEnabled,
      useMetricUnits: value
    });
  };
  
  // Handle clearing calculation history
  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear your calculation history? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          onPress: async () => {
            try {
              const success = await clearCalculationHistory();
              if (success) {
                Alert.alert('Success', 'Calculation history has been cleared.');
              } else {
                Alert.alert('Error', 'Failed to clear calculation history.');
              }
            } catch (error) {
              console.error('Error clearing history:', error);
              Alert.alert('Error', 'Failed to clear calculation history.');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  // Open DeepLuxMed website
  const openWebsite = () => {
    Linking.openURL('https://deepluxmed.mx');
  };
  
  // Open support email
  const openEmail = () => {
    Linking.openURL('mailto:support@deepluxmed.mx');
  };
  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0891b2" />
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Settings</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <User size={20} color="#0891b2" style={styles.settingIcon} />
                <Text style={styles.settingText}>Profile</Text>
              </View>
              <Text style={styles.settingDetail}>Dr. Yocupicio</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Package size={20} color="#0891b2" style={styles.settingIcon} />
                <Text style={styles.settingText}>Subscription</Text>
              </View>
              <Text style={styles.settingDetail}>Professional</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Application</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                {isDarkMode ? (
                  <Moon size={20} color="#0891b2" style={styles.settingIcon} />
                ) : (
                  <Sun size={20} color="#0891b2" style={styles.settingIcon} />
                )}
                <Text style={styles.settingText}>Dark Mode</Text>
              </View>
              <Switch
                trackColor={{ false: '#e2e8f0', true: '#0e7490' }}
                thumbColor={'#ffffff'}
                onValueChange={handleDarkModeToggle}
                value={isDarkMode}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Bell size={20} color="#0891b2" style={styles.settingIcon} />
                <Text style={styles.settingText}>Notifications</Text>
              </View>
              <Switch
                trackColor={{ false: '#e2e8f0', true: '#0e7490' }}
                thumbColor={'#ffffff'}
                onValueChange={handleNotificationsToggle}
                value={areNotificationsEnabled}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Languages size={20} color="#0891b2" style={styles.settingIcon} />
                <Text style={styles.settingText}>Use Metric Units</Text>
              </View>
              <Switch
                trackColor={{ false: '#e2e8f0', true: '#0e7490' }}
                thumbColor={'#ffffff'}
                onValueChange={handleMetricUnitsToggle}
                value={useMetricUnits}
              />
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data</Text>
            
            <TouchableOpacity style={styles.settingItem} onPress={handleClearHistory}>
              <View style={styles.settingInfo}>
                <Trash2 size={20} color="#ef4444" style={styles.settingIcon} />
                <Text style={[styles.settingText, { color: '#ef4444' }]}>Clear Calculation History</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Help & Information</Text>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <HelpCircle size={20} color="#0891b2" style={styles.settingIcon} />
                <Text style={styles.settingText}>Help Center</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <FileText size={20} color="#0891b2" style={styles.settingIcon} />
                <Text style={styles.settingText}>Terms of Service</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <ShieldCheck size={20} color="#0891b2" style={styles.settingIcon} />
                <Text style={styles.settingText}>Privacy Policy</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem} onPress={openEmail}>
              <View style={styles.settingInfo}>
                <Mail size={20} color="#0891b2" style={styles.settingIcon} />
                <Text style={styles.settingText}>Contact Support</Text>
              </View>
              <Text style={styles.settingDetail}>support@deepluxmed.mx</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem} onPress={openWebsite}>
              <View style={styles.settingInfo}>
                <ExternalLink size={20} color="#0891b2" style={styles.settingIcon} />
                <Text style={styles.settingText}>Visit Website</Text>
              </View>
              <Text style={styles.settingDetail}>deepluxmed.mx</Text>
            </TouchableOpacity>
            
            <View style={styles.versionContainer}>
              <View style={styles.versionRow}>
                <Info size={16} color="#94a3b8" />
                <Text style={styles.versionText}>Version {version}</Text>
              </View>
              <Text style={styles.copyright}>© 2025 DeepLuxMed. All rights reserved.</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 14,
    color: '#334155',
    flex: 1,
  },
  settingDetail: {
    fontSize: 12,
    color: '#64748b',
  },
  versionContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 13,
    color: '#94a3b8',
    marginLeft: 8,
  },
  copyright: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
});