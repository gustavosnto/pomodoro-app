import styled from "styled-components/native";

interface ButtonProps {
  disabled?: boolean;
}

export const Container = styled.View`
  flex: 1;
  background-color: #f2f2f7;
`;

export const Header = styled.View`
  padding-top: 60px;
  background-color: #e74c3c;
  justify-content: center;
  align-items: center;
  `;

export const TitleApp = styled.Text`
  padding: 12px 0;
  font-size: 28px;
  font-weight: bold;
  color: #fff;
`;

export const CircleContainer = styled.View`
  align-items: center;
  justify-content: center;
  margin: 32px 0 16px 0;
`;

export const TimerText = styled.Text`
  font-size: 48px;
  font-weight: bold;
  text-align: center;
`;

export const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: space-between;
  margin: 16px 20px;
`;

export const ButtonCol = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 16px 20px;
  gap: 12px;
`;

export const StyledButton = styled.TouchableOpacity<ButtonProps>`
  background-color: ${({ disabled }: { disabled?: boolean }) =>
    disabled ? "#ccc" : "#e74c3c"};
  padding: 12px 24px;
  border-radius: 8px;
  margin: 0 8px;
`;

export const StyledButtonFull = styled.TouchableOpacity<ButtonProps>`
  background-color: ${({ disabled }: { disabled?: boolean }) =>
    disabled ? "#ccc" : "#e74c3c"};
  padding: 12px 24px;
  border-radius: 8px;
  margin: 0 8px;
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ButtonText = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

export const FinishText = styled.Text`
  font-size: 20px;
  color: #ff3b30;
  text-align: center;
  margin-top: 24px;
`;

export const CycleInfo = styled.Text`
  font-size: 16px;
  color: #888;
  margin-top: 10px;
  text-align: center;
`;
