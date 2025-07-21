import styled from "styled-components/native";

export const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.25);
  justify-content: center;
  align-items: center;
`;

export const ModalContainer = styled.View`
  width: 90%;
  background-color: #fff;
  border-radius: 18px;
  padding: 24px 20px 20px 20px;
`;

export const ModalHeader = styled.Text`
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 18px;
`;

export const FormRow = styled.View`
  margin-bottom: 16px;
`;

export const Label = styled.Text`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 6px;
`;

export const StyledInput = styled.TextInput`
  border-width: 1px;
  border-color: #e5e5ea;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 16px;
  background-color: #f2f2f7;
`;

export const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 18px;
`;

export const StyledButtonFull = styled.TouchableOpacity<any>`
  background-color: #e74c3c;
  padding: 12px 24px;
  border-radius: 8px;
  margin: 0 8px;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const ButtonText = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;
