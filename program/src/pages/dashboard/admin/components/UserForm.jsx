import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import { FormCard, FADE_IN_VARIANTS } from '@/components/shared/FormCard';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select } from '@/components/ui/select';

export const UserForm = ({
    onSubmit,
    onCancel,
    className,
}) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Support Admin',
    });

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
            title="Add New Admin User"
            onCancel={onCancel}
            className={className}
        >
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {}
                <motion.div variants={FADE_IN_VARIANTS} className="flex flex-col items-center gap-3 md:col-span-1">
                    <div className="relative">
                        <Avatar className="h-24 w-24 border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                            <AvatarFallback className="bg-transparent">
                                <UserPlus className="h-10 w-10 text-muted-foreground" />
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-foreground">Admin Details</p>
                        <p className="text-xs text-muted-foreground">Create new administrator</p>
                    </div>
                </motion.div>

                {}
                <div className="flex flex-col gap-4 md:col-span-2">
                    <motion.div variants={FADE_IN_VARIANTS} className="grid w-full items-center gap-1.5">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g., Abebe Bikila"
                            required
                        />
                    </motion.div>

                    <motion.div variants={FADE_IN_VARIANTS} className="grid w-full items-center gap-1.5">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="e.g., abebe@pharmacare.com"
                            required
                        />
                    </motion.div>

                    <motion.div variants={FADE_IN_VARIANTS} className="grid w-full items-center gap-1.5">
                        <Label htmlFor="role">Role</Label>
                        <Select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                        >
                            <option value="Support Admin">Support Admin</option>
                            <option value="Billing Admin">Billing Admin</option>
                            <option value="Analytics Admin">Analytics Admin</option>
                            <option value="Super Admin">Super Admin</option>
                        </Select>
                    </motion.div>
                </div>

                {}
                <motion.div variants={FADE_IN_VARIANTS} className="flex justify-end gap-3 md:col-span-3">
                    <Button type="button" variant="ghost" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit">Add User</Button>
                </motion.div>
            </form>
        </FormCard>
    );
};
