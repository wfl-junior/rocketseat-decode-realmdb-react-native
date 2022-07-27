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

  useFocusEffect(
    useCallback(() => {
      async function fetchOrders() {
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

      fetchOrders();
    }, [status]),
  );

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
          renderItem={({ item }) => <Order data={item} />}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        />
      )}
    </Container>
  );
}
