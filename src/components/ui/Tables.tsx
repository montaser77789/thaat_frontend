// ============= Small helpers =============
interface ThProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  className?: string;
}



export const Th: React.FC<ThProps> = ({
  className = "",
  children,
  ...rest
}) => (
  <th
    className={`px-4 py-3 text-sm font-bold uppercase tracking-wide ${className}`}
    {...rest}
  >
    {children}
  </th>
);

interface TdProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  className?: string;
}

export const Td: React.FC<TdProps> = ({
  className = "",
  children,
  ...rest
}) => (
  <td className={`px-4 py-3 ${className}`} {...rest}>
    {children}
  </td>
);