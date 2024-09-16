import { Role } from '@prisma/client';
import { UserNotFoundError } from '../../src/errors';
import { PrismaUserRepository } from '../../src/infra';
import { UserService } from '../../src/services';
import prisma from '../lib/__mocks__/prisma';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('lib/prisma');

describe('user.service', () => {
  let repository: PrismaUserRepository;
  let service: UserService;

  beforeAll(() => {
    repository = new PrismaUserRepository(prisma);
    service = new UserService(repository);
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('[GET ALL] empty list of users', () => {
    it('should return a list of users', async () => {
      prisma.user.findMany.mockResolvedValueOnce([]);

      const empty = await service.getAll();

      expect(empty).toStrictEqual([]);
    });
  });

  describe('[GET ONE] user by :id', () => {
    it('should return a user by id', async () => {
      const id = '12345678';

      const getUser = {
        id: id,
        name: 'name',
        role: 'ADMIN' as Role,
        email: 'daenerys@gmail.com',
        username: 'daenerys',
        password: 'Drogon123!',
        vetID: null,
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(getUser);

      const user = await service.getOneByID(id);

      expect(user).toEqual({
        id: '12345678',
        name: 'name',
        role: 'ADMIN',
        email: 'daenerys@gmail.com',
        username: 'daenerys',
        vetID: null,
        ownerID: null,
      });
    });
  });

  describe('[GET ONE] user by :id', () => {
    it('should throw UserNotFoundError', async () => {
      const id = 'non_existent_id';

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.getOneByID(id)).rejects.toThrow(UserNotFoundError);
    });
  });

  describe('[POST] new valid user', () => {
    it('should create and return a user', async () => {
      const id = '98765431';

      const createdUser = {
        id: id,
        name: 'name',
        role: 'ADMIN' as Role,
        email: 'rhaenyra@gmail.com',
        username: 'rhaenyra',
        password: 'Caraxys123!',
        vetID: 'anID',
        ownerID: 'anID',
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      prisma.user.create.mockResolvedValueOnce(createdUser);

      const user = await service.create(createdUser);

      expect(user).toEqual({
        id: id,
        name: 'name',
        role: 'ADMIN' as Role,
        email: 'rhaenyra@gmail.com',
        username: 'rhaenyra',
        vetID: 'anID',
        ownerID: 'anID',
      });
    });
  });

  describe('[PUT] update user that exists', () => {
    it('should update and return the user', async () => {
      const id = '12345678';

      const updatedUser = {
        id: id,
        name: 'name',
        role: 'ADMIN' as Role,
        email: 'updated_email@gmail.com',
        username: 'updated_username',
        password: 'Updated_passcode1!',
        vetID: 'anID',
        ownerID: 'anID',
      };

      prisma.user.findUnique.mockResolvedValueOnce(updatedUser);

      prisma.user.update.mockResolvedValueOnce(updatedUser);

      const result = await service.update(updatedUser);

      expect(result).toEqual({
        id: id,
        name: 'name',
        role: 'ADMIN' as Role,
        email: 'updated_email@gmail.com',
        username: 'updated_username',
        vetID: 'anID',
        ownerID: 'anID',
      });
    });
  });

  describe('[DELETE] delete user that does not exist', () => {
    it('should throw UserNotFoundError', async () => {
      const id = 'non_existent_id';

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.delete(id)).rejects.toThrow(UserNotFoundError);
    });
  });
});
