import { useSettings } from "@/contexts/SettingsContext";
import React, { useState } from "react";
import { KeyboardAvoidingView, Modal, Platform } from "react-native";
import {
  ButtonRow,
  ButtonText,
  FormRow,
  Label,
  ModalContainer,
  ModalHeader,
  ModalOverlay,
  StyledButtonFull,
  StyledInput,
} from "./SettingsModal.styles";

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
                value={
                  localSettings.workTime === 0
                    ? ""
                    : String(localSettings.workTime)
                }
                onChangeText={(val: string) => {
                  if (/^\d*$/.test(val)) {
                    setLocalSettings({
                      ...localSettings,
                      workTime: val === "" ? 0 : parseInt(val),
                    });
                  }
                }}
                placeholder="25"
              />
            </FormRow>
            <FormRow>
              <Label>Pausa Curta (min):</Label>
              <StyledInput
                keyboardType="numeric"
                value={
                  localSettings.shortBreak === 0
                    ? ""
                    : String(localSettings.shortBreak)
                }
                onChangeText={(val: string) => {
                  if (/^\d*$/.test(val)) {
                    setLocalSettings({
                      ...localSettings,
                      shortBreak: val === "" ? 0 : parseInt(val),
                    });
                  }
                }}
                placeholder="5"
              />
            </FormRow>
            <FormRow>
              <Label>Pausa Longa (min):</Label>
              <StyledInput
                keyboardType="numeric"
                value={
                  localSettings.longBreak === 0
                    ? ""
                    : String(localSettings.longBreak)
                }
                onChangeText={(val: string) => {
                  if (/^\d*$/.test(val)) {
                    setLocalSettings({
                      ...localSettings,
                      longBreak: val === "" ? 0 : parseInt(val),
                    });
                  }
                }}
                placeholder="15"
              />
            </FormRow>
            <FormRow>
              <Label>Ciclos até pausa longa:</Label>
              <StyledInput
                keyboardType="numeric"
                value={
                  localSettings.cyclesBeforeLongBreak === 0
                    ? ""
                    : String(localSettings.cyclesBeforeLongBreak)
                }
                onChangeText={(val: string) => {
                  if (/^\d*$/.test(val)) {
                    setLocalSettings({
                      ...localSettings,
                      cyclesBeforeLongBreak: val === "" ? 0 : parseInt(val),
                    });
                  }
                }}
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
