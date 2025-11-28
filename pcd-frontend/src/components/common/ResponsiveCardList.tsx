import React from 'react';
import { Link } from 'react-router-dom';
import { badgeClasses } from './Badge';
import { buttonClasses } from './Button';

export type CardActionVariant =
  | 'primary' | 'secondary' | 'neutral'
  | 'danger' | 'warning' | 'success'
  | 'blue' | 'indigo' | 'purple' | 'yellow' | 'red' | 'green';

export interface CardAction {
  label: string;
  to?: string;
  onClick?: () => void;
  variant?: CardActionVariant;
  full?: boolean;
}

export interface CardMeta {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}

export interface CardBadge {
  text: string;
  color?: 'gray' | 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

export interface CardItem {
  id: string | number;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;
  badge?: CardBadge | React.ReactNode;
  meta?: CardMeta[];
  actions?: CardAction[];
}

export interface ResponsiveCardListProps {
  items: CardItem[];
  emptyMessage?: string;
  className?: string;
}

function actionClasses(variant: CardActionVariant = 'neutral') {
  return `w-full ${buttonClasses(variant)}`;
}

export default function ResponsiveCardList({ items, emptyMessage = 'Nenhum item encontrado', className }: ResponsiveCardListProps) {
  if (!items || items.length === 0) {
    return <div className={`px-4 py-8 text-center text-gray-500 dark:text-gray-400 ${className ?? ''}`}>{emptyMessage}</div>;
  }

  return (
    <div className={`divide-y divide-gray-200 dark:divide-gray-700 ${className ?? ''}`}>
      {items.map((item) => (
        <div key={item.id} className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
              {item.subtitle ? (
                <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-300">{item.subtitle}</p>
              ) : null}
              {item.description ? (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{item.description}</p>
              ) : null}
            </div>
            {item.badge && (
              typeof item.badge === 'object' && 'text' in item.badge ? (
                <span className={badgeClasses(item.badge.color)}>{item.badge.text}</span>
              ) : (
                <>{item.badge}</>
              )
            )}
          </div>

          {item.meta && item.meta.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              {item.meta.map((m, idx) => (
                <div key={idx}>
                  <div className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    {m.icon}{m.label}
                  </div>
                  <div className="text-gray-900 dark:text-gray-100">{m.value}</div>
                </div>
              ))}
            </div>
          )}

          {item.actions && item.actions.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {item.actions.map((a, idx) => {
                const btn = (
                  <button
                    type="button"
                    onClick={a.onClick}
                    className={actionClasses(a.variant)}
                  >
                    {a.label}
                  </button>
                );
                if (a.to) {
                  return (
                    <Link key={idx} to={a.to} className={actionClasses(a.variant)}>
                      {a.label}
                    </Link>
                  );
                }
                return <div key={idx} className={a.full ? 'col-span-2' : ''}>{btn}</div>;
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
