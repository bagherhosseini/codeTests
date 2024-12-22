const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const britishOnly = require('./british-only.js')
const americanToBritishTitles = require('./american-to-british-titles.js');

class Translator {
  constructor() {
    this.americanToBritish = {
      ...americanOnly,
      ...americanToBritishSpelling
    };
    
    this.britishToAmerican = {
      ...britishOnly,
      ...Object.fromEntries(Object.entries(americanToBritishSpelling).map(([k, v]) => [v, k]))
    };
  }

  translate(text, locale) {
    if (!text) return { error: 'No text to translate' };
    if (!locale) return { error: 'Required field(s) missing' };
    if (!['american-to-british', 'british-to-american'].includes(locale)) {
      return { error: 'Invalid value for locale field' };
    }

    let translatedText = text;

    // Handle titles using american-to-british-titles.js
    if (locale === 'american-to-british') {
      // American to British titles
      Object.entries(americanToBritishTitles)
        .sort((a, b) => b[0].length - a[0].length)
        .forEach(([key, value]) => {
          // Match the title followed by a word character
          const regex = new RegExp(`\\b${key}\\s+(?=\\w)`, 'gi');
          translatedText = translatedText.replace(regex, match => {
            const title = value.charAt(0).toUpperCase() + value.slice(1);
            return `<span class="highlight">${title}</span> `;
          });
        });
    } else {
      // British to American titles
      Object.entries(americanToBritishTitles)
        .sort((a, b) => b[1].length - a[1].length)
        .forEach(([key, value]) => {
          // Match the title followed by a word character
          const regex = new RegExp(`\\b${value}\\s+(?=\\w)`, 'gi');
          translatedText = translatedText.replace(regex, match => {
            const title = key.charAt(0).toUpperCase() + key.slice(1);
            return `<span class="highlight">${title}</span> `;
          });
        });
    }

    // Handle time format
    const timeRegex = locale === 'american-to-british' ? 
      /([1-9]|1[0-2]):([0-5][0-9])/ : 
      /([1-9]|1[0-2])\.([0-5][0-9])/;
    translatedText = translatedText.replace(timeRegex, (match) => {
      const newTime = locale === 'american-to-british' ? 
        match.replace(':', '.') : 
        match.replace('.', ':');
      return `<span class="highlight">${newTime}</span>`;
    });

    // Handle other words and phrases
    const dictionary = locale === 'american-to-british' ? 
      this.americanToBritish : 
      this.britishToAmerican;
    
    Object.entries(dictionary)
      .sort((a, b) => b[0].length - a[0].length)
      .forEach(([key, value]) => {
        const regex = new RegExp(`\\b${key}\\b`, 'gi');
        translatedText = translatedText.replace(regex, 
          `<span class="highlight">${value}</span>`);
      });

    if (translatedText === text) {
      return {
        text,
        translation: "Everything looks good to me!"
      };
    }

    return {
      text,
      translation: translatedText
    };
  }
}

module.exports = Translator;