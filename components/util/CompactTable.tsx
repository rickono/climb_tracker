import React from 'react';

interface Row {
  key: string;
}

const CompactTable = <T extends Row>({
  headers,
  rows,
  renderRow,
  showFooter = false,
}: {
  headers: string[];
  rows: T[];
  renderRow: (row: T) => JSX.Element;
  showFooter?: boolean;
}) => {
  return (
    <div className='overflow-x-auto shadow-md'>
      <table className='table table-compact w-full'>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <React.Fragment key={row.key}>{renderRow(row)}</React.Fragment>
          ))}
        </tbody>
        {showFooter && (
          <tfoot>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default CompactTable;
