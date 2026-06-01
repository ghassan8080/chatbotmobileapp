/**
 * Chat Requests API
 */

const CHAT_REQUESTS_WEBHOOK = 'https://n8n-n8n.17m6co.easypanel.host/webhook/chat-requests';
const DISMISS_CHAT_REQUEST_WEBHOOK = 'https://n8n-n8n.17m6co.easypanel.host/webhook/dismiss-chat-request';

export const getChatRequests = async () => {
  try {
    const response = await fetch(CHAT_REQUESTS_WEBHOOK);
    if (!response.ok) return [];
    
    const text = await response.text();
    const data = text ? JSON.parse(text) : { success: false };
    
    if (data.success && data.chat_requests) {
      return data.chat_requests;
    }
    return [];
  } catch (error) {
    console.error('Error fetching chat requests:', error);
    return [];
  }
};

export const dismissChatRequest = async (senderId) => {
  try {
    const payload = { senderId };
    const response = await fetch(DISMISS_CHAT_REQUEST_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.statusText}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : { success: true };
  } catch (error) {
    console.error('Error dismissing chat request:', error);
    throw error;
  }
};
