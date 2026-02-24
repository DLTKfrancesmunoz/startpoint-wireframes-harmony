/**
 * SunIcon – Heroicons-style sun for theme toggle.
 * Uses stroke="currentColor" so color matches theme (light/dark) like the moon Icon.
 */

import type { SVGAttributes } from 'react';

export interface SunIconProps extends SVGAttributes<SVGSVGElement> {
  size?: number;
}

const SUN_PATH =
  'M12 3V5.25M18.364 5.63604L16.773 7.22703M21 12H18.75M18.364 18.364L16.773 16.773M12 18.75V21M7.22703 16.773L5.63604 18.364M5.25 12H3M7.22703 7.22703L5.63604 5.63604M15.75 12C15.75 14.0711 14.0711 15.75 12 15.75C9.92893 15.75 8.25 14.0711 8.25 12C8.25 9.92893 9.92893 8.25 12 8.25C14.0711 8.25 15.75 9.92893 15.75 12Z';

export function SunIcon({ size = 20, className = '', ...rest }: SunIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      data-icon="sun"
      {...rest}
    >
      <path d={SUN_PATH} />
    </svg>
  );
}
