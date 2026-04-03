"use client";
import { createContext, useContext, ReactNode } from "react";

const SettingsContext = createContext<{ [key: string]: string }>({});

export const SettingsProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: { [key: string]: string };
}) => (
  <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("useSettings() must be used within <SettingsProvider/>");
  return context;
};
