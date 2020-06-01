import currencyFormat from 'currency-format';
import currencyNumberFormat from 'currency-number-format';

// CURRENCY CODE
function defaultCurrency(currency) {
  return {
    name: currency,
    fractionSize: 2,
    symbol: {
      grapheme: currency,
      template: null,
      rtl: false,
    },
    uniqSymbol: null,
  };
}

function getCurrencyOptions(currency) {
  return currency
    ? currencyFormat[currency.toUpperCase()] || defaultCurrency(currency)
    : defaultCurrency(currency);
}

// LOCALE
const defaultLocale = 'en_US';

function formatLocale(locale) {
  return [locale.substr(0, 2).toLowerCase(), locale.substr(3, 2).toUpperCase()].join('_');
}

function getLanguageOptions(locale) {
  return locale
    ? currencyNumberFormat[formatLocale(locale)] || currencyNumberFormat[defaultLocale]
    : currencyNumberFormat[defaultLocale];
}

// CURRENCY
function getFormattedCurrency(amount, currency, locale) {
  const parsedAmount = parseFloat(amount);
  if (!currency || isNaN(parsedAmount)) {
    return {
      formattedCurrency: amount + ' ' + currency,
      dir: 'ltr',
    };
  }

  const currencyOptions = getCurrencyOptions(currency);
  const languageOptions = getLanguageOptions(locale);

  const signAmount = parsedAmount < 0 ? '-' : '';
  const fractionSize = currencyOptions.fractionSize;

  const symbol = currencyOptions.symbol;
  let thousandSeparator = languageOptions.thousands;
  let decimalSeparator = languageOptions.decimal;
  // Spike for escaping case when grapheme is arabic symbol, and russian style separators was chosen
  if ((!symbol || symbol.rtl) && languageOptions.thousands === ' ') {
    thousandSeparator = ',';
    decimalSeparator = '.';
  }

  const splittedAmount = Math.abs(parsedAmount)
    .toFixed(fractionSize)
    .split('.');
  splittedAmount[0] = splittedAmount[0].replace(
    /(\d)(?=(\d{3})+(?!\d))/g,
    '$1' + thousandSeparator
  );
  const formattedAmount = splittedAmount.join(decimalSeparator);

  let formattedCurrency = signAmount + formattedAmount + ' ' + currency;
  let rtl = false;
  if (symbol && symbol.template) {
    formattedCurrency =
      signAmount + symbol.template.replace('1', formattedAmount).replace('$', symbol.grapheme);
    rtl = symbol.rtl;
  }

  return {
    formattedCurrency: formattedCurrency,
    dir: rtl ? 'rtl' : 'ltr',
  };
}

function formatRealAmount(amount) {
  return Math.round(amount * 100) / 100;
}

export { getFormattedCurrency, formatRealAmount };
