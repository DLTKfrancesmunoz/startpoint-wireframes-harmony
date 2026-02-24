/**
 * ShellHeader – converted from Harmony ShellHeader.astro.
 * Top bar: logo, product name, company picker, avatar.
 */

import { useRef, useEffect, useState } from 'react';
import { Icon } from './Icon';
import { Avatar } from './Avatar';
import './ShellHeader.css';

export interface CompanyOption {
  id: string;
  name: string;
  color?: string;
}

export interface ShellHeaderProps {
  productName?: string;
  logoSrc?: string;
  companyName?: string;
  showCompanyPicker?: boolean;
  companyColor?: string;
  companies?: CompanyOption[];
  className?: string;
}

const DEFAULT_COMPANIES: CompanyOption[] = [
  { id: 'acme-corp', name: 'Acme Corporation', color: '#FF507B' },
  { id: 'ocean-industries', name: 'Ocean Industries', color: '#285F8C' },
  { id: 'violet-systems', name: 'Violet Systems', color: '#DC50FF' },
  { id: 'azure-dynamics', name: 'Azure Dynamics', color: '#5077FF' },
  { id: 'sunset-corporation', name: 'Sunset Corporation', color: '#FFAF50' },
];

const OPTION_CLASS_MAP: Record<string, string> = {
  'acme-corp': 'company-picker__option-indicator--acme',
  'ocean-industries': 'company-picker__option-indicator--ocean',
  'violet-systems': 'company-picker__option-indicator--violet',
  'azure-dynamics': 'company-picker__option-indicator--azure',
  'sunset-corporation': 'company-picker__option-indicator--sunset',
};

export function ShellHeader({
  productName = 'Startpoint',
  logoSrc = '/logos/CPVPLogo.svg',
  companyName = 'Company name',
  showCompanyPicker = true,
  companyColor: companyColorProp,
  companies,
  className = '',
}: ShellHeaderProps) {
  const companyOptions = companies ?? DEFAULT_COMPANIES;
  const [selectedCompany, setSelectedCompany] = useState<CompanyOption>(companyOptions[0] ?? { id: '', name: companyName, color: undefined });
  const [menuOpen, setMenuOpen] = useState(false);
  const [indicatorColor, setIndicatorColor] = useState<string | undefined>(companyColorProp ?? companyOptions[0]?.color);
  const pickerRef = useRef<HTMLDivElement>(null);

  const effectiveCompanyColor = companyColorProp ?? indicatorColor ?? selectedCompany?.color;

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [menuOpen]);

  const handleSelectCompany = (company: CompanyOption) => {
    setSelectedCompany(company);
    setIndicatorColor(company.color);
    setMenuOpen(false);
  };

  return (
    <header className={`header ${className}`.trim()}>
      <div className="header__brand">
        <a href="/" className="header__brand-link">
          <img src={logoSrc} alt="Logo" className="header__logo" />
          <span className="header__title">{productName}</span>
        </a>
      </div>

      <div className="header__actions">
        {showCompanyPicker && (
          <>
            <div className="company-picker" ref={pickerRef}>
              <button
                type="button"
                className="company-picker__btn"
                onClick={() => setMenuOpen((o) => !o)}
                aria-expanded={menuOpen}
                aria-haspopup="listbox"
              >
                <span
                  className="company-picker__indicator"
                  style={indicatorColor ? { backgroundColor: indicatorColor } : undefined}
                />
                <span className="company-picker__name">{selectedCompany?.name ?? companyName}</span>
                <Icon name="chevron-down" size="sm" className="company-picker__chevron" />
              </button>
              <div
                className={`company-picker__menu ${menuOpen ? 'company-picker__menu--open' : ''}`}
                role="listbox"
              >
                {companyOptions.map((company) => (
                  <button
                    key={company.id}
                    type="button"
                    className={`company-picker__option ${selectedCompany?.id === company.id ? 'company-picker__option--selected' : ''}`}
                    onClick={() => handleSelectCompany(company)}
                    role="option"
                    aria-selected={selectedCompany?.id === company.id}
                  >
                    <span
                      className={`company-picker__option-indicator ${companies == null ? OPTION_CLASS_MAP[company.id] ?? '' : ''}`.trim()}
                      style={company.color ? { backgroundColor: company.color } : undefined}
                    />
                    <span className="company-picker__option-name">{company.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="divider" />
          </>
        )}
        <Avatar size="sm" />
      </div>

      <div
        className="header__gradient"
        data-header-gradient
        style={
          effectiveCompanyColor
            ? { background: `linear-gradient(to right, ${effectiveCompanyColor}05, ${effectiveCompanyColor} 50%, ${effectiveCompanyColor}05)` }
            : undefined
        }
      />
    </header>
  );
}
