import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Alert, FlatList } from "react-native";
import { getRealm } from "../../database/realm";
import { SchemaTypes } from "../../database/Schemas";
import { Filters } from "../Filters";
import { Load } from "../Load";
import { Order, OrderProps } from "../Order";
import { OrderStyleProps } from "../Order/styles";
import { Container, Counter, Header, Title } from "./styles";

export function Orders() {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<OrderProps[]>([]);
  const [status, setStatus] = useState<OrderStyleProps["status"]>("open");

  const fetchOrders = useCallback(() => {
    async function _fetchOrders() {
      setIsLoading(true);
      const realm = await getRealm();

      try {
        const response = realm
          .objects<OrderProps>(SchemaTypes.Order)
          .filtered(`status = "${status}"`)
          .sorted("created_at");

        setOrders(response.toJSON());
      } catch (error) {
        console.warn(error);
        Alert.alert("Chamados", "Não foi possível carregar os chamados.");
      } finally {
        setIsLoading(false);
        realm.close();
      }
    }

    _fetchOrders();
  }, [status]);

  useFocusEffect(fetchOrders);

  async function updateOrder(id: string) {
    const realm = await getRealm();

    try {
      const [orderToUpdate] = realm
        .objects<OrderProps>(SchemaTypes.Order)
        .filtered(`_id = "${id}"`);

      realm.write(() => {
        orderToUpdate.status =
          orderToUpdate.status === "open" ? "closed" : "open";
      });

      fetchOrders();
    } catch (error) {
      realm.close();
      console.warn(error);
      Alert.alert("Chamados", "Não foi alterar o status do chamado.");
    }
  }

  function handleUpdateOrder(id: string) {
    Alert.alert("Chamado", "Deseja alterar o status do chamado?", [
      {
        text: "Não",
        style: "cancel",
      },
      {
        text: "Sim",
        onPress: async () => {
          await updateOrder(id);
        },
      },
    ]);
  }

  return (
    <Container>
      <Filters onFilter={setStatus} />

      <Header>
        <Title>Chamados {status === "open" ? "abertos" : "encerrados"}</Title>
        <Counter>{orders.length}</Counter>
      </Header>

      {isLoading ? (
        <Load />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <Order data={item} onPress={() => handleUpdateOrder(item._id)} />
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        />
      )}
    </Container>
  );
}
