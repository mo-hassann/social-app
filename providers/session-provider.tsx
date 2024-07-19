"use client";
import { Session } from "next-auth";
import { createContext } from "react";

export const SessionProvider = createContext<Session | null>(null);
