import {
  Dialog,
  Button,
  Heading,
  Text,
  Separator,
  Icon
} from '@chakra-ui/react';
import { X, RefreshCw, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

const InvoiceDetailsModal = ({ invoice, isOpen, onClose, onDelete }) => {
  if (!invoice) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content className="max-w-2xl">
          <Dialog.Header>
            <Dialog.Title>Invoice Details</Dialog.Title>
            <Dialog.CloseTrigger asChild>
              <Button variant="ghost" size="sm">
                <Icon>
                  <X size={20} />
                </Icon>
              </Button>
            </Dialog.CloseTrigger>
          </Dialog.Header>
          
          <Dialog.Body className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text className="text-sm font-medium text-neutral-600">Invoice ID</Text>
                <Text className="text-lg font-semibold text-neutral-900">{invoice.id}</Text>
              </div>
              <div>
                <Text className="text-sm font-medium text-neutral-600">Status</Text>
                <Text className="text-lg font-semibold text-neutral-900">{invoice.status}</Text>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text className="text-sm font-medium text-neutral-600">Vendor</Text>
                <Text className="text-lg font-semibold text-neutral-900">{invoice.vendor}</Text>
              </div>
              <div>
                <Text className="text-sm font-medium text-neutral-600">Date</Text>
                <Text className="text-lg font-semibold text-neutral-900">
                  {formatDate(invoice.date)}
                </Text>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text className="text-sm font-medium text-neutral-600">Total Amount</Text>
                <Heading size="xl" className="text-primary-600">
                  {formatCurrency(invoice.totalAmount)}
                </Heading>
              </div>
              <div>
                <Text className="text-sm font-medium text-neutral-600">Tax</Text>
                <Heading size="xl" className="text-neutral-900">
                  {formatCurrency(invoice.tax)}
                </Heading>
              </div>
            </div>

            {invoice.items && invoice.items.length > 0 && (
              <>
                <Separator />
                <div>
                  <Heading size="md" className="mb-4">Items</Heading>
                  <div className="space-y-3">
                    {invoice.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                        <div>
                          <Text className="font-medium text-neutral-900">{item.description}</Text>
                          <Text className="text-sm text-neutral-600">Quantity: {item.quantity}</Text>
                        </div>
                        <Text className="font-semibold text-neutral-900">
                          {formatCurrency(item.price)}
                        </Text>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </Dialog.Body>

          <Dialog.Footer className="flex gap-3">
            <Button
              variant="outline"
              colorPalette="error"
              onClick={() => {
                onDelete(invoice.id);
                onClose();
              }}
            >
              <Icon>
                <Trash2 size={16} />
              </Icon>
              Delete
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default InvoiceDetailsModal;