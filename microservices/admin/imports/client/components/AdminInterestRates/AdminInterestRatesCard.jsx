import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import T from 'core/components/Translation/';
import AdminInterestRatesTable from './AdminInterestRatesTable';

const AdminInterestRatesCard = () => (
  <Card className="admin-interest-rates-card">
    <CardHeader title={<T id="AdminInterestRatesCard.title" />} />
    <CardContent>
      <AdminInterestRatesTable />
    </CardContent>
  </Card>
);

export default AdminInterestRatesCard;
