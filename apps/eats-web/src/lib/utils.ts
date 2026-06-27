import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

export function fmtFCFA(amount: number): string {
  const rounded = Math.round(amount / 50) * 50;
  return rounded.toLocaleString('fr-FR').replace(/\s/g, ' ') + ' FCFA';
}

export function fmtKm(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

export function fmtDuration(minutes: number): string {
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h} h${m > 0 ? ` ${String(m).padStart(2, '0')}` : ''}`;
}
