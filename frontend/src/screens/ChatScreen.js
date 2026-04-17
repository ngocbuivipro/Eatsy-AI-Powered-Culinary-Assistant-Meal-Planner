// [frontend/src/screens/ChatScreen.js]
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import apiClient from '../api/client';
import { COLORS } from '../constants/Colors';
import { STRINGS } from '../constants/Strings';

const { width } = Dimensions.get('window');

// ─── Typing Indicator (3 animated dots) ─────────────────────────────────────
const TypingIndicator = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: -6, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay(600),
        ])
      ).start();

    animate(dot1, 0);
    animate(dot2, 150);
    animate(dot3, 300);
  }, []);

  const dotStyle = (anim) => ({
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.primary,
    marginHorizontal: 3,
    transform: [{ translateY: anim }],
  });

  return (
    <View style={styles.typingWrapper}>
      <View style={styles.aiLabelRow}>
        <View style={[styles.aiIconBadge, { backgroundColor: COLORS.primary }]}>
          <Ionicons name="sparkles" size={11} color={COLORS.white} />
        </View>
        <Text style={[styles.aiLabel, { color: COLORS.primary }]}>EATSY AI</Text>
      </View>
      <View style={[styles.typingBubble, { backgroundColor: COLORS.secondary, borderColor: COLORS.border }]}>
        <Animated.View style={dotStyle(dot1)} />
        <Animated.View style={dotStyle(dot2)} />
        <Animated.View style={dotStyle(dot3)} />
      </View>
    </View>
  );
};

// ─── AI Message Bubble ────────────────────────────────────────────────────────
const AiMessage = ({ text, time }) => (
  <View style={styles.aiMessageWrapper}>
    <View style={styles.aiLabelRow}>
      <View style={[styles.aiIconBadge, { backgroundColor: COLORS.primary }]}>
        <Ionicons name="sparkles" size={11} color={COLORS.white} />
      </View>
      <Text style={[styles.aiLabel, { color: COLORS.primary }]}>EATSY AI</Text>
    </View>
    <View style={[styles.aiBubble, { backgroundColor: COLORS.secondary, borderColor: COLORS.border }]}>
      <Text style={[styles.aiBubbleText, { color: COLORS.text }]}>{text}</Text>
    </View>
    <Text style={[styles.timestamp, { color: COLORS.placeholder }]}>{time}</Text>
  </View>
);

// ─── User Message Bubble ──────────────────────────────────────────────────────
const UserMessage = ({ text, time }) => (
  <View style={styles.userMessageWrapper}>
    <View style={[styles.userBubble, { backgroundColor: COLORS.accent }]}>
      <Text style={[styles.userBubbleText, { color: COLORS.text }]}>{text}</Text>
    </View>
    <Text style={[styles.timestamp, styles.timestampRight, { color: COLORS.placeholder }]}>{time}</Text>
  </View>
);

