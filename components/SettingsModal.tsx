import { useSettings } from "@/contexts/SettingsContext";
import React, { useState } from "react";
import { KeyboardAvoidingView, Modal, Platform } from "react-native";
import styled from "styled-components/native";

type SettingsModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function SettingsModal({
  visible,
  onClose,
}: SettingsModalProps) {
  const { settings, setSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    setSettings(localSettings);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <ModalOverlay>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <ModalContainer>
            <ModalHeader>Configurações</ModalHeader>
            <FormRow>
              <Label>Tempo de Trabalho (min):</Label>
              <StyledInput
                keyboardType="numeric"
                value={String(localSettings.workTime)}
                onChangeText={(val: string) =>
                  setLocalSettings({
                    ...localSettings,
                    workTime: parseInt(val),
                  })
                }
                placeholder="25"
              />
            </FormRow>
            <FormRow>
              <Label>Pausa Curta (min):</Label>
              <StyledInput
                keyboardType="numeric"
                value={String(localSettings.shortBreak)}
                onChangeText={(val: string) =>
                  setLocalSettings({
                    ...localSettings,
                    shortBreak: parseInt(val),
                  })
                }
                placeholder="5"
              />
            </FormRow>
            <FormRow>
              <Label>Pausa Longa (min):</Label>
              <StyledInput
                keyboardType="numeric"
                value={String(localSettings.longBreak)}
                onChangeText={(val: string) =>
                  setLocalSettings({
                    ...localSettings,
                    longBreak: parseInt(val),
                  })
                }
                placeholder="15"
              />
            </FormRow>
            <FormRow>
              <Label>Ciclos até pausa longa:</Label>
              <StyledInput
                keyboardType="numeric"
                value={String(localSettings.cyclesBeforeLongBreak)}
                onChangeText={(val: string) =>
                  setLocalSettings({
                    ...localSettings,
                    cyclesBeforeLongBreak: parseInt(val),
                  })
                }
                placeholder="4"
              />
            </FormRow>
            <ButtonRow>
              <StyledButtonFull onPress={handleSave}>
                <ButtonText>Salvar</ButtonText>
              </StyledButtonFull>
              <StyledButtonFull
                onPress={onClose}
                style={{ backgroundColor: "#ccc" }}
              >
                <ButtonText>Cancelar</ButtonText>
              </StyledButtonFull>
            </ButtonRow>
          </ModalContainer>
        </KeyboardAvoidingView>
      </ModalOverlay>
    </Modal>
  );
}

const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.25);
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.View`
  width: 90%;
  background-color: #fff;
  border-radius: 18px;
  padding: 24px 20px 20px 20px;
`;

const ModalHeader = styled.Text`
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 18px;
`;

const FormRow = styled.View`
  margin-bottom: 16px;
`;

const Label = styled.Text`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 6px;
`;

const StyledInput = styled.TextInput`
  border-width: 1px;
  border-color: #e5e5ea;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 16px;
  background-color: #f2f2f7;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 18px;
`;

const StyledButtonFull = styled.TouchableOpacity<any>`
  background-color: #fac60c;
  padding: 12px 24px;
  border-radius: 8px;
  margin: 0 8px;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;
