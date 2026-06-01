import EncryptedStorage from 'react-native-encrypted-storage';
import { secureStorage } from '../utils/secureStorage';

// The mock is automatically applied via jest.config.js moduleNameMapper
// Each test resets the mock so call counts stay clean

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── setApiKey ──────────────────────────────────────────────────────────────

describe('secureStorage.setApiKey', () => {
  it('calls EncryptedStorage.setItem with key "api_key"', async () => {
    await secureStorage.setApiKey('my-secret-key');
    expect(EncryptedStorage.setItem).toHaveBeenCalledWith('api_key', 'my-secret-key');
  });

  it('throws when EncryptedStorage.setItem rejects', async () => {
    (EncryptedStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error('disk full'));
    await expect(secureStorage.setApiKey('key')).rejects.toThrow('فشل حفظ مفتاح API');
  });
});

// ─── getApiKey ──────────────────────────────────────────────────────────────

describe('secureStorage.getApiKey', () => {
  it('returns the stored api key', async () => {
    (EncryptedStorage.getItem as jest.Mock).mockResolvedValueOnce('stored-key');
    const result = await secureStorage.getApiKey();
    expect(result).toBe('stored-key');
    expect(EncryptedStorage.getItem).toHaveBeenCalledWith('api_key');
  });

  it('returns null when EncryptedStorage.getItem rejects', async () => {
    (EncryptedStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('read error'));
    const result = await secureStorage.getApiKey();
    expect(result).toBeNull();
  });

  it('returns null when nothing is stored', async () => {
    (EncryptedStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    const result = await secureStorage.getApiKey();
    expect(result).toBeNull();
  });
});

// ─── removeApiKey ───────────────────────────────────────────────────────────

describe('secureStorage.removeApiKey', () => {
  it('calls EncryptedStorage.removeItem with key "api_key"', async () => {
    await secureStorage.removeApiKey();
    expect(EncryptedStorage.removeItem).toHaveBeenCalledWith('api_key');
  });

  it('does not throw when EncryptedStorage.removeItem rejects', async () => {
    (EncryptedStorage.removeItem as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await expect(secureStorage.removeApiKey()).resolves.toBeUndefined();
  });
});

// ─── setUserToken ───────────────────────────────────────────────────────────

describe('secureStorage.setUserToken', () => {
  it('calls EncryptedStorage.setItem with key "user_token"', async () => {
    await secureStorage.setUserToken('jwt-abc');
    expect(EncryptedStorage.setItem).toHaveBeenCalledWith('user_token', 'jwt-abc');
  });

  it('throws when EncryptedStorage.setItem rejects', async () => {
    (EncryptedStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await expect(secureStorage.setUserToken('token')).rejects.toThrow('فشل حفظ رمز المستخدم');
  });
});

// ─── getUserToken ───────────────────────────────────────────────────────────

describe('secureStorage.getUserToken', () => {
  it('returns the stored user token', async () => {
    (EncryptedStorage.getItem as jest.Mock).mockResolvedValueOnce('jwt-xyz');
    const result = await secureStorage.getUserToken();
    expect(result).toBe('jwt-xyz');
    expect(EncryptedStorage.getItem).toHaveBeenCalledWith('user_token');
  });

  it('returns null when EncryptedStorage.getItem rejects', async () => {
    (EncryptedStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    const result = await secureStorage.getUserToken();
    expect(result).toBeNull();
  });
});

// ─── clearAll ───────────────────────────────────────────────────────────────

describe('secureStorage.clearAll', () => {
  it('calls EncryptedStorage.clear', async () => {
    await secureStorage.clearAll();
    expect(EncryptedStorage.clear).toHaveBeenCalledTimes(1);
  });

  it('does not throw when EncryptedStorage.clear rejects', async () => {
    (EncryptedStorage.clear as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await expect(secureStorage.clearAll()).resolves.toBeUndefined();
  });
});
