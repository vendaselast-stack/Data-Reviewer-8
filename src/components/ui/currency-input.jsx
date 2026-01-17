import { forwardRef, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

// Format number to Brazilian currency format (1.234,56)
export function formatCurrency(value) {
  if (value === null || value === undefined || value === '') return '';
  const numValue = typeof value === 'number' ? value : parseFloat(value);
  if (isNaN(numValue)) return '';
  return numValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Parse currency value to number (handles both BR and US formats)
export function parseCurrency(value) {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return value;
  
  const strValue = value.toString().trim();
  
  // Detect format: if has comma as decimal separator, it's Brazilian format
  // Brazilian: 1.234,56 (dot = thousand, comma = decimal)
  // American: 1234.56 or 1,234.56 (comma = thousand, dot = decimal)
  
  const hasComma = strValue.includes(',');
  const hasDot = strValue.includes('.');
  
  let cleanValue;
  
  if (hasComma && hasDot) {
    // Both present: determine by position (last one is decimal)
    const lastComma = strValue.lastIndexOf(',');
    const lastDot = strValue.lastIndexOf('.');
    
    if (lastComma > lastDot) {
      // Brazilian format: 1.234,56
      cleanValue = strValue.replace(/\./g, '').replace(',', '.');
    } else {
      // American format: 1,234.56
      cleanValue = strValue.replace(/,/g, '');
    }
  } else if (hasComma) {
    // Only comma: Brazilian decimal (544,44)
    cleanValue = strValue.replace(',', '.');
  } else {
    // Only dot or no separator: American format (544.44 or 544)
    cleanValue = strValue;
  }
  
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? 0 : parsed;
}

// Format as user types (cents to currency)
function formatAsCurrency(rawValue) {
  if (rawValue === null || rawValue === undefined || rawValue === '') return '';
  
  // Remove any non-digit characters
  const digits = rawValue.toString().replace(/\D/g, '');
  
  if (!digits) return '';
  
  // Convert to cents then to decimal
  const cents = parseInt(digits, 10);
  const reais = cents / 100;
  
  return reais.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const CurrencyInput = forwardRef(({ 
  value, 
  onChange, 
  placeholder = "0,00",
  className = "",
  ...props 
}, ref) => {
  const [displayValue, setDisplayValue] = useState(() => {
    // Initialize with formatted value
    if (value !== undefined && value !== null && value !== '') {
      const numValue = typeof value === 'number' ? value : parseCurrency(value);
      return numValue > 0 ? formatCurrency(numValue) : '';
    }
    return '';
  });

  // Update whenever value prop changes
  useEffect(() => {
    if (value !== undefined && value !== null && value !== '') {
      const numValue = typeof value === 'number' ? value : parseCurrency(value);
      const formatted = numValue > 0 ? formatCurrency(numValue) : '';
      setDisplayValue(formatted);
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const handleChange = (e) => {
    const inputValue = e.target.value;
    
    // Format the display value
    const formatted = formatAsCurrency(inputValue);
    setDisplayValue(formatted);
    
    // Parse to number and call onChange
    const numericValue = parseCurrency(formatted);
    
    if (onChange) {
      // Create a synthetic event with the numeric value
      onChange({
        ...e,
        target: {
          ...e.target,
          value: numericValue
        }
      });
    }
  };

  const handleFocus = (e) => {
    // Select all on focus for easy editing
    e.target.select();
  };

  return (
    <Input
      ref={ref}
      type="text"
      inputMode="numeric"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      placeholder={placeholder}
      className={className}
      {...props}
    />
  );
});

CurrencyInput.displayName = 'CurrencyInput';

export { CurrencyInput };
