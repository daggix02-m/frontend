import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button } from '@/components/ui/ui';
import { Check } from 'lucide-react';

export function SubscriptionManagement() {
    const plans = [
        {
            name: 'Basic',
            price: '$29',
            features: ['1 Branch', '2 Staff Members', 'Basic Reporting', 'Email Support'],
        },
        {
            name: 'Pro',
            price: '$79',
            features: ['3 Branches', '10 Staff Members', 'Advanced Reporting', 'Priority Support', 'Inventory Management'],
            popular: true,
        },
        {
            name: 'Enterprise',
            price: '$199',
            features: ['Unlimited Branches', 'Unlimited Staff', 'Custom Reporting', '24/7 Dedicated Support', 'API Access'],
        },
    ];

    return (
        <div className='space-y-6'>
            <div>
                <h2 className='text-3xl font-bold tracking-tight'>Subscription Management</h2>
                <p className='text-muted-foreground'>Manage subscription plans and billing.</p>
            </div>

            <div className='grid gap-6 md:grid-cols-3'>
                {plans.map((plan) => (
                    <Card key={plan.name} className={plan.popular ? 'border-primary shadow-lg' : ''}>
                        <CardHeader>
                            <CardTitle className='flex justify-between items-center'>
                                {plan.name}
                                {plan.popular && <span className='text-xs bg-primary/10 text-primary px-2 py-1 rounded-full'>Popular</span>}
                            </CardTitle>
                            <CardDescription>
                                <span className='text-3xl font-bold text-gray-900 dark:text-white'>{plan.price}</span> / month
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className='space-y-2'>
                                {plan.features.map((feature, index) => (
                                    <li key={index} className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                                        <Check size={16} className='text-green-500' />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Button className='w-full mt-6' variant={plan.popular ? 'default' : 'outline'}>
                                Edit Plan
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
