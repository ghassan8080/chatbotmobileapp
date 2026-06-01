import React, { useState, useCallback, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Platform, StatusBar, Linking } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getChatRequests, dismissChatRequest } from '../api/chatRequestsApi';
import ScreenHeader from '../components/ScreenHeader';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { AuthContext } from '../context/AuthContext';

const ChatRequestsScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [chatRequests, setChatRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Immediate authorization guard to navigate away if unauthorized
  useEffect(() => {
    if (!user?.store_name) {
      navigation.navigate('Home');
    }
  }, [user, navigation]);

  const loadRequests = async () => {
    if (!user?.store_name) return;
    try {
      const data = await getChatRequests();
      setChatRequests(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (user?.store_name) {
        loadRequests();
      }
    }, [user?.store_name])
  );

  // Return null if not authorized so nothing renders or triggers side effects
  if (!user?.store_name) {
    return null;
  }

  const handleDismiss = async (senderId) => {
    try {
      setChatRequests(prev => prev.filter(req => req.senderId !== senderId));
      await dismissChatRequest(senderId);
    } catch (e) {
      alert('حدث خطأ');
      loadRequests(); // reload if failed
    }
  };

  const renderItem = ({ item }) => {
    // Calculate time since request
    const reqDate = new Date(item.requestedAt);
    const now = new Date();
    const diffMs = now - reqDate;
    const diffMins = Math.floor(diffMs / 60000);
    const timeText = diffMins > 60 
      ? `منذ ${Math.floor(diffMins / 60)} ساعة` 
      : `منذ ${diffMins} دقيقة`;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>💬 زبون يريد التحدث معك</Text>
        </View>
        
        <View style={styles.cardBody}>
          <Text style={styles.detailText}>الزبون: {item.customerName}</Text>
          <Text style={styles.timeText}>{timeText}</Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]} 
            onPress={() => Linking.openURL(item.messengerLink)}
          >
            <Text style={styles.primaryButtonText}>فتح المحادثة 💬</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={() => handleDismiss(item.senderId)}
          >
            <Text style={styles.secondaryButtonText}>تم الرد ✓ - إخفاء الإشعار</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {Platform.OS === 'android' && <StatusBar backgroundColor="#fdf3ff" barStyle="dark-content" />}
      <ScreenHeader 
        title="استفسارات الزبائن" 
        leftAction={{
          icon: 'arrow-back',
          onPress: () => navigation.goBack()
        }}
      />
      <View style={styles.container}>
        {loading ? (
          <LoadingSpinner text="جاري التحميل..." />
        ) : (
          <FlatList
            data={chatRequests}
            keyExtractor={item => String(item.id || item.senderId)}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <EmptyState
                icon="chatbubbles-outline"
                title="لا توجد استفسارات حالياً 🎉"
                subtitle="جميع زبائنك راضون أو لا يوجد رسائل جديدة"
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fdf3ff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fdf3ff',
  },
  listContent: {
    padding: 20,
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#6a1cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0e6ff',
    paddingBottom: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6a1cf6',
    textAlign: 'right',
  },
  cardBody: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  detailText: {
    fontSize: 14,
    color: '#38274c',
    marginBottom: 4,
    fontWeight: '600',
  },
  timeText: {
    fontSize: 13,
    color: '#8a7a9c',
  },
  actionRow: {
    flexDirection: 'column',
    gap: 10,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#6a1cf6',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryButton: {
    backgroundColor: '#fdf3ff',
    borderWidth: 1,
    borderColor: '#e0caff',
  },
  secondaryButtonText: {
    color: '#6a1cf6',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default ChatRequestsScreen;
