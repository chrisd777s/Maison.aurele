"use client";

import { useSearchParams } from "next/navigation";
import { AppointmentForm } from "./AppointmentForm";

/** Pièce (`?piece=`) ou création de L'Atelier (`?creation=`) transmise par le lien d'arrivée. */
export function AppointmentFromUrl() {
  const params = useSearchParams();
  return (
    <AppointmentForm
      piece={params.get("piece") ?? undefined}
      creation={params.get("creation")?.slice(0, 300) ?? undefined}
    />
  );
}
