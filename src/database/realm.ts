import Realm from "realm";
import { OrderSchema } from "./Schemas/OrderSchema";

export async function getRealm() {
  return Realm.open({
    path: "realmdb-app",
    schema: [OrderSchema],
    schemaVersion: 1,
  });
}
