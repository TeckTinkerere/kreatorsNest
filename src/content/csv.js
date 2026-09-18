/**
 * Minimal RFC 4180 CSV parser.
 *
 * Google Sheets exports quote any field containing a comma, newline, or quote,
 * and escapes an embedded quote by doubling it. That is exactly the subset
 * handled here, so a hand-rolled parser avoids pulling in a dependency for the
 * one place the app reads remote content.
 */

/**
 * Parse a CSV document into an array of string arrays.
 *
 * @param {string} text - Raw CSV text.
 * @returns {string[][]} Rows of raw cell values.
 */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  let fieldWasQuoted = false;

  // Normalise line endings so \r\n and \r behave like \n outside quotes.
  const src = String(text ?? '').replace(/\r\n?/g, '\n');

  const endField = () => {
    row.push(fieldWasQuoted ? field : field.trim());
    field = '';
    fieldWasQuoted = false;
  };

  const endRow = () => {
    endField();
    // Drop rows that are entirely empty (trailing newline, blank spacer rows).
    if (row.some((cell) => cell !== '')) rows.push(row);
    row = [];
  };

  for (let i = 0; i < src.length; i += 1) {
    const char = src[i];

    if (inQuotes) {
      if (char === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      fieldWasQuoted = true;
    } else if (char === ',') {
      endField();
    } else if (char === '\n') {
      endRow();
    } else {
      field += char;
    }
  }

  // Flush whatever the final line left behind.
  if (field !== '' || row.length > 0) endRow();

  return rows;
}

/**
 * Parse a CSV document into objects keyed by its header row.
 *
 * Header cells are lowercased and stripped of non-alphanumerics so that
 * "Read Time", "readTime" and "read_time" all resolve to `readtime`. This lets
 * the spreadsheet stay human-friendly without breaking the code.
 *
 * @param {string} text - Raw CSV text.
 * @returns {Object<string, string>[]} One object per data row.
 */
export function parseCsvToObjects(text) {
  const rows = parseCsv(text);
  if (rows.length < 2) return [];

  const headers = rows[0].map(normaliseHeader);

  return rows.slice(1).map((cells) => {
    const record = {};
    headers.forEach((header, index) => {
      if (!header) return;
      record[header] = cells[index] ?? '';
    });
    return record;
  });
}

/**
 * Reduce a header cell to a stable lookup key.
 *
 * @param {string} header - Raw header cell.
 * @returns {string} Lowercase alphanumeric key.
 */
export function normaliseHeader(header) {
  return String(header ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
}
