import { Table, Badge, Button } from '@chakra-ui/react';
import { formatCurrency, formatDate } from '../../utils/formatters';

const InvoiceTable = ({ invoices, onViewDetails }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Analyzed':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Failed':
        return 'error';
      default:
        return 'neutral';
    }
  };

  return (
    <Table.Root variant="outline" size="md">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Vendor</Table.ColumnHeader>
          <Table.ColumnHeader>Date</Table.ColumnHeader>
          <Table.ColumnHeader>Total Amount</Table.ColumnHeader>
          <Table.ColumnHeader>Tax</Table.ColumnHeader>
          <Table.ColumnHeader>Status</Table.ColumnHeader>
          <Table.ColumnHeader>Actions</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {invoices.map((invoice) => (
          <Table.Row key={invoice.id}>
            <Table.Cell className="font-medium">{invoice.vendor}</Table.Cell>
            <Table.Cell>{formatDate(invoice.date)}</Table.Cell>
            <Table.Cell className="font-semibold text-primary-600">
              {formatCurrency(invoice.totalAmount)}
            </Table.Cell>
            <Table.Cell>{formatCurrency(invoice.tax)}</Table.Cell>
            <Table.Cell>
              <Badge colorPalette={getStatusColor(invoice.status)}>
                {invoice.status}
              </Badge>
            </Table.Cell>
            <Table.Cell>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onViewDetails(invoice.id)}
              >
                View Details
              </Button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

export default InvoiceTable;