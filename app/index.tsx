import SettingsModal from "@/components/SettingsModal";
import { useSettings } from "@/contexts/SettingsContext";
import * as Haptics from "expo-haptics";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import * as Notifications from "expo-notifications";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AppState, Platform } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import {
  ButtonCol,
  ButtonRow,
  ButtonText,
  CircleContainer,
  Container,
  CycleInfo,
  FinishText,
  Header,
  StyledButton,
  StyledButtonFull,
  TimerText,
  TitleApp,
} from "./HomeScreen.styles";
// Configuração do canal de notificação para Android
if (Platform.OS === "android") {
  Notifications.setNotificationChannelAsync("default", {
    name: "PomoTimer",
    importance: Notifications.AndroidImportance.HIGH,
  });
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
  const notificationIntervalRef = useRef<any>(null);

  const [showModal, setShowModal] = useState(false);

  // Solicitar permissões de notificação
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Notification permissions not granted");
      }
    };
    requestPermissions();
  }, []);

  // Funções de notificação
  const stopNotificationCountdown = useCallback(() => {
    if (notificationIntervalRef.current) {
      clearInterval(notificationIntervalRef.current);
      notificationIntervalRef.current = null;
    }
    Notifications.cancelAllScheduledNotificationsAsync();
  }, []);

  const startNotificationCountdown = useCallback(() => {
    let currentSeconds = secondsLeft;

    const updateNotification = async () => {
      if (currentSeconds > 0) {
        const minutes = Math.floor(currentSeconds / 60)
          .toString()
          .padStart(2, "0");
        const seconds = (currentSeconds % 60).toString().padStart(2, "0");

        await Notifications.scheduleNotificationAsync({
          identifier: "pomodoro-countdown",
          content: {
            title:
              mode === "work"
                ? "PomoTimer em andamento"
                : mode === "short"
                ? "Pausa Curta"
                : "Pausa Longa",
            body: `Tempo restante: ${minutes}:${seconds}`,
            sound: false,
            sticky: true,
          },
          trigger: null, // Mostra imediatamente
        });

        currentSeconds--;
      } else {
        stopNotificationCountdown();
        // Notificação final
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "PomoTimer",
            body:
              mode === "work"
                ? "Tempo de trabalho finalizado! Faça uma pausa."
                : "Pausa finalizada! Volte ao trabalho.",
            sound: true,
          },
          trigger: null,
        });
      }
    };

    // Primeira notificação imediata
    updateNotification();

    // Atualiza a cada segundo
    notificationIntervalRef.current = setInterval(updateNotification, 1000);
  }, [secondsLeft, mode, stopNotificationCountdown]);

  // Listener para notificação ao minimizar
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "background" && isRunning && secondsLeft > 0) {
        startNotificationCountdown();
      }
      if (nextState === "active") {
        stopNotificationCountdown();
      }
    });
    return () => {
      subscription.remove();
    };
  }, [
    isRunning,
    secondsLeft,
    mode,
    startNotificationCountdown,
    stopNotificationCountdown,
  ]);

  // Bloqueio de tela: mantém acordado enquanto timer está rodando
  useEffect(() => {
    if (isRunning) {
      activateKeepAwakeAsync();
    } else {
      deactivateKeepAwake();
      stopNotificationCountdown();
    }
    return () => {
      deactivateKeepAwake();
      stopNotificationCountdown();
    };
  }, [isRunning, stopNotificationCountdown]);

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
  }, [
    secondsLeft,
    isRunning,
    mode,
    cycleCount,
    CYCLES_BEFORE_LONG_BREAK,
    LONG_BREAK_MINUTES,
    SHORT_BREAK_MINUTES,
    WORK_MINUTES,
  ]);

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
          {mode === "work" && "PomoTimer"}
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
          <ButtonText>PomoTimer</ButtonText>
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
