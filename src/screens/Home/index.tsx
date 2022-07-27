import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Button } from "../../components/Button";
import { Header } from "../../components/Header";
import { Orders } from "../../components/Orders";
import { Container } from "./styles";

export function Home() {
  const navigation = useNavigation();

  function handleNewOrder() {
    navigation.navigate("new");
  }

  return (
    <Container>
      <Header />
      <Orders />

      <Button title="Novo chamado" onPress={handleNewOrder} />
    </Container>
  );
}
