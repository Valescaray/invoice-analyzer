import { Card, Text, Icon, Button } from '@chakra-ui/react';
import { FileUp, X } from 'lucide-react';
import { formatFileSize } from '../../utils/formatters';

const FilePreview = ({ file, onRemove }) => {
  return (
    <Card.Root className="p-4">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-primary-50">
          <Icon color="var(--color-primary-600)">
            <FileUp size={24} />
          </Icon>
        </div>
        <div className="flex-1">
          <Text className="font-medium text-neutral-900">{file.name}</Text>
          <Text className="text-sm text-neutral-600">{formatFileSize(file.size)}</Text>
        </div>
        <Button
          onClick={onRemove}
          variant="ghost"
          size="sm"
          className="text-neutral-600 hover:text-error-500"
        >
          <Icon>
            <X size={20} />
          </Icon>
        </Button>
      </div>
    </Card.Root>
  );
};

export default FilePreview;