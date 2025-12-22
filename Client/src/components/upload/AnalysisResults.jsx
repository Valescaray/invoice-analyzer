import { Card, Heading, Text } from '@chakra-ui/react';
import { formatCurrency, formatDate } from '../../utils/formatters';

const AnalysisResults = ({ invoice }) => {
  return (
    <Card.Root className="p-6">
      <Heading size="lg" className="mb-6">Extracted Details</Heading>
      <div className="space-y-4">
        <div>
          <Text className="text-sm font-medium text-neutral-600">Vendor</Text>
          <Text className="text-lg font-semibold text-neutral-900">{invoice.vendor}</Text>
        </div>
        <div>
          <Text className="text-sm font-medium text-neutral-600">Date</Text>
          <Text className="text-lg font-semibold text-neutral-900">{formatDate(invoice.date)}</Text>
        </div>
        <div>
          <Text className="text-sm font-medium text-neutral-600">Total Amount</Text>
          <Text className="text-lg font-semibold text-primary-600">
            {formatCurrency(invoice.totalAmount)}
          </Text>
        </div>
        <div>
          <Text className="text-sm font-medium text-neutral-600">Tax</Text>
          <Text className="text-lg font-semibold text-neutral-900">
            {formatCurrency(invoice.tax)}
          </Text>
        </div>
        {invoice.items && invoice.items.length > 0 && (
          <div>
            <Text className="text-sm font-medium text-neutral-600 mb-2">Items</Text>
            <div className="space-y-2">
              {invoice.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <Text className="text-neutral-700">
                    {item.description} (x{item.quantity})
                  </Text>
                  <Text className="font-medium text-neutral-900">
                    {formatCurrency(item.price)}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card.Root>
  );
};

export default AnalysisResults;