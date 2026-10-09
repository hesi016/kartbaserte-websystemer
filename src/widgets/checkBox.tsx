import React, { ReactNode } from "react";

// Gjenbrukbar knapp for å lage interaktivet slik at brukeren skal kunne styre hva de vil se på kartet.
export function CheckboxButton({
  onClick,
  checked,
  children,
}: {
  onClick: () => void;
  checked: boolean;
  children: ReactNode;
}) {
  return (
    <button onClick={onClick} className="checkbox-button">
      <input type="checkbox" checked={checked} readOnly tabIndex={-1} />{" "}
      {children}
    </button>
  );
}
