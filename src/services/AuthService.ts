import { UserRepository } from '../repositories/UserRepository';
import { AuthCheckResponse, AuthRegisterResponse } from '../types';
import { generateToken } from '../utils/jwt';

export class AuthService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async checkUserExists(email: string): Promise<AuthCheckResponse> {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await this.userRepository.findByEmail(normalizedEmail);

    if (user) {
      const token = generateToken(user.id, user.email);
      return {
        exists: true,
        user,
        token,
      };
    }

    return {
      exists: false,
    };
  }

  async registerUser(email: string): Promise<AuthRegisterResponse> {
    const normalizedEmail = email.toLowerCase().trim();
    
    const existingUser = await this.userRepository.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = await this.userRepository.create(normalizedEmail);
    const token = generateToken(user.id, user.email);

    return {
      user,
      token,
    };
  }
}
