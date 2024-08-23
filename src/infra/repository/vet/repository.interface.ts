import { Vet } from '../../entities';

export interface IVetRepository {
  findAll(): Promise<Vet[] | undefined>;
  findOneByID(id: string): Promise<Vet | undefined>;
  save(vet: Vet): Promise<Vet>;
  update(id: string, Vet: Vet): Promise<Vet>;
  delete(id: string): Promise<Vet>;
  findOneByEmailOrUsername(
    email: string,
    username: string
  ): Promise<Vet | undefined>;
}