import { Role } from '@prisma/client';
import { UserNotFoundError, UserUnauthorizedError } from '../../src/errors';
import { PrismaUserRepository } from '../../src/infra';
import { AuthenticationService, UserService } from '../../src/services';
import prisma from '../lib/__mocks__/prisma';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('lib/prisma');

describe('user.service', () => {
  let repository: PrismaUserRepository;
  let service: AuthenticationService;

  beforeAll(() => {
    repository = new PrismaUserRepository(prisma);
    service = new AuthenticationService(repository);
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('[POST LOGIN] login a user', () => {
    it('should throw UserUnauthorizedError', async () => {
      const id = '12345678';
      const email = 'daenerys@gmail.com';
      const password = 'Drogon123!';

      const user = {
        id: id,
        name: 'name',
        role: 'ADMIN' as Role,
        email: email,
        username: 'daenerys',
        password: password,
        vetID: null,
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(user);

      await expect(service.login(email, 'Drogon123!')).rejects.toThrow(
        UserUnauthorizedError
      );
    });
  });

  describe('[POST LOGOUT] logout a user', () => {
    it('should throw UserNotFoundError', async () => {
      const email = 'non_existent@email.com';
      const access_token = 'non_existent_token';

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.logout(email, access_token)).rejects.toThrow(
        UserNotFoundError
      );
    });
  });
});