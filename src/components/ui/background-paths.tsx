"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

function FloatingPaths({ position }: { position: number }) {
    const paths = Array.from({ length: 36 }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
            380 - i * 5 * position
        } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
            152 - i * 5 * position
        } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
            684 - i * 5 * position
        } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        color: `rgba(52, 211, 153, ${0.2 + i * 0.04})`, // Brighter Emerald-400
        width: 0.8 + i * 0.04,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none">
            <svg
                className="w-full h-full text-primary/30 dark:text-b-green/40"
                viewBox="0 0 696 316"
                fill="none"
            >
                <title>Background Paths</title>
                <defs>
                    <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="1.5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <filter id="neon-bloom" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0.2  0 0 0 0 0.9  0 0 0 0 0.6  0 0 0 1 0" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
                {paths.map((path) => (
                    <g key={path.id} filter="url(#neon-bloom)">
                        <motion.path
                            d={path.d}
                            stroke="currentColor"
                            strokeWidth={path.width}
                            strokeOpacity={0.3 + path.id * 0.05}
                            initial={{ pathLength: 0.3, opacity: 0.8 }}
                            animate={{
                                pathLength: 1,
                                opacity: [0.5, 1, 0.5],
                                pathOffset: [0, 1, 0],
                            }}
                            transition={{
                                duration: 20 + Math.random() * 10,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "linear",
                            }}
                            className="drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                        />
                    </g>
                ))}
            </svg>
        </div>
    );
}

export function BackgroundPaths({
    children,
}: {
    children?: React.ReactNode;
}) {
    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <FloatingPaths position={1} />
                <FloatingPaths position={-1} />
            </div>

            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
}
