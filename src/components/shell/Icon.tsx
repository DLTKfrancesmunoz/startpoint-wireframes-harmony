/**
 * Icon – converted from Harmony Icon.astro.
 * Resolution: manifest (vp/cp/ppm/maconomy) → fallback "?".
 * No <style> block in source; uses global --icon-* tokens.
 */

import type { SVGAttributes } from 'react';

import iconManifestData from '@harmony-data/icon-manifest.json';

const iconManifest = iconManifestData as Record<string, Record<string, { svg?: string; source?: string }>>;

const THEMES = ['vp', 'cp', 'ppm', 'maconomy'] as const;

const sizeDimensions: Record<string, { width: number; height: number }> = {
  xs: { width: 12, height: 12 },
  sm: { width: 16, height: 16 },
  md: { width: 20, height: 20 },
  lg: { width: 24, height: 24 },
  xl: { width: 32, height: 32 },
};

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, 'viewBox'> {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'outline' | 'solid';
  className?: string;
}

function getSvgFromManifest(name: string): string | null {
  for (const theme of THEMES) {
    const section = iconManifest[theme];
    if (!section) continue;
    const entry = section[name];
    if (entry?.svg) return entry.svg;
  }
  return null;
}

export function Icon({
  name,
  size = 'md',
  className = '',
  variant = 'outline',
  style,
  ...rest
}: IconProps) {
  const dimensions = sizeDimensions[size] ?? sizeDimensions.md;
  const svgFromManifest = getSvgFromManifest(name);

  if (svgFromManifest) {
    const viewBoxMatch = svgFromManifest.match(/viewBox="([^"]*)"/);
    const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';
    const innerMatch = svgFromManifest.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
    let innerContent = innerMatch ? innerMatch[1].trim() : '';

    // Match Icon.astro: custom/filled icons must not get outer stroke (avoids double stroke)
    const hasGradients = /(fill|stroke)="url\(#[^)]+\)"/.test(innerContent);
    const isNonStandardViewBox = viewBox !== '0 0 24 24';
    const useComplexSvg = hasGradients || isNonStandardViewBox;

    const hasFillHex = /fill="(#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3})"/i.test(innerContent);
    const hasStrokeHex = /stroke="(#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3})"/i.test(innerContent);
    const isFilledIcon = hasFillHex && !hasStrokeHex;
    const isMixedCustomIcon = hasFillHex && hasStrokeHex;

    if (!useComplexSvg) {
      const defsMatch = innerContent.match(/(<defs>[\s\S]*?<\/defs>)/);
      const defsContent = defsMatch ? defsMatch[1] : '';
      const contentWithoutDefs = innerContent.replace(/(<defs>[\s\S]*?<\/defs>)/, '');
      const processedContent = contentWithoutDefs
        .replace(/stroke="(#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3})"/gi, 'stroke="currentColor"')
        .replace(/fill="(#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3})"/gi, 'fill="currentColor"')
        .trim();
      innerContent = processedContent + (defsContent ? '\n' + defsContent : '');
    }

    const outerFill = useComplexSvg ? 'none' : isFilledIcon ? 'currentColor' : 'none';
    const outerStroke = useComplexSvg ? undefined : isFilledIcon || isMixedCustomIcon ? 'none' : 'currentColor';
    const strokeWidth = useComplexSvg || isMixedCustomIcon ? undefined : isFilledIcon ? undefined : '1.5';
    const strokeStyle = useComplexSvg || isFilledIcon || isMixedCustomIcon ? undefined : { strokeWidth: 'var(--icon-stroke-width)' };

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={outerFill}
        viewBox={viewBox}
        width={dimensions.width}
        height={dimensions.height}
        className={className}
        style={{ ...strokeStyle, ...(style as React.CSSProperties) }}
        stroke={outerStroke}
        strokeWidth={strokeWidth}
        aria-hidden
        data-icon={name}
        dangerouslySetInnerHTML={{ __html: innerContent }}
        {...rest}
      />
    );
  }

  // Fallback: same as Astro – span with "?"
  return (
    <span
      title={`Icon "${name}" not found`}
      className={className}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--icon-fallback-bg)',
        color: 'var(--icon-fallback-text)',
        fontSize: 'var(--icon-fallback-font-size)',
        borderRadius: 'var(--icon-fallback-radius)',
      }}
      data-icon={name}
    >
      ?
    </span>
  );
}
