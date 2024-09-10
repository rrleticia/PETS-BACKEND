import { User } from '../../entities';

export interface IUserRepository {
  getUserByToken(token: string): Promise<User | undefined>;
  updateToken(email: string, token: string): Promise<boolean>;
  findAll(): Promise<User[] | undefined>;
  findOneByID(id: string): Promise<User | undefined>;
  save(user: User): Promise<User>;
  update(id: string, Vet: User): Promise<User>;
  delete(id: string): Promise<User>;
  findOneByEmail(email: string): Promise<User | undefined>;
  findOneByEmailOrUsername(
    email: string,
    username: string
  ): Promise<User | undefined>;
}
