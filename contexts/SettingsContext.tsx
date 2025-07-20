import React, { createContext, useContext, useState } from 'react';

const defaultSettings = {
  workTime: 25, // minutos
  shortBreak: 5,
  longBreak: 15,
  cyclesBeforeLongBreak: 4,
};

const SettingsContext = createContext({
  settings: defaultSettings,
  setSettings: (s: typeof defaultSettings) => {},
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }: any) => {
  const [settings, setSettings] = useState(defaultSettings);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};