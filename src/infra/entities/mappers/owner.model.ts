export class Owner {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly username: string;
  public readonly password: string;

  constructor(
    id: string,
    name: string,
    email: string,
    username: string,
    password: string
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.username = username;
    this.password = password;
  }
}