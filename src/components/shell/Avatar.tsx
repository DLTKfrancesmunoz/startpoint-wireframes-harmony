/**
 * Avatar – converted from Harmony Avatar.astro.
 * Square avatar with rounded corners and user icon.
 */

import { Icon } from './Icon';
import './Avatar.css';

export interface AvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const iconSizes = { sm: 'sm', md: 'md', lg: 'lg' } as const;

export function Avatar({ size = 'md', className = '' }: AvatarProps) {
  return (
    <div className={`avatar avatar--${size} ${className}`.trim()}>
      <Icon name="user" size={iconSizes[size]} className="avatar__icon" />
    </div>
  );
}