// ─── Format time helper ───────────────────────────────────────────────────────
const formatTime = (date) => {
  const h = date.getHours();
  const m = date.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${m} ${ampm}`;
};

// ─── Main ChatScreen ──────────────────────────────────────────────────────────
const ChatScreen = () => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'ai',
      text: STRINGS.AI.WELCOME_MESSAGE || "👋 Hello! I'm Eatsy AI — your culinary assistant.",
      time: formatTime(new Date()),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      text,
      time: formatTime(new Date()),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
          role: m.role === 'ai' ? 'model' : 'user',
          text: m.text,
        }));

      const response = await apiClient.post(
        '/ai-assistant/chat',
        { message: text, history },
        { timeout: 60000 }
      );
      
      const rawText = response.data?.data || 'Sorry, I don\'t understand that.';
      const cleanText = rawText.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: cleanText,
        time: formatTime(new Date()),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: '⚠️ Connection error. Please try again later.',
        time: formatTime(new Date()),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    '🥘 What should I cook today?',
    '🔥 Calculate calories for Spinach Omelet',
    '📅 Make a meal plan for this week',
  ];

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: COLORS.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 7 : 0}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: COLORS.border, backgroundColor: 'rgba(248,250,246,0.95)' }]}>
        <View style={styles.headerLeft}>
          <View style={[styles.headerIconBadge, { backgroundColor: COLORS.primary }]}>
            <Ionicons name="sparkles" size={14} color={COLORS.white} />
          </View>
          <Text style={[styles.headerTitle, { color: COLORS.text }]}>Eatsy</Text>
          <View style={[styles.aiBadge, { backgroundColor: COLORS.secondary }]}>
            <Text style={[styles.aiBadgeText, { color: COLORS.primary }]}>AI</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <View style={[styles.onlineDot, { backgroundColor: '#4CAF50' }]} />
          <Text style={[styles.onlineText, { color: COLORS.primary }]}>{STRINGS.AI.ONLINE_STATUS || "Online"}</Text>
        </View>
      </View>

      {/* Messages + Input */}
      <View style={{ flex: 1 }}>
        <ScrollView
          ref={scrollRef}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Quick Prompts */}
          {messages.length === 1 && (
            <View style={styles.quickPromptContainer}>
              <Text style={[styles.quickPromptTitle, { color: COLORS.placeholder }]}>
                {STRINGS.AI.QUICK_PROMPT_TITLE || "SUGGESTED QUESTIONS"}
              </Text>
              {quickPrompts.map((prompt, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.quickPromptChip, { backgroundColor: COLORS.white, borderColor: COLORS.border }]}
                  onPress={() => {
                    setInput(prompt.replace(/^[\S]+\s/, ''));
                    inputRef.current?.focus();
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.quickPromptText, { color: COLORS.text }]}>{prompt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {messages.map((msg) =>
            msg.role === 'ai' ? (
              <AiMessage key={msg.id} text={msg.text} time={msg.time} />
            ) : (
              <UserMessage key={msg.id} text={msg.text} time={msg.time} />
            )
          )}

          {isLoading && <TypingIndicator />}
        </ScrollView>

        {/* Input Bar */}
        <View style={[styles.inputBarWrapper, { borderTopColor: COLORS.border, backgroundColor: 'rgba(248,250,246,0.98)' }]}>
          <View style={[styles.inputBar, { backgroundColor: COLORS.white, borderColor: COLORS.border, shadowColor: COLORS.primary }]}>
            <TextInput
              ref={inputRef}
              style={[styles.textInput, { color: COLORS.text }]}
              placeholder={STRINGS.AI.INPUT_PLACEHOLDER || "Ask Eatsy AI anything..."}
              placeholderTextColor={COLORS.placeholder}
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={sendMessage}
              blurOnSubmit={false}
            />
            <TouchableOpacity
              style={[styles.sendButton, { backgroundColor: COLORS.primary }, (!input.trim() || isLoading) && { backgroundColor: COLORS.border }]}
              onPress={sendMessage}
              disabled={!input.trim() || isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Ionicons name="arrow-up" size={18} color={COLORS.white} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBadge: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  aiBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  onlineText: {
    fontSize: 12,
    fontWeight: '600',
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 20,
  },
  quickPromptContainer: {
    marginBottom: 8,
  },
  quickPromptTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  quickPromptChip: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  quickPromptText: {
    fontSize: 13,
    fontWeight: '500',
  },
  aiMessageWrapper: {
    alignSelf: 'flex-start',
    maxWidth: width * 0.82,
    gap: 6,
  },
  aiLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  aiIconBadge: {
    width: 20,
    height: 20,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  aiBubble: {
    borderWidth: 1,
    borderRadius: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  aiBubbleText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
  },
  userMessageWrapper: {
    alignSelf: 'flex-end',
    maxWidth: width * 0.75,
    alignItems: 'flex-end',
    gap: 6,
  },
  userBubble: {
    borderRadius: 20,
    borderTopRightRadius: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  userBubbleText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
    paddingHorizontal: 4,
  },
  timestampRight: {
    textAlign: 'right',
  },
  typingWrapper: {
    alignSelf: 'flex-start',
    gap: 6,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    borderTopLeftRadius: 0,
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignSelf: 'flex-start',
  },
  inputBarWrapper: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 12 : 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 18,
    borderWidth: 1,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    gap: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    maxHeight: 100,
    paddingTop: 6,
    paddingBottom: 6,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
});

export default ChatScreen;
