import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, Eye, EyeOff } from 'lucide-react';
import { FormCard, FADE_IN_VARIANTS } from '@/components/shared/FormCard';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select } from '@/components/ui/select';

export const StaffForm = ({
    initialData,
    onSubmit,
    onCancel,
    className,
}) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Pharmacist',
        branch: 'Main Branch',
        status: 'Active',
        initialPassword: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                email: initialData.email || '',
                role: initialData.role || 'Pharmacist',
                branch: initialData.branch || 'Main Branch',
                status: initialData.status || 'Active',
                initialPassword: '',
                confirmPassword: '',
            });
        }
    }, [initialData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === 'initialPassword' || name === 'confirmPassword') {
            setPasswordError('');
        }
    };

    const validatePassword = () => {
        if (!initialData) {
            if (!formData.initialPassword) {
                setPasswordError('Initial password is required');
                return false;
            }
            if (formData.initialPassword.length < 8) {
                setPasswordError('Password must be at least 8 characters');
                return false;
            }
            if (formData.initialPassword !== formData.confirmPassword) {
                setPasswordError('Passwords do not match');
                return false;
            }
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validatePassword()) {
            return;
        }

        onSubmit(formData);
    };

    return (
        <FormCard
            title={initialData ? 'Edit Staff Member' : 'Add New Staff Member'}
            onCancel={onCancel}
            className={className}
        >
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {}
                <motion.div variants={FADE_IN_VARIANTS} className="flex flex-col items-center gap-3 md:col-span-1">
                    <div className="relative">
                        <Avatar className="h-24 w-24 border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                            <AvatarFallback className="bg-transparent">
                                <User className="h-10 w-10 text-muted-foreground" />
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-foreground">Staff Details</p>
                        <p className="text-xs text-muted-foreground">Manage employee information</p>
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
                            placeholder="e.g. Abebe Kebede"
                            required
                        />
                    </motion.div>

                    <motion.div variants={FADE_IN_VARIANTS} className="grid w-full items-center gap-1.5">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="name@example.com"
                            type="email"
                            required
                        />
                    </motion.div>

                    {!initialData && (
                        <>
                            <motion.div variants={FADE_IN_VARIANTS} className="grid w-full items-center gap-1.5">
                                <Label htmlFor="initialPassword">Initial Password</Label>
                                <div className="relative">
                                    <Input
                                        id="initialPassword"
                                        name="initialPassword"
                                        value={formData.initialPassword}
                                        onChange={handleInputChange}
                                        placeholder="Create initial password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                <p className="text-xs text-muted-foreground">Staff will be required to change this on first login</p>
                            </motion.div>

                            <motion.div variants={FADE_IN_VARIANTS} className="grid w-full items-center gap-1.5">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        placeholder="Confirm password"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {passwordError && (
                                    <p className="text-xs text-red-500">{passwordError}</p>
                                )}
                            </motion.div>
                        </>
                    )}

                    <motion.div variants={FADE_IN_VARIANTS} className="grid w-full items-center gap-1.5">
                        <Label htmlFor="role">Role</Label>
                        <Select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                        >
                            <option value="Pharmacist">Pharmacist</option>
                            <option value="Cashier">Cashier</option>
                        </Select>
                    </motion.div>

                    <motion.div variants={FADE_IN_VARIANTS} className="grid w-full items-center gap-1.5">
                        <Label htmlFor="branch">Assign Branch</Label>
                        <Select
                            id="branch"
                            name="branch"
                            value={formData.branch}
                            onChange={handleInputChange}
                        >
                            <option value="Main Branch">Main Branch</option>
                            <option value="Downtown Branch">Downtown Branch</option>
                            <option value="Westside Branch">Westside Branch</option>
                        </Select>
                    </motion.div>

                    {initialData && (
                        <motion.div variants={FADE_IN_VARIANTS} className="grid w-full items-center gap-1.5">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                            >
                                <option value="Active">Active</option>
                                <option value="On Leave">On Leave</option>
                                <option value="Inactive">Inactive</option>
                            </Select>
                        </motion.div>
                    )}
                </div>

                {}
                <motion.div variants={FADE_IN_VARIANTS} className="flex justify-end gap-3 md:col-span-3">
                    <Button type="button" variant="ghost" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit">{initialData ? 'Save Changes' : 'Create Account'}</Button>
                </motion.div>
            </form>
        </FormCard>
    );
};
