import { Card, CardContent } from '../ui/card';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const StatCard = ({ title, value, icon: Icon, trend, colorClass = 'bg-primary-50 text-primary-600' }) => {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="h-full">
        <CardContent className="p-6 h-full min-h-[160px] flex flex-col">
          <div className="flex items-start justify-between mb-auto">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground mb-2 line-clamp-2">{title}</p>
              <h3 className="text-3xl font-bold text-foreground mb-2 break-words">{value}</h3>
            </div>
            {Icon && (
              <div className={cn("p-3 rounded-lg flex-shrink-0 ml-3", colorClass)}>
                <Icon className="w-6 h-6" />
              </div>
            )}
          </div>
          {trend && (
            <p className={cn(
              "text-sm mt-2 flex items-center gap-1",
              trend.isPositive ? "text-success-600" : "text-error-600"
            )}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{trend.value}</span>
              <span className="text-muted-foreground">vs last month</span>
            </p>
          )}
          {!trend && (
            <div className="h-6 mt-2" />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;