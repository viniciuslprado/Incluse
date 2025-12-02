export function formatPhone(value: string): string {
  const numbers = value.replace(/\D/g, '');
  let tel = numbers;
  // Remove DDI se vier com 55 no início
  if (tel.startsWith('55') && tel.length > 11) {
    tel = tel.slice(2);
  }
  if (tel.length <= 2) {
    return tel;
  } else if (tel.length <= 6) {
    return `(${tel.slice(0, 2)}) ${tel.slice(2)}`;
  } else if (tel.length === 10) {
    return `(${tel.slice(0, 2)}) ${tel.slice(2, 6)}-${tel.slice(6)}`;
  } else if (tel.length === 11) {
    return `(${tel.slice(0, 2)}) ${tel.slice(2, 7)}-${tel.slice(7)}`;
  } else {
    return `(${tel.slice(0, 2)}) ${tel.slice(2, 7)}-${tel.slice(7, 11)}`;
  }
}

export function unformatPhone(value: string): string {
  return value.replace(/\D/g, '');
}

export function formatCPF(value: string): string {
  const numbers = value.replace(/\D/g, '').slice(0, 11);
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`;
}