import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, LogIn, LogOut, Calendar, Loader2 } from 'lucide-react';
import managerService from '@/services/manager.service';

export const ActivityLogDialog = ({ isOpen, onClose, staffMember }) => {
  if (!staffMember) return null;

  const [activityLogs, setActivityLogs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (isOpen && staffMember?.id) {
      fetchActivityLogs();
    }
  }, [isOpen, staffMember]);

  const fetchActivityLogs = async () => {
    setLoading(true);
    try {
      const response = await managerService.getStaffActivityLogs(staffMember.id);
      if (response.success) {
        setActivityLogs(response.data || []);
      } else {
        setActivityLogs([]);
      }
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      setActivityLogs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl max-h-[80vh]'>
        <div className='space-y-4'>
          <div>
            <h2 className='text-2xl font-bold'>{staffMember.name}</h2>
            <p className='text-sm text-muted-foreground'>{staffMember.email}</p>
            <div className='flex items-center gap-2 mt-2'>
              <Badge variant={staffMember.isOnline ? 'default' : 'secondary'}>
                {staffMember.isOnline ? 'Online' : 'Offline'}
              </Badge>
              <span className='text-sm text-muted-foreground'>
                {staffMember.role} • {staffMember.branch}
              </span>
            </div>
          </div>

          <ScrollArea className='h-[400px] pr-4'>
            {loading ? (
              <div className='flex items-center justify-center h-full'>
                <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
              </div>
            ) : activityLogs.length === 0 ? (
              <div className='flex items-center justify-center h-full text-muted-foreground'>
                <p>No activity logs found.</p>
              </div>
            ) : (
              <div className='space-y-4'>
                {activityLogs.map((log, index) => (
                  <Card key={index}>
                    <CardHeader className='pb-3'>
                      <div className='flex items-center justify-between'>
                        <CardTitle className='text-base flex items-center gap-2'>
                          <Calendar className='h-4 w-4' />
                          {new Date(log.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </CardTitle>
                        <Badge variant='outline' className='flex items-center gap-1'>
                          <Clock className='h-3 w-3' />
                          {log.totalHours}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-3'>
                        {log.sessions.map((session, sessionIndex) => (
                          <div
                            key={sessionIndex}
                            className='flex items-center justify-between p-3 bg-muted/50 rounded-lg'
                          >
                            <div className='flex items-center gap-4'>
                              <div className='flex items-center gap-2 text-sm'>
                                <LogIn className='h-4 w-4 text-green-600' />
                                <span className='font-medium'>{session.loginTime}</span>
                              </div>
                              <div className='h-4 w-px bg-border' />
                              <div className='flex items-center gap-2 text-sm'>
                                <LogOut className='h-4 w-4 text-red-600' />
                                <span className='font-medium'>{session.logoutTime}</span>
                              </div>
                            </div>
                            <div className='text-sm text-muted-foreground'>{session.duration}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className='pt-4 border-t'>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <p className='text-muted-foreground'>Total Days Logged</p>
                <p className='text-lg font-semibold'>{activityLogs.length} days</p>
              </div>
              <div>
                <p className='text-muted-foreground'>Average Hours/Day</p>
                <p className='text-lg font-semibold'>8h 10m</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
