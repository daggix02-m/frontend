import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
  Button,
  Input,
} from '@/components/ui/ui';
import { FileText, AlertCircle, CheckCircle, Clock, Search } from 'lucide-react';
import { pharmacistService } from '@/services/pharmacist.service';
import { toast } from 'sonner';

export function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
    fetchAlerts();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await pharmacistService.getPrescriptions();

      if (response.success) {
        const prescriptionsData = response.data || response.prescriptions || [];
        setPrescriptions(Array.isArray(prescriptionsData) ? prescriptionsData : []);
      } else {
        toast.error('Failed to load prescriptions');
        setPrescriptions([]);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      toast.error('Failed to load prescriptions');
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await pharmacistService.getAlerts();
      if (response.success) {
        setAlerts(response.data || response.alerts || []);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'default',
      validated: 'secondary',
      dispensed: 'secondary',
      rejected: 'destructive',
    };
    const icons = {
      pending: Clock,
      validated: CheckCircle,
      dispensed: CheckCircle,
      rejected: AlertCircle,
    };
    const Icon = icons[status] || Clock;
    return (
      <Badge variant={variants[status] || 'default'} className='flex items-center gap-1 w-fit'>
        <Icon className='h-3 w-3' />
        {status}
      </Badge>
    );
  };

  const stats = [
    {
      title: 'Pending Validation',
      value: prescriptions.filter((p) => p.status === 'pending').length,
      icon: Clock,
      color: 'text-orange-600',
    },
    {
      title: 'Validated Today',
      value: prescriptions.filter((p) => p.status === 'validated').length,
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      title: 'Dispensed Today',
      value: prescriptions.filter((p) => p.status === 'dispensed').length,
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      title: 'Flagged',
      value: prescriptions.filter((p) => p.flagged).length,
      icon: AlertCircle,
      color: 'text-red-600',
    },
  ];

  const handleValidate = async (id) => {
    if (window.confirm('Are you sure you want to validate this prescription?')) {
      try {
        const response = await pharmacistService.validatePrescription(id);
        if (response.success) {
          toast.success('Prescription validated successfully');
          await fetchPrescriptions();
        } else {
          toast.error(response.message || 'Failed to validate prescription');
        }
      } catch (error) {
        console.error('Error validating prescription:', error);
        toast.error('Failed to validate prescription');
      }
    }
  };

  const handleDispense = async (id) => {
    if (window.confirm('Confirm dispensing for this prescription?')) {
      try {
        const response = await pharmacistService.dispensePrescription(id);
        if (response.success) {
          toast.success('Prescription dispensed successfully');
          await fetchPrescriptions();
        } else {
          toast.error(response.message || 'Failed to dispense prescription');
        }
      } catch (error) {
        console.error('Error dispensing prescription:', error);
        toast.error('Failed to dispense prescription');
      }
    }
  };

  if (loading) {
    return (
      <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
        <h1 className='text-3xl font-bold tracking-tight'>Prescription Management</h1>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Prescription Management</h1>
        <p className='text-muted-foreground mt-2'>Validate and dispense prescriptions</p>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4'>
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
              <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent className='px-6 pb-6'>
              <div className='text-2xl font-bold'>{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className='pt-6'>
          <div className='relative w-full md:max-w-md'>
            <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search by prescription ID, patient name, or medication...'
              className='pl-10'
            />
          </div>
        </CardContent>
      </Card>

      {/* Active Prescriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Prescriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prescription ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Medication</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescriptions.map((rx) => (
                  <TableRow key={rx.id}>
                    <TableCell className='font-medium'>{rx.id}</TableCell>
                    <TableCell>{rx.patient}</TableCell>
                    <TableCell>{rx.doctor}</TableCell>
                    <TableCell>{rx.medication}</TableCell>
                    <TableCell>{rx.dosage}</TableCell>
                    <TableCell>{rx.duration}</TableCell>
                    <TableCell>{rx.date}</TableCell>
                    <TableCell>{getStatusBadge(rx.status)}</TableCell>
                    <TableCell>
                      <div className='flex gap-2'>
                        {rx.status === 'pending' && (
                          <Button size='sm' variant='outline' onClick={() => handleValidate(rx.id)}>
                            Validate
                          </Button>
                        )}
                        {rx.status === 'validated' && (
                          <Button size='sm' variant='outline' onClick={() => handleDispense(rx.id)}>
                            Dispense
                          </Button>
                        )}
                        <Button size='sm' variant='outline'>
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Drug Interaction Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <AlertCircle className='h-5 w-5 text-red-600' />
            Drug Interaction Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {alerts.length > 0 ? (
              alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`border-l-4 ${alert.severity === 'high' ? 'border-red-600' : 'border-yellow-600'} pl-4 py-2`}
                >
                  <p className='font-medium'>
                    Patient: {alert.patientName} ({alert.prescriptionId})
                  </p>
                  <p className='text-sm text-muted-foreground'>{alert.message}</p>
                </div>
              ))
            ) : (
              <p className='text-sm text-muted-foreground'>No active alerts.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
