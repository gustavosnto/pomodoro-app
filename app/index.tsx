import SettingsModal from "@/components/SettingsModal";
import * as Haptics from "expo-haptics";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";
import React, { useEffect, useRef, useState } from "react";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import styled from "styled-components/native";
import { useSettings } from "@/contexts/SettingsContext";

interface ButtonProps {
  disabled?: boolean;
}

export default function HomeScreen() {
  const { settings } = useSettings();
  const WORK_MINUTES = settings.workTime;
  const SHORT_BREAK_MINUTES = settings.shortBreak;
  const LONG_BREAK_MINUTES = settings.longBreak;
  const CYCLES_BEFORE_LONG_BREAK = settings.cyclesBeforeLongBreak;

  const [mode, setMode] = useState("work");
  const [cycleCount, setCycleCount] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(WORK_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<any>(null);

  const [showModal, setShowModal] = useState(false);

  // Bloqueio de tela: mantém acordado enquanto timer está rodando
  useEffect(() => {
    if (isRunning) {
      activateKeepAwake();
    } else {
      deactivateKeepAwake();
    }
    return () => {
      deactivateKeepAwake();
    };
  }, [isRunning]);

  // Atualiza o timer se o usuário mudar as configurações
  useEffect(() => {
    setSecondsLeft(
      mode === "work"
        ? WORK_MINUTES * 60
        : mode === "short"
        ? SHORT_BREAK_MINUTES * 60
        : LONG_BREAK_MINUTES * 60
    );
  }, [WORK_MINUTES, SHORT_BREAK_MINUTES, LONG_BREAK_MINUTES, mode]);

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev: number) => prev - 1);
      }, 1000);
    } else if (!isRunning || secondsLeft === 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, secondsLeft]);

  // Vibração nos últimos 5 segundos
  useEffect(() => {
    if (isRunning && secondsLeft <= 5 && secondsLeft > 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  }, [secondsLeft, isRunning]);

  useEffect(() => {
    if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      if (mode === "work") {
        const nextCycle = cycleCount + 1;
        setCycleCount(nextCycle);
        if (nextCycle % CYCLES_BEFORE_LONG_BREAK === 0) {
          setMode("long");
          setSecondsLeft(LONG_BREAK_MINUTES * 60);
        } else {
          setMode("short");
          setSecondsLeft(SHORT_BREAK_MINUTES * 60);
        }
      } else {
        setMode("work");
        setSecondsLeft(WORK_MINUTES * 60);
      }
    }
  }, [secondsLeft, isRunning, mode, cycleCount, CYCLES_BEFORE_LONG_BREAK, LONG_BREAK_MINUTES, SHORT_BREAK_MINUTES, WORK_MINUTES]);

  const startTimer = () => setIsRunning(true);
  const stopTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    if (mode === "work") setSecondsLeft(WORK_MINUTES * 60);
    if (mode === "short") setSecondsLeft(SHORT_BREAK_MINUTES * 60);
    if (mode === "long") setSecondsLeft(LONG_BREAK_MINUTES * 60);
  };

  const switchToWork = () => {
    setMode("work");
    setSecondsLeft(WORK_MINUTES * 60);
    setIsRunning(false);
  };
  const switchToShortBreak = () => {
    setMode("short");
    setSecondsLeft(SHORT_BREAK_MINUTES * 60);
    setIsRunning(false);
  };
  const switchToLongBreak = () => {
    setMode("long");
    setSecondsLeft(LONG_BREAK_MINUTES * 60);
    setIsRunning(false);
  };

  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  let totalSeconds = WORK_MINUTES * 60;
  if (mode === "short") totalSeconds = SHORT_BREAK_MINUTES * 60;
  if (mode === "long") totalSeconds = LONG_BREAK_MINUTES * 60;
  const percent = (secondsLeft / totalSeconds) * 100;

  return (
    <Container>
      <Header>
        <TitleApp>
          {mode === "work" && "Pomodoro"}
          {mode === "short" && "Pausa Curta"}
          {mode === "long" && "Pausa Longa"}
        </TitleApp>
      </Header>

      <CycleInfo>
        Ciclo:{" "}
        {cycleCount % CYCLES_BEFORE_LONG_BREAK || CYCLES_BEFORE_LONG_BREAK} /{" "}
        {CYCLES_BEFORE_LONG_BREAK}
      </CycleInfo>

      <CircleContainer>
        <AnimatedCircularProgress
          size={220}
          width={16}
          fill={percent}
          tintColor={
            mode === "work"
              ? "#fac60c"
              : mode === "short"
              ? "#4cd964"
              : "#007aff"
          }
          backgroundColor="#eee"
          rotation={0}
        >
          {() => (
            <TimerText>
              {minutes}:{seconds}
            </TimerText>
          )}
        </AnimatedCircularProgress>
      </CircleContainer>
      <ButtonRow>
        <StyledButton
          onPress={startTimer}
          disabled={isRunning || secondsLeft === 0}
        >
          <ButtonText>Iniciar</ButtonText>
        </StyledButton>
        <StyledButton onPress={stopTimer} disabled={!isRunning}>
          <ButtonText>Pausar</ButtonText>
        </StyledButton>
        <StyledButton onPress={resetTimer}>
          <ButtonText>Resetar</ButtonText>
        </StyledButton>
      </ButtonRow>
      <ButtonCol>
        <StyledButtonFull onPress={switchToWork} disabled={mode === "work"}>
          <ButtonText>Pomodoro</ButtonText>
        </StyledButtonFull>
        <StyledButtonFull
          onPress={switchToShortBreak}
          disabled={mode === "short"}
        >
          <ButtonText>Pausa Curta</ButtonText>
        </StyledButtonFull>
        <StyledButtonFull
          onPress={switchToLongBreak}
          disabled={mode === "long"}
        >
          <ButtonText>Pausa Longa</ButtonText>
        </StyledButtonFull>
      </ButtonCol>

      <ButtonCol>
        <StyledButtonFull onPress={() => setShowModal(true)}>
            <ButtonText>Abrir Configurações</ButtonText>
        </StyledButtonFull>
      </ButtonCol>

      <SettingsModal visible={showModal} onClose={() => setShowModal(false)} />
      {secondsLeft === 0 && (
        <FinishText>
          {mode === "work"
            ? "Tempo de trabalho finalizado! Faça uma pausa."
            : "Pausa finalizada! Volte ao trabalho."}
        </FinishText>
      )}
    </Container>
  );
}
const Container = styled.View`
  flex: 1;
  background-color: #f2f2f7;
`;

