import { User } from '../models/DataModels';

const baseUrl = 'http://localhost:8080/';
const usersUrl = baseUrl + 'users';

export class DataService {
  public async getUsers(
    Authorization: string,
    nameQuery: string,
  ): Promise<User[]> {
    const url = usersUrl + '?name=' + nameQuery;
    const options = {
      method: 'GET',
      headers: {
        Authorization,
      },
    };

    const result = await fetch(url, options);
    return result.json();
  }

  public async deleteUser(
    Authorization: string,
    user: User,
  ): Promise<void> {
    const url = usersUrl + '?id=' + user.id;
    const options = {
      method: 'DELETE',
      headers: {
        Authorization,
      },
    };

    await fetch(url, options);
  }
}
