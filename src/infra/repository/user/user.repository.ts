import { PrismaClient } from '@prisma/client';
import { IUserRepository } from '.';
import { User } from '../../entities';
import { getRoleEnum } from '../../../shared';

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async findAll(): Promise<User[] | undefined> {
    const users = await this.prisma.user.findMany({});

    if (!users) return undefined;

    const parseUsers = users.map((user) => {
      return new User(
        user.id,
        user.username,
        user.role,
        user.email,
        user.password
      );
    });
    return parseUsers;
  }

  public async findOneByID(id: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) return undefined;

    const parseUser = new User(
      user.id,
      user.username,
      user.role,
      user.email,
      user.password
    );

    return parseUser;
  }

  public async save(user: User): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        username: user.username,
        role: getRoleEnum(user.role),
        email: user.email,
        password: user.password,
      },
    });

    const parseUser = new User(
      createdUser.id,
      createdUser.username,
      createdUser.role,
      createdUser.email,
      createdUser.password
    );

    return parseUser;
  }

  public async update(id: string, user: User): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        username: user.username,
        role: getRoleEnum(user.role),
        email: user.email,
        password: user.password,
      },
    });

    const parseUser = new User(
      updatedUser.id,
      updatedUser.username,
      updatedUser.role,
      updatedUser.email,
      updatedUser.password
    );

    return parseUser;
  }

  public async delete(id: string): Promise<User> {
    const user = await this.prisma.user.delete({
      where: {
        id: id,
      },
    });

    const parseUser = new User(
      user.id,
      user.username,
      user.role,
      user.email,
      user.password
    );

    return parseUser;
  }

  public async findOneByEmail(email: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) return undefined;

    const parseUser = new User(
      user.id,
      user.username,
      user.role,
      user.email,
      user.password
    );

    return parseUser;
  }

  public async findOneByEmailOrUsername(
    email: string,
    username: string
  ): Promise<User | undefined> {
    const userEmail = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    const userUsername = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (userEmail) {
      const parseUser = new User(
        userEmail.id,
        userEmail.username,
        userEmail.role,
        userEmail.email,
        userEmail.password
      );

      return parseUser;
    } else if (userUsername) {
      const parseUser = new User(
        userUsername.id,
        userUsername.username,
        userUsername.role,
        userUsername.email,
        userUsername.password
      );

      return parseUser;
    } else return undefined;
  }
}