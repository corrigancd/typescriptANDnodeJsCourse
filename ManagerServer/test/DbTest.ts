import { UserCredentialsDBAccess } from "../src/Authorization/UserCredentialsDBAccess";

class DbTest {
  public dbAccess: UserCredentialsDBAccess = new UserCredentialsDBAccess();
}

const db = new DbTest();
//db.dbAccess.putUserCredential({
//   username: 'user1',
//   password: 'password1',
//   accessRights: [1,2,3],
//   // _id: 'bal'
// });

db.dbAccess.getUserCredential("user1", "password1").then((t) => {
  console.log(t);
});
