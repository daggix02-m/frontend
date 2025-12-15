import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@/components/ui/ui';
import { Clock, DollarSign } from 'lucide-react';
import { cashierService } from '@/services/cashier.service';
import { toast } from 'sonner';

export function Sessions() {
    const [currentSession, setCurrentSession] = useState(null);
    const [sessionHistory, setSessionHistory] = useState([]);
    const [closingCash, setClosingCash] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const response = await cashierService.getSessions();

            if (response.success) {
                const sessionsData = response.data || response.sessions || [];
                setSessionHistory(Array.isArray(sessionsData) ? sessionsData : []);

                // Find the current active session (the most recent one that isn't closed)
                const activeSession = sessionsData.find(session => !session.isClosed);
                setCurrentSession(activeSession || null);
            } else {
                toast.error('Failed to load session data');
                setSessionHistory([]);
                setCurrentSession(null);
            }
        } catch (error) {
            console.error('Error fetching sessions:', error);
            toast.error('Failed to load session data');
            setSessionHistory([]);
            setCurrentSession(null);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSession = async () => {
        const amount = parseFloat(closingCash);
        if (isNaN(amount) || amount < 0) {
            toast.error('Please enter a valid closing cash amount');
            return;
        }

        if (window.confirm('Are you sure you want to close the current session?')) {
            try {
                const response = await cashierService.closeSession(amount);
                if (response.success) {
                    toast.success('Session closed successfully. Report generated.');
                    await fetchSessions(); // Refresh the session data
                    setClosingCash('');
                } else {
                    toast.error(response.message || 'Failed to close session');
                }
            } catch (error) {
                console.error('Error closing session:', error);
                toast.error('Failed to close session');
            }
        }
    };

    if (loading) {
        return (
            <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
                <h1 className='text-3xl font-bold'>Cash Sessions</h1>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
            <div>
                <h2 className='text-3xl font-bold tracking-tight'>Cash Sessions</h2>
                <p className='text-muted-foreground'>Open and close your daily cash sessions.</p>
            </div>

            <div className='grid gap-6 grid-cols-1 md:grid-cols-2'>
                <Card>
                    <CardHeader>
                        <CardTitle>Current Session</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        {currentSession ? (
                            <div className='flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg'>
                                <div className='p-2 bg-green-100 dark:bg-green-800 rounded-full'>
                                    <Clock className='h-6 w-6 text-green-600 dark:text-green-200' />
                                </div>
                                <div>
                                    <p className='font-medium text-green-800 dark:text-green-200'>Session Active</p>
                                    <p className='text-sm text-green-600 dark:text-green-300'>Started at {currentSession.startTime}</p>
                                </div>
                            </div>
                        ) : (
                            <div className='flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/20 rounded-lg'>
                                <div className='p-2 bg-gray-100 dark:bg-gray-800 rounded-full'>
                                    <Clock className='h-6 w-6 text-gray-600 dark:text-gray-200' />
                                </div>
                                <div>
                                    <p className='font-medium text-gray-800 dark:text-gray-200'>No Active Session</p>
                                    <p className='text-sm text-gray-600 dark:text-gray-300'>Session closed</p>
                                </div>
                            </div>
                        )}

                        <div className='space-y-2'>
                            <label className='text-sm font-medium'>Closing Cash Amount</label>
                            <div className='relative'>
                                <DollarSign className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                                <Input
                                    placeholder='0.00'
                                    className='pl-8'
                                    value={closingCash}
                                    onChange={(e) => setClosingCash(e.target.value)}
                                    type="number"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        <Button
                            className='w-full'
                            variant='destructive'
                            onClick={handleCloseSession}
                            disabled={!currentSession || !closingCash}
                        >
                            Close Session
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Session History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-4'>
                            {sessionHistory.length > 0 ? (
                                sessionHistory
                                    .filter(session => session.isClosed) // Only show closed sessions in history
                                    .map((session, index) => (
                                        <div key={index} className='flex justify-between items-center border-b pb-2'>
                                            <div>
                                                <p className='font-medium'>{session.date}</p>
                                                <p className='text-xs text-muted-foreground'>{session.startTime} - {session.endTime}</p>
                                            </div>
                                            <div className='text-right'>
                                                <p className='font-medium'>{session.totalCash ? `ETB ${session.totalCash.toFixed(2)}` : 'N/A'}</p>
                                                <p className='text-xs text-green-600'>{session.isBalanced ? 'Balanced' : 'Unbalanced'}</p>
                                            </div>
                                        </div>
                                    ))
                            ) : (
                                <p className='text-sm text-muted-foreground'>No session history available</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
