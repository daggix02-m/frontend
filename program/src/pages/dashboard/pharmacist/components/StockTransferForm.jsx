import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Info, ArrowRightLeft } from 'lucide-react';
import { FormCard, FADE_IN_VARIANTS } from '@/components/shared/FormCard';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select } from '@/components/ui/select';

export const StockTransferForm = ({
    initialData,
    onSubmit,
    onCancel,
    className,
}) => {
    const [to, setTo] = useState(initialData?.to || "");
    const [items, setItems] = useState(initialData?.items || "");
    const [priority, setPriority] = useState(initialData?.priority || "Normal");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ to, items, priority });
    };

    return (
        <FormCard title="New Stock Transfer" onCancel={onCancel} className={className}>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {}
                <motion.div variants={FADE_IN_VARIANTS} className="flex flex-col items-center gap-3 md:col-span-1">
                    <div className="relative">
                        <Avatar className="h-24 w-24 border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                            <AvatarFallback className="bg-transparent">
                                <ArrowRightLeft className="h-10 w-10 text-muted-foreground" />
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-foreground">Transfer Request</p>
                        <p className="text-xs text-muted-foreground">Internal Branch Transfer</p>
                    </div>
                </motion.div>

                {}
                <div className="flex flex-col gap-4 md:col-span-2">
                    <motion.div variants={FADE_IN_VARIANTS} className="grid w-full items-center gap-1.5">
                        <Label htmlFor="target-branch">
                            Target Branch <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            id="target-branch"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            required
                            className="w-full"
                        >
                            <option value="">Select Branch</option>
                            <option value="Downtown Branch">Downtown Branch</option>
                            <option value="Westside Branch">Westside Branch</option>
                        </Select>
                    </motion.div>

                    <motion.div variants={FADE_IN_VARIANTS} className="grid w-full items-center gap-1.5">
                        <Label htmlFor="items">
                            Items <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="text"
                            id="items"
                            placeholder="e.g., Paracetamol (100)"
                            value={items}
                            onChange={(e) => setItems(e.target.value)}
                            required
                        />
                    </motion.div>

                    <motion.div variants={FADE_IN_VARIANTS} className="grid w-full items-center gap-1.5">
                        <div className="flex items-center gap-1">
                            <Label htmlFor="priority">Priority</Label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info className="h-3 w-3 cursor-pointer text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Urgent transfers are processed immediately.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <Select
                            id="priority"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="w-full"
                        >
                            <option value="Normal">Normal</option>
                            <option value="Urgent">Urgent</option>
                        </Select>
                    </motion.div>
                </div>

                {}
                <motion.div variants={FADE_IN_VARIANTS} className="flex justify-end gap-3 md:col-span-3">
                    <Button type="button" variant="ghost" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit">Submit Request</Button>
                </motion.div>
            </form>
        </FormCard>
    );
};
