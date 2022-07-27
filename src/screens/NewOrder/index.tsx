import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Alert } from "react-native";
import uuid from "react-native-uuid";
import { Button } from "../../components/Button";
import { IconButton } from "../../components/IconButton";
import { Input } from "../../components/Input";
import { TextArea } from "../../components/TextArea";
import { getRealm } from "../../database/realm";
import { SchemaTypes } from "../../database/Schemas";
import { Container, Form, Header, Title } from "./styles";

export function NewOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const [patrimony, setPatrimony] = useState("");
  const [equipment, setEquipment] = useState("");
  const [description, setDescription] = useState("");

  const { goBack } = useNavigation();

  function handleBack() {
    goBack();
  }

  async function handleCreateNewOrder() {
    setIsLoading(true);
    const realm = await getRealm();

    try {
      realm.write(() => {
        const createdOrder = realm.create(SchemaTypes.Order, {
          _id: uuid.v4().toString(),
          patrimony,
          equipment,
          description,
          status: "open",
          created_at: new Date(),
        });

        console.log(createdOrder);
      });

      setPatrimony("");
      setEquipment("");
      setDescription("");

      Alert.alert("Chamado", "Chamado enviado com sucesso.");
    } catch (error) {
      console.warn(error);
      Alert.alert("Chamado", "Não foi possível enviar chamado.");
    } finally {
      setIsLoading(false);
      realm.close();
    }
  }

  return (
    <Container>
      <Header>
        <Title>Novo chamado</Title>
        <IconButton icon="chevron-left" onPress={handleBack} />
      </Header>

      <Form>
        <Input
          placeholder="Número do Patrimônio"
          value={patrimony}
          onChangeText={setPatrimony}
        />

        <Input
          placeholder="Equipamento"
          value={equipment}
          onChangeText={setEquipment}
        />

        <TextArea
          placeholder="Descrição"
          autoCorrect={false}
          value={description}
          onChangeText={setDescription}
        />
      </Form>

      <Button
        title="Enviar chamado"
        isLoading={isLoading}
        onPress={handleCreateNewOrder}
      />
    </Container>
  );
}
