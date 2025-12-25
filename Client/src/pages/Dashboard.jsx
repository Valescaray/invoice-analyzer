import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { FileUp, Receipt, DollarSign, TrendingUp, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGetDashboardStatsQuery } from '../api/invoiceApi';
import { formatCurrency } from '../lib/utils';
import StatCard from '../components/dashboard/StatCard';
import { Skeleton } from '../components/ui/skeleton';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../lib/animations';

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading, isError } = useGetDashboardStatsQuery();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card>
          <CardContent className="p-6">
            <p className="text-error-500">Failed to load dashboard data</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's an overview of your invoices.
          </p>
        </div>
        {/* Upload Button removed to consolidate with Quick Actions as per UX review */}
      </div>

      {/* Stats Cards */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={staggerItem}>
          <StatCard
            title="Total Invoices"
            value={stats.total_invoices || 0}
            icon={Receipt}
            colorClass="bg-primary-50 text-primary-600"
            trend={{ 
              value: `${Math.abs(stats.invoice_trend)}%`, 
              isPositive: stats.invoice_trend >= 0 
            }}
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatCard
            title="Total Expenses"
            value={formatCurrency(stats.total_expenses || 0)}
            icon={DollarSign}
            colorClass="bg-success-50 text-success-600"
            trend={{ 
              value: `${Math.abs(stats.expense_trend)}%`, 
              isPositive: stats.expense_trend >= 0 
            }}
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatCard
            title="Monthly Expenses"
            value={formatCurrency(stats.current_month_expenses || 0)}
            icon={TrendingUp}
            colorClass="bg-warning-50 text-warning-600"
            trend={{ 
              value: `${Math.abs(stats.expense_trend)}%`, 
              isPositive: stats.expense_trend >= 0 
            }}
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatCard
            title="Analysis Accuracy"
            value="98.5%"
            icon={CheckCircle}
            colorClass="bg-purple-50 text-purple-600"
          />
        </motion.div>
      </motion.div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Vendors */}
        <Card>
          <CardHeader>
            <CardTitle>Top Vendors</CardTitle>
            <CardDescription>Your most frequent vendors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.top_vendors && stats.top_vendors.length > 0 ? (
                stats.top_vendors.slice(0, 5).map((vendor, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary-700">
                          {vendor.name?.charAt(0) || '?'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{vendor.name || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">{vendor.count || 0} invoices</p>
                      </div>
                    </div>
                    <p className="font-semibold text-sm">
                      {formatCurrency(vendor.total || 0)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No vendor data available
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Expenses by Currency */}
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Currency</CardTitle>
            <CardDescription>Breakdown of expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.expenses_by_currency && stats.expenses_by_currency.length > 0 ? (
                stats.expenses_by_currency.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.currency || 'USD'}</span>
                      <span className="text-muted-foreground">
                        {formatCurrency(item.total || 0, item.currency)}
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{
                          width: `${((item.total || 0) / (stats.total_expenses || 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No expense data available
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="justify-start h-auto py-4"
              onClick={() => navigate('/upload')}
            >
              <FileUp className="w-5 h-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">Upload Invoice</p>
                <p className="text-xs text-muted-foreground">Process a new document</p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start h-auto py-4"
              onClick={() => navigate('/invoices')}
            >
              <Receipt className="w-5 h-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">View All Invoices</p>
                <p className="text-xs text-muted-foreground">Browse your history</p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start h-auto py-4"
              onClick={() => navigate('/settings')}
            >
              <TrendingUp className="w-5 h-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">Analytics</p>
                <p className="text-xs text-muted-foreground">View detailed reports</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;