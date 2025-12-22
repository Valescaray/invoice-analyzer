import { Card, CardContent } from '../ui/card';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const StatCard = ({ title, value, icon: Icon, trend, colorClass = 'bg-primary-50 text-primary-600' }) => {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
      transition={{ duration: 0.2 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
              <h3 className="text-3xl font-bold text-foreground">{value}</h3>
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
            </div>
            {Icon && (
              <div className={cn("p-3 rounded-lg", colorClass)}>
                <Icon className="w-6 h-6" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;