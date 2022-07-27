import React from "react";
import { useTheme } from "styled-components/native";

import { Filter } from "../Filter";
import { OrderStyleProps } from "../Order/styles";
import { Container, Options, Title } from "./styles";

type Props = {
  onFilter: (status: OrderStyleProps["status"]) => void;
};

export function Filters({ onFilter }: Props) {
  const theme = useTheme();

  return (
    <Container>
      <Title>Filtre pelo status do chamado</Title>

      <Options>
        <Filter
          title="Abertos"
          backgroundColor={theme.COLORS.SECONDARY}
          onPress={() => onFilter("open")}
        />

        <Filter
          title="Encerrados"
          backgroundColor={theme.COLORS.PRIMARY}
          onPress={() => onFilter("closed")}
        />
      </Options>
    </Container>
  );
}
