import { Role } from '@prisma/client';
import {
  OwnerAlreadyExistsError,
  OwnerNotFoundError,
  OwnerValidationError,
} from '../../src/errors';
import { PrismaOwnerRepository, PrismaUserRepository } from '../../src/infra';
import { OwnerService } from '../../src/services';
import prisma from '../lib/__mocks__/prisma';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('lib/prisma');

describe('owner.service', () => {
  let userRepository: PrismaUserRepository;
  let repository: PrismaOwnerRepository;
  let service: OwnerService;

  beforeAll(() => {
    userRepository = new PrismaUserRepository(prisma);
    repository = new PrismaOwnerRepository(prisma);
    service = new OwnerService(repository, userRepository);
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('[GET ALL] empty list of owners', () => {
    it('should return a list of owners', async () => {
      prisma.user.findMany.mockResolvedValueOnce([]);

      const empty = await service.getAll();

      expect(empty).toStrictEqual([]);
    });
  });

  describe('[GET ALL] list of owners', () => {
    it('should return a list of owners', async () => {
      const ownersList = [
        {
          id: '1',
          name: 'john',
          role: 'OWNER' as Role,
          email: 'john@example.com',
          password: 'Caraxys123!',
          username: 'john_doe',
          ownerID: 'vet123',
          vetID: null,
        },
        {
          id: '2',
          name: 'jane',
          role: 'OWNER' as Role,
          email: 'jane@example.com',
          password: 'Caraxys123!',
          username: 'jane_doe',
          ownerID: 'vet456',
          vetID: null,
        },
      ];

      prisma.user.findMany.mockResolvedValueOnce(ownersList);

      const result = await service.getAll();

      expect(result).toEqual([
        {
          id: '1',
          name: 'john',
          role: 'OWNER' as Role,
          email: 'john@example.com',

          username: 'john_doe',
          ownerID: 'vet123',
        },
        {
          id: '2',
          name: 'jane',
          role: 'OWNER' as Role,
          email: 'jane@example.com',
          username: 'jane_doe',
          ownerID: 'vet456',
        },
      ]);
    });
  });

  describe('[GET ONE] owner by :id', () => {
    it('should return a owner by id', async () => {
      const id = '12345678';
      const ownerID = '987654321';

      const getOwner = {
        id: id,
        name: 'daenerys',
        role: 'OWNER' as Role,
        email: 'daenerys@gmail.com',
        username: 'rhaenyra',
        password: 'Caraxys123!',
        ownerID: ownerID,
        vetID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(getOwner);

      const owner = await service.getOneByID(id);

      expect(owner).toEqual({
        id: id,
        name: 'daenerys',
        role: 'OWNER' as Role,
        email: 'daenerys@gmail.com',
        username: 'rhaenyra',
        ownerID: ownerID,
      });
    });
  });

  describe('[GET ONE] owner by :id', () => {
    it('should throw OwnerNotFoundError', async () => {
      const id = 'non_existent_id';

      prisma.owner.findUnique.mockResolvedValueOnce(null);

      await expect(service.getOneByID(id)).rejects.toThrow(OwnerNotFoundError);
    });
  });

  describe('[GET ONE] owner by :id', () => {
    it('should throw VetNotFoundError', async () => {
      const id = 'non_existent_id';

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.getOneByID(id)).rejects.toThrow(OwnerNotFoundError);
    });
  });
  
  describe('[POST] new valid owner', () => {
    it('should create and return a owner', async () => {
      const id = '98765431';
      const ownerID = '987654321';

      const createdOwner = {
        id: id,
        role: 'OWNER' as Role,
        email: 'rhaenyra@gmail.com',
        name: 'rhaenyra',
        username: 'rhaenyra',
        password: 'Caraxys123!',
        ownerID: ownerID,
        vetID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      prisma.user.create.mockResolvedValueOnce(createdOwner);

      const owner = await service.create({
        id: id,
        email: 'rhaenyra@gmail.com',
        name: 'rhaenyra',
        username: 'rhaenyra',
        password: 'Caraxys123!',
      });

      expect(owner).toEqual({
        id: id,
        role: 'OWNER' as Role,
        email: 'rhaenyra@gmail.com',
        name: 'rhaenyra',
        username: 'rhaenyra',
        ownerID: ownerID,
      });
    });
  });

  describe('[POST] new invalid owner', () => {
    it('should throw OwnerAlreadyExistsError', async () => {
      const id = '98765431';
      const ownerID = '987654321';

      const createdOwner = {
        id: id,
        role: 'OWNER' as Role,
        email: 'rhaenyra@gmail.com',
        name: 'rhaenyra',
        username: 'rhaenyra',
        password: 'Caraxys123!',
        ownerID: ownerID,
        vetID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(createdOwner);

      await expect(
        service.create({
          id: id,
          email: 'rhaenyra@gmail.com',
          name: 'rhaenyra',
          username: 'rhaenyra',
          password: 'Caraxys123!',
        })
      ).rejects.toThrow(OwnerAlreadyExistsError);
    });
  });

  describe('[POST] new invalid owner', () => {
    it('empty name: should throw OwnerValidationError', async () => {
      const id = '98765431';
      const ownerID = '987654321';

      const createdOwner = {
        id: id,
        role: 'OWNER' as Role,
        email: 'rhaenyra@gmail.com',
        name: '',
        username: 'rhaenyra',
        password: 'Caraxys123!',
        ownerID: ownerID,
        vetID: null,
      };

      prisma.owner.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(createdOwner)).rejects.toThrow(
        OwnerValidationError
      );
    });
  });

  describe('[POST] new invalid owner', () => {
    it('blank name: should throw OwnerValidationError', async () => {
      const id = '98765431';
      const ownerID = '987654321';

      const createdOwner = {
        id: id,
        role: 'OWNER' as Role,
        email: 'rhaenyra@gmail.com',
        name: '     ',
        username: 'rhaenyra',
        password: 'Caraxys123!',
        ownerID: ownerID,
        vetID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(createdOwner)).rejects.toThrow(
        OwnerValidationError
      );
    });
  });

  describe('[POST] new invalid owner', () => {
    it('invalid role: should throw OwnerValidationError', async () => {
      const id = '98765431';
      const ownerID = '987654321';

      const createdOwner = {
        id: id,
        role: 'NOT_ROLE' as Role,
        email: 'rhaenyra@gmail.com',
        name: '     ',
        username: 'rhaenyra',
        password: 'Caraxys123!',
        ownerID: ownerID,
        vetID: null,
      };

      prisma.owner.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(createdOwner)).rejects.toThrow(
        OwnerValidationError
      );
    });
  });

  describe('[POST] new invalid owner', () => {
    it('invalid empty email: should throw OwnerValidationError', async () => {
      const id = '98765431';
      const ownerID = '987654321';

      const createdOwner = {
        id: id,
        role: 'OWNER' as Role,
        email: '',
        name: 'rhaenyra',
        username: 'rhaenyra',
        password: 'Caraxys123!',
        ownerID: ownerID,
        vetID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(createdOwner)).rejects.toThrow(
        OwnerValidationError
      );
    });
  });

  describe('[POST] new invalid owner', () => {
    it('invalid blank email: should throw OwnerValidationError', async () => {
      const id = '98765431';
      const ownerID = '987654321';

      const createdOwner = {
        id: id,
        role: 'OWNER' as Role,
        email: '     ',
        name: 'rhaenyra',
        username: 'rhaenyra',
        password: 'Caraxys123!',
        ownerID: ownerID,
        vetID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(createdOwner)).rejects.toThrow(
        OwnerValidationError
      );
    });
  });

  describe('[POST] new invalid owner', () => {
    it('invalid email no @: should throw OwnerValidationError', async () => {
      const id = '98765431';
      const ownerID = '987654321';

      const createdOwner = {
        id: id,
        role: 'OWNER' as Role,
        email: 'rhaenyra.com',
        name: 'rhaenyra',
        username: 'rhaenyra',
        password: 'Caraxys123!',
        ownerID: ownerID,
        vetID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(createdOwner)).rejects.toThrow(
        OwnerValidationError
      );
    });
  });

  describe('[POST] new invalid owner', () => {
    it('invalid email no domain: should throw OwnerValidationError', async () => {
      const id = '98765431';
      const ownerID = '987654321';

      const createdOwner = {
        id: id,
        role: 'OWNER' as Role,
        email: 'rhaenyra@gmail',
        name: 'rhaenyra',
        username: 'rhaenyra',
        password: 'Caraxys123!',
        ownerID: ownerID,
        vetID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(createdOwner)).rejects.toThrow(
        OwnerValidationError
      );
    });
  });

  describe('[POST] new invalid owner', () => {
    it('invalid empty username: should throw OwnerValidationError', async () => {
      const id = '98765431';
      const ownerID = '987654321';

      const createdOwner = {
        id: id,
        role: 'OWNER' as Role,
        email: 'rhaenyra@gmail.com',
        name: 'rhaenyra',
        username: '',
        password: 'Caraxys123!',
        ownerID: ownerID,
        vetID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(createdOwner)).rejects.toThrow(
        OwnerValidationError
      );
    });
  });

  describe('[POST] new invalid owner', () => {
    it('invalid blank username: should throw OwnerValidationError', async () => {
      const id = '98765431';
      const ownerID = '987654321';

      const createdOwner = {
        id: id,
        role: 'OWNER' as Role,
        email: 'rhaenyra@gmail.com',
        name: 'rhaenyra',
        username: '    ',
        password: 'Caraxys123!',
        ownerID: ownerID,
        vetID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(createdOwner)).rejects.toThrow(
        OwnerValidationError
      );
    });
  });

  describe('[POST] new invalid owner', () => {
    it('invalid username min length: should throw OwnerValidationError', async () => {
      const id = '98765431';
      const ownerID = '987654321';

      const createdOwner = {
        id: id,
        role: 'OWNER' as Role,
        email: 'rhaenyra@gmail.com',
        name: 'rhaenyra',
        username: 'name',
        password: 'Caraxys123!',
        ownerID: ownerID,
        vetID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(createdOwner)).rejects.toThrow(
        OwnerValidationError
      );
    });
  });

  describe('[POST] new invalid owner', () => {
    it('invalid password no uppercase: should throw OwnerValidationError', async () => {
      const id = '98765431';
      const ownerID = '987654321';

      const createdOwner = {
        id: id,
        role: 'OWNER' as Role,
        email: 'rhaenyra@gmail.com',
        name: 'rhaenyra',
        username: 'rhaenyra',
        password: 'caraxys123!',
        ownerID: ownerID,
        vetID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(createdOwner)).rejects.toThrow(
        OwnerValidationError
      );
    });
  });

  describe('[POST] new invalid owner', () => {
    it('invalid password no number: should throw OwnerValidationError', async () => {
      const id = '98765431';
      const ownerID = '987654321';

      const createdOwner = {
        id: id,
        role: 'OWNER' as Role,
        email: 'rhaenyra@gmail.com',
        name: 'rhaenyra',
        username: 'rhaenyra',
        password: 'Caraxys!',
        ownerID: ownerID,
        vetID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(createdOwner)).rejects.toThrow(
        OwnerValidationError
      );
    });
  });

  describe('[POST] new invalid owner', () => {
    it('invalid password no special character: should throw OwnerValidationError', async () => {
      const id = '98765431';
      const ownerID = '987654321';

      const createdOwner = {
        id: id,
        role: 'OWNER' as Role,
        email: 'rhaenyra@gmail.com',
        name: 'rhaenyra',
        username: 'rhaenyra',
        password: 'Caraxys123',
        ownerID: ownerID,
        vetID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(createdOwner)).rejects.toThrow(
        OwnerValidationError
      );
    });
  });

  describe('[PUT] update owner that exists', () => {
    it('should update and return the owner', async () => {
      const id = '12345678';
      const ownerID = '987654321';

      const updatedOwner = {
        id: id,
        role: 'OWNER' as Role,
        email: 'rhaenyra@gmail.com',
        name: 'rhaenyra',
        username: 'rhaenyra',
        password: 'Caraxys123!',
        ownerID: ownerID,
        vetID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(updatedOwner);

      prisma.user.update.mockResolvedValueOnce(updatedOwner);

      const result = await service.update({
        id: id,
        email: 'rhaenyra@gmail.com',
        name: 'rhaenyra',
        username: 'rhaenyra',
        password: 'Caraxys123!',
      });

      expect(result).toEqual({
        id: id,
        role: 'OWNER' as Role,
        email: 'rhaenyra@gmail.com',
        name: 'rhaenyra',
        username: 'rhaenyra',
        ownerID: ownerID,
      });
    });
  });

  describe('[PUT] update owner that does not exists', () => {
    it('should throw OwnerNotFoundError', async () => {
      const id = '12345678';

      prisma.owner.findUnique.mockResolvedValueOnce(null);

      expect(
        service.update({
          id: id,
          name: 'name',
          email: 'updated_email@gmail.com',
          username: 'updated_username',
          password: 'UpdatedP12!',
        })
      ).rejects.toThrow(OwnerNotFoundError);
    });
  });

  describe('[DELETE] delete owner that does exist', () => {
    it('should delete and return the owner', async () => {
      const id = '12345678';
      const ownerID = '987654321';

      const deletedOwner = {
        id: id,
        role: 'OWNER' as Role,
        email: 'rhaenyra@gmail.com',
        name: 'rhaenyra',
        username: 'rhaenyra',
        password: 'Caraxys123!',
        ownerID: ownerID,
        vetID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(deletedOwner);

      prisma.user.delete.mockResolvedValueOnce(deletedOwner);

      const result = await service.delete(id);

      expect(result).toEqual({
        id: id,
        role: 'OWNER' as Role,
        email: 'rhaenyra@gmail.com',
        name: 'rhaenyra',
        username: 'rhaenyra',
        ownerID: ownerID,
      });
    });
  });

  describe('[DELETE] delete owner that does not exist', () => {
    it('should throw OwnerNotFoundError', async () => {
      const id = 'non_existent_id';

      prisma.owner.findUnique.mockResolvedValueOnce(null);

      await expect(service.delete(id)).rejects.toThrow(OwnerNotFoundError);
    });
  });
});