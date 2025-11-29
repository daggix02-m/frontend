import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// --- Animation Variants for Framer Motion ---
const FADE_IN_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
};

export const FormCard = ({
    title,
    children,
    onCancel,
    className,
}) => {
    return (
        <motion.div
            initial="hidden"
            animate="show"
            viewport={{ once: true }}
            variants={{
                hidden: {},
                show: {
                    transition: {
                        staggerChildren: 0.15,
                    },
                },
            }}
            className={cn(
                "relative w-full max-w-lg rounded-xl bg-background p-6 shadow-xl",
                className
            )}
        >
            <div className="flex items-center justify-between">
                <motion.h3 variants={FADE_IN_VARIANTS} className="text-xl font-semibold text-foreground">
                    {title}
                </motion.h3>
            </div>

            <div className="mt-6">
                {children}
            </div>
        </motion.div>
    );
};

export { FADE_IN_VARIANTS };
