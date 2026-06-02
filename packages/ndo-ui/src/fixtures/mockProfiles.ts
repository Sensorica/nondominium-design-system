import type { LobbyUserProfile } from '../domain/types.js';

export const MOCK_LOBBY_PROFILE: LobbyUserProfile = {
  nickname: 'SoushAI',
  realName: 'Sam Underwood',
  bio: 'Commons-oriented fabricator and open hardware contributor.',
  email: 'sam@example.com',
  phone: '+1 555 0100'
};

export const MOCK_EMPTY_PROFILE: LobbyUserProfile = {
  nickname: ''
};
