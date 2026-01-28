/**
 * @fileoverview BookingWidget - Premium Booking Configuration Component
 * @description Widget de configuración de reserva con slider de capacidad,
 * precio dinámico, servicios extras y diseño premium Blanco y Dorado
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Shield, Sparkles, CheckCircle2 } from 'lucide-react';

interface BookingWidgetProps {
    basePrice: number;
    maxCapacity: number;
    minCapacity?: number;
    pricePerPerson?: number;
    onReserve?: (data: BookingData) => void;
    selectedDate?: string | null;
}

interface BookingData {
    guestCount: number;
    totalPrice: number;
    extras: {
        security: boolean;
        cleaning: boolean;
    };
}

interface ServiceExtra {
    id: 'security' | 'cleaning';
    name: string;
    description: string;
    price: number;
    icon: React.ReactNode;
}

// Number Ticker Animation Component
const AnimatedNumber: React.FC<{ value: number; duration?: number }> = ({ value, duration = 500 }) => {
    const [displayValue, setDisplayValue] = useState(value);
    const prevValueRef = useRef(value);

    useEffect(() => {
        const startValue = prevValueRef.current;
        const endValue = value;
        const startTime = Date.now();

        const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.round(startValue + (endValue - startValue) * easeOutQuart);

            setDisplayValue(currentValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                prevValueRef.current = endValue;
            }
        };

        requestAnimationFrame(animate);
    }, [value, duration]);

    return (
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>
            {new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: 'MXN',
                maximumFractionDigits: 0,
            }).format(displayValue)}
        </span>
    );
};

export const BookingWidget: React.FC<BookingWidgetProps> = ({
    basePrice,
    maxCapacity,
    minCapacity = 10,
    pricePerPerson = 85,
    onReserve,
    selectedDate,
}) => {
    const [guestCount, setGuestCount] = useState(Math.round((minCapacity + maxCapacity) / 4));
    const [extras, setExtras] = useState({
        security: false,
        cleaning: false,
    });
    const [isHoveringButton, setIsHoveringButton] = useState(false);

    // Premium colors
    const colors = {
        gold: '#C5A059',
        goldLight: '#E8C872',
        goldDark: '#A68B45',
        text: '#2C2C2C',
        textSecondary: '#5D5D5D',
        textMuted: '#8C8C8C',
        bgLight: '#FAFAFA',
        border: '#E8E8E8',
        white: '#FFFFFF',
    };

    // Service extras configuration
    const serviceExtras: ServiceExtra[] = [
        {
            id: 'security',
            name: 'Seguridad Privada',
            description: 'Personal de seguridad profesional',
            price: 2500,
            icon: <Shield style={{ width: 20, height: 20 }} />,
        },
        {
            id: 'cleaning',
            name: 'Limpieza Post-Evento',
            description: 'Limpieza completa del espacio',
            price: 1800,
            icon: <Sparkles style={{ width: 20, height: 20 }} />,
        },
    ];

    // Calculate total price
    const calculatePrice = () => {
        let total = basePrice;

        // Add price per person above minimum
        if (guestCount > minCapacity) {
            total += (guestCount - minCapacity) * pricePerPerson;
        }

        // Add extras
        if (extras.security) total += serviceExtras.find(e => e.id === 'security')!.price;
        if (extras.cleaning) total += serviceExtras.find(e => e.id === 'cleaning')!.price;

        return total;
    };

    const totalPrice = calculatePrice();

    // Get event type label based on guest count
    const getEventTypeLabel = () => {
        if (guestCount <= 30) return { label: 'Reunión íntima', emoji: '✨' };
        if (guestCount <= 80) return { label: 'Evento mediano', emoji: '🎉' };
        if (guestCount <= 150) return { label: 'Celebración grande', emoji: '🎊' };
        return { label: 'Gran evento', emoji: '🏟️' };
    };

    const eventType = getEventTypeLabel();

    // Handle reservation
    const handleReserve = () => {
        if (onReserve) {
            onReserve({
                guestCount,
                totalPrice,
                extras,
            });
        }
    };

    // Toggle extra service
    const toggleExtra = (id: 'security' | 'cleaning') => {
        setExtras(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Calculate slider percentage
    const sliderPercentage = ((guestCount - minCapacity) / (maxCapacity - minCapacity)) * 100;

    return (
        <div
            style={{
                background: colors.white,
                borderRadius: '20px',
                padding: '28px',
                boxShadow: '0 8px 40px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
                border: `1px solid ${colors.border}`,
            }}
        >
            {/* Price Display */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <motion.div
                    key={totalPrice}
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                    <p
                        style={{
                            fontSize: '2.75rem',
                            fontWeight: 800,
                            background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.goldLight} 50%, ${colors.gold} 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            letterSpacing: '-0.02em',
                            lineHeight: 1.1,
                        }}
                    >
                        <AnimatedNumber value={totalPrice} />
                    </p>
                </motion.div>
                <p style={{ color: colors.textMuted, fontSize: '0.875rem', marginTop: '4px' }}>
                    precio estimado
                </p>
            </div>

            {/* Capacity Slider Section */}
            <div
                style={{
                    background: colors.bgLight,
                    borderRadius: '16px',
                    padding: '20px',
                    marginBottom: '20px',
                }}
            >
                {/* Slider Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Users style={{ width: 20, height: 20, color: colors.gold }} />
                        <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.text }}>
                            Número de invitados
                        </span>
                    </div>
                    <motion.div
                        key={guestCount}
                        initial={{ scale: 1.1, y: -2 }}
                        animate={{ scale: 1, y: 0 }}
                        style={{
                            background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.goldLight} 100%)`,
                            color: colors.white,
                            fontWeight: 700,
                            fontSize: '1.125rem',
                            padding: '6px 14px',
                            borderRadius: '10px',
                            boxShadow: '0 2px 8px rgba(197, 160, 89, 0.3)',
                        }}
                    >
                        {guestCount}
                    </motion.div>
                </div>

                {/* Custom Slider */}
                <div style={{ position: 'relative', marginBottom: '12px' }}>
                    {/* Track Background */}
                    <div
                        style={{
                            height: '8px',
                            background: colors.border,
                            borderRadius: '4px',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Active Track */}
                        <motion.div
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                height: '100%',
                                background: `linear-gradient(90deg, ${colors.gold} 0%, ${colors.goldLight} 100%)`,
                                borderRadius: '4px',
                            }}
                            animate={{ width: `${sliderPercentage}%` }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                    </div>

                    {/* Native Slider (invisible but functional) */}
                    <input
                        type="range"
                        min={minCapacity}
                        max={maxCapacity}
                        value={guestCount}
                        onChange={(e) => setGuestCount(parseInt(e.target.value))}
                        style={{
                            position: 'absolute',
                            top: '-4px',
                            left: 0,
                            width: '100%',
                            height: '16px',
                            WebkitAppearance: 'none',
                            appearance: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                        }}
                    />

                    {/* Custom Thumb */}
                    <motion.div
                        style={{
                            position: 'absolute',
                            top: '-6px',
                            width: '20px',
                            height: '20px',
                            background: colors.white,
                            border: `3px solid ${colors.gold}`,
                            borderRadius: '50%',
                            boxShadow: '0 2px 8px rgba(197, 160, 89, 0.4)',
                            pointerEvents: 'none',
                        }}
                        animate={{ left: `calc(${sliderPercentage}% - 10px)` }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                </div>

                {/* Capacity Range */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.75rem', color: colors.textMuted }}>{minCapacity} personas</span>
                    <span style={{ fontSize: '0.75rem', color: colors.textMuted }}>Máx. {maxCapacity}</span>
                </div>

                {/* Event Type Label */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={eventType.label}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            padding: '8px 16px',
                            background: `linear-gradient(135deg, ${colors.gold}15 0%, ${colors.goldLight}20 100%)`,
                            borderRadius: '20px',
                            border: `1px solid ${colors.gold}30`,
                        }}
                    >
                        <span style={{ fontSize: '1rem' }}>{eventType.emoji}</span>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: colors.gold }}>
                            Ideal para: {eventType.label}
                        </span>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Service Extras */}
            <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.text, marginBottom: '12px' }}>
                    Servicios Adicionales
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {serviceExtras.map((service) => {
                        const isSelected = extras[service.id];
                        return (
                            <motion.div
                                key={service.id}
                                onClick={() => toggleExtra(service.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '14px 16px',
                                    background: isSelected ? `linear-gradient(135deg, ${colors.gold}08 0%, ${colors.goldLight}12 100%)` : colors.bgLight,
                                    borderRadius: '12px',
                                    border: `1.5px solid ${isSelected ? colors.gold : colors.border}`,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                }}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                {/* Custom Checkbox */}
                                <div
                                    style={{
                                        width: '22px',
                                        height: '22px',
                                        borderRadius: '6px',
                                        border: `2px solid ${isSelected ? colors.gold : colors.border}`,
                                        background: isSelected ? `linear-gradient(135deg, ${colors.gold} 0%, ${colors.goldLight} 100%)` : colors.white,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.2s ease',
                                        flexShrink: 0,
                                    }}
                                >
                                    <AnimatePresence>
                                        {isSelected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                                            >
                                                <CheckCircle2 style={{ width: 14, height: 14, color: colors.white }} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Service Icon */}
                                <div
                                    style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '10px',
                                        background: isSelected
                                            ? `linear-gradient(135deg, ${colors.gold}20 0%, ${colors.goldLight}30 100%)`
                                            : colors.white,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: colors.gold,
                                        flexShrink: 0,
                                    }}
                                >
                                    {service.icon}
                                </div>

                                {/* Service Info */}
                                <div style={{ flex: 1 }}>
                                    <p style={{
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        color: isSelected ? colors.text : colors.textSecondary,
                                        marginBottom: '2px',
                                    }}>
                                        {service.name}
                                    </p>
                                    <p style={{ fontSize: '0.75rem', color: colors.textMuted }}>
                                        {service.description}
                                    </p>
                                </div>

                                {/* Price */}
                                <p style={{
                                    fontSize: '0.875rem',
                                    fontWeight: 700,
                                    color: isSelected ? colors.gold : colors.textSecondary,
                                }}>
                                    +${service.price.toLocaleString()}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Selected Date */}
            {selectedDate && (
                <div
                    style={{
                        background: `linear-gradient(135deg, ${colors.gold}10 0%, ${colors.goldLight}15 100%)`,
                        borderRadius: '12px',
                        padding: '12px 16px',
                        marginBottom: '16px',
                        border: `1px solid ${colors.gold}20`,
                    }}
                >
                    <p style={{ fontSize: '0.75rem', color: colors.textMuted, marginBottom: '4px' }}>
                        Fecha seleccionada:
                    </p>
                    <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.gold }}>
                        {new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-MX', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </p>
                </div>
            )}

            {/* Reserve Button */}
            <motion.button
                onClick={handleReserve}
                disabled={!selectedDate}
                onMouseEnter={() => setIsHoveringButton(true)}
                onMouseLeave={() => setIsHoveringButton(false)}
                style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: selectedDate ? colors.white : colors.textMuted,
                    background: selectedDate
                        ? `linear-gradient(135deg, ${colors.gold} 0%, ${colors.goldLight} 100%)`
                        : colors.bgLight,
                    border: 'none',
                    borderRadius: '14px',
                    cursor: selectedDate ? 'pointer' : 'not-allowed',
                    boxShadow: selectedDate && isHoveringButton
                        ? `0 8px 30px rgba(197, 160, 89, 0.5), 0 0 20px rgba(197, 160, 89, 0.2)`
                        : selectedDate
                            ? '0 4px 15px rgba(197, 160, 89, 0.35)'
                            : 'none',
                    transition: 'all 0.3s ease',
                }}
                whileHover={selectedDate ? { scale: 1.02, y: -2 } : {}}
                whileTap={selectedDate ? { scale: 0.98 } : {}}
            >
                {selectedDate ? 'Reservar Ahora' : 'Selecciona una fecha'}
            </motion.button>

            {/* Disclaimer */}
            <p style={{
                fontSize: '0.6875rem',
                color: colors.textMuted,
                textAlign: 'center',
                marginTop: '12px',
                lineHeight: 1.4,
            }}>
                El precio final puede variar según disponibilidad y servicios adicionales solicitados.
            </p>
        </div>
    );
};

export default BookingWidget;