const Header = styled.View`
  padding-top: 60px;
  background-color: #fac60c;
  justify-content: center;
  align-items: center;
`;

const TitleApp = styled.Text`
  padding: 12px 0;
  font-size: 28px;
  font-weight: bold;
`;

const CircleContainer = styled.View`
  align-items: center;
  justify-content: center;
  margin: 32px 0 16px 0;
`;

const TimerText = styled.Text`
  font-size: 48px;
  font-weight: bold;
  text-align: center;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: space-between;
  margin: 16px 20px;
`;

const ButtonCol = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 16px 20px;
  gap: 12px;
`;

const StyledButton = styled.TouchableOpacity<ButtonProps>`
  background-color: ${({ disabled }: ButtonProps) => (disabled ? "#ccc" : "#fac60c")};
  padding: 12px 24px;
  border-radius: 8px;
  margin: 0 8px;
`;

const StyledButtonFull = styled.TouchableOpacity<ButtonProps>`
  background-color: ${({ disabled }: ButtonProps) => (disabled ? "#ccc" : "#fac60c")};
  padding: 12px 24px;
  border-radius: 8px;
  margin: 0 8px;
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

const FinishText = styled.Text`
  font-size: 20px;
  color: #ff3b30;
  text-align: center;
  margin-top: 24px;
`;

const CycleInfo = styled.Text`
  font-size: 16px;
  color: #888;
  margin-top: 10px;
  text-align: center;
`;
