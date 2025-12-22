import { Card, Heading, Text } from '@chakra-ui/react';
import { formatCurrency } from '../../utils/formatters';

const TopVendors = ({ vendors }) => {
  return (
    <Card.Root className="p-6">
      <Heading size="lg" className="mb-4">Top Vendors</Heading>
      <div className="space-y-4">
        {vendors.map((vendor, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex-1">
              <Text className="font-medium text-neutral-900">{vendor.name}</Text>
              <Text className="text-sm text-neutral-600">{vendor.count} invoices</Text>
            </div>
            <Text className="font-semibold text-primary-600">
              {formatCurrency(vendor.amount)}
            </Text>
          </div>
        ))}
      </div>
    </Card.Root>
  );
};

export default TopVendors;