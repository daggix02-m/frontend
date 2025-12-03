import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { FormCard, FADE_IN_VARIANTS } from '@/components/shared/FormCard';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const BranchForm = ({
    initialData,
    onSubmit,
    onCancel,
    className,
}) => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        contact: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                address: initialData.address || '',
                contact: initialData.contact || '',
            });
        }
    }, [initialData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <FormCard
            title={initialData ? 'Edit Branch' : 'Add New Branch'}
            onCancel={onCancel}
            className={className}
        >
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {}
                <motion.div variants={FADE_IN_VARIANTS} className="flex flex-col items-center gap-3 md:col-span-1">
                    <div className="relative">
                        <Avatar className="h-24 w-24 border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                            <AvatarFallback className="bg-transparent">
                                <MapPin className="h-10 w-10 text-muted-foreground" />
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-foreground">Branch Details</p>
                        <p className="text-xs text-muted-foreground">Manage pharmacy locations</p>
                    </div>
                </motion.div>

                {}
                <div className="flex flex-col gap-4 md:col-span-2">
                    <motion.div variants={FADE_IN_VARIANTS} className="grid w-full items-center gap-1.5">
                        <Label htmlFor="name">Branch Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g. Westside Branch"
                            required
                        />
                    </motion.div>

                    <motion.div variants={FADE_IN_VARIANTS} className="grid w-full items-center gap-1.5">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Full Address"
                            required
                        />
                    </motion.div>

                    <motion.div variants={FADE_IN_VARIANTS} className="grid w-full items-center gap-1.5">
                        <Label htmlFor="contact">Contact Number</Label>
                        <Input
                            id="contact"
                            name="contact"
                            value={formData.contact}
                            onChange={handleInputChange}
                            placeholder="Phone Number"
                            required
                        />
                    </motion.div>
                </div>

                {}
                <motion.div variants={FADE_IN_VARIANTS} className="flex justify-end gap-3 md:col-span-3">
                    <Button type="button" variant="ghost" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit">{initialData ? 'Save Changes' : 'Create Branch'}</Button>
                </motion.div>
            </form>
        </FormCard>
    );
};
