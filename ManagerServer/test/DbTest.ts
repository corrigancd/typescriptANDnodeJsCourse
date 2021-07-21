import { UserCredentialsDBAccess } from "../src/Authorization/UserCredentialsDBAccess";
import { UsersDBAccess } from "../src/User/UsersDBAccess";

class DbTest {
  public dbAccess: UserCredentialsDBAccess = new UserCredentialsDBAccess();
  public userDbAccess: UsersDBAccess = new UsersDBAccess();
}

const db = new DbTest();
db.dbAccess.putUserCredential({
  username: 'john',
  password: '1234',
  accessRights: [0,1,2,3],
  // _id: 'bal'
});

// new DbTest().userDbAccess.putUser({
//   age: 30,
//   email: "some@email.com",
//   id: "testisfddd",
//   name: "John2",
//   workingPosition: 3,
// });

// db.dbAccess.getUserCredential("user1", "password1").then((t) => {
//   console.log(t);
// });

const user = db.userDbAccess.getUserById("testisfddd").then(t => console.log(t));
// console.log(user);
