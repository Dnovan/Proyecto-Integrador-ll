/**
 * @fileoverview Centro de Ayuda
 * @description FAQ interactivo y tutorial de la aplicación
 * 
 * @iso25010
 * - Usabilidad: Navegación clara y contenido accesible
 */

import React, { useState, useEffect } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, Book, MessageCircle, Mail } from 'lucide-react';
import { Card } from '../../components/atoms/Card';
import { Input } from '../../components/atoms/Input';
import { Button } from '../../components/atoms/Button';
import * as api from '../../services/mockApi';
import type { FAQItem } from '../../types';

export const HelpCenterPage: React.FC = () => {
    const [faqs, setFaqs] = useState<FAQItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const loadFaqs = async () => {
            try {
                const data = await api.getFAQs();
                setFaqs(data);
            } finally {
                setIsLoading(false);
            }
        };
        loadFaqs();
    }, []);

    const filteredFaqs = faqs.filter(
        (faq) =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const categories = [...new Set(faqs.map((f) => f.category))];

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-bg-primary pt-20 pb-12">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex p-4 bg-neon/10 rounded-full mb-4">
                        <HelpCircle className="w-12 h-12 text-neon" />
                    </div>
                    <h1 className="text-4xl font-bold text-text-primary mb-4">
                        Centro de Ayuda
                    </h1>
                    <p className="text-text-secondary text-lg">
                        ¿Cómo podemos ayudarte hoy?
                    </p>
                </div>

                {/* Búsqueda */}
                <div className="max-w-xl mx-auto mb-12">
                    <Input
                        placeholder="Buscar en preguntas frecuentes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        leftIcon={<Search className="w-5 h-5" />}
                    />
                </div>

                {/* Accesos rápidos */}
                <div className="grid md:grid-cols-3 gap-4 mb-12">
                    <Card variant="glass" hoverable glowOnHover className="text-center">
                        <Book className="w-8 h-8 text-neon mx-auto mb-3" />
                        <h3 className="font-semibold text-text-primary mb-2">Guía de inicio</h3>
                        <p className="text-text-muted text-sm">
                            Aprende a usar EventSpace paso a paso
                        </p>
                    </Card>
                    <Card variant="glass" hoverable glowOnHover className="text-center">
                        <MessageCircle className="w-8 h-8 text-neon mx-auto mb-3" />
                        <h3 className="font-semibold text-text-primary mb-2">Chat de soporte</h3>
                        <p className="text-text-muted text-sm">
                            Habla con nuestro equipo en vivo
                        </p>
                    </Card>
                    <Card variant="glass" hoverable glowOnHover className="text-center">
                        <Mail className="w-8 h-8 text-neon mx-auto mb-3" />
                        <h3 className="font-semibold text-text-primary mb-2">Enviar ticket</h3>
                        <p className="text-text-muted text-sm">
                            Te responderemos en 24 horas
                        </p>
                    </Card>
                </div>

                {/* FAQ */}
                <div id="faq">
                    <h2 className="text-2xl font-bold text-text-primary mb-6">
                        Preguntas Frecuentes
                    </h2>

                    {isLoading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="h-16 bg-bg-card rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {categories.map((category) => (
                                <div key={category}>
                                    <h3 className="text-lg font-semibold text-neon mb-4">{category}</h3>
                                    <div className="space-y-3">
                                        {filteredFaqs
                                            .filter((faq) => faq.category === category)
                                            .map((faq) => (
                                                <Card
                                                    key={faq.id}
                                                    variant="default"
                                                    padding="none"
                                                    className="overflow-hidden"
                                                >
                                                    <button
                                                        onClick={() => toggleExpand(faq.id)}
                                                        className="w-full flex items-center justify-between p-5 text-left"
                                                    >
                                                        <span className="font-medium text-text-primary pr-4">
                                                            {faq.question}
                                                        </span>
                                                        {expandedId === faq.id ? (
                                                            <ChevronUp className="w-5 h-5 text-neon flex-shrink-0" />
                                                        ) : (
                                                            <ChevronDown className="w-5 h-5 text-text-muted flex-shrink-0" />
                                                        )}
                                                    </button>
                                                    {expandedId === faq.id && (
                                                        <div className="px-5 pb-5 pt-0 animate-slide-up">
                                                            <p className="text-text-secondary leading-relaxed">
                                                                {faq.answer}
                                                            </p>
                                                        </div>
                                                    )}
                                                </Card>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {filteredFaqs.length === 0 && !isLoading && (
                        <div className="text-center py-12">
                            <p className="text-text-muted">
                                No se encontraron resultados para "{searchQuery}"
                            </p>
                        </div>
                    )}
                </div>

                {/* CTA */}
                <div className="mt-12">
                    <Card variant="glass" className="text-center">
                        <h3 className="text-xl font-semibold text-text-primary mb-2">
                            ¿No encontraste lo que buscabas?
                        </h3>
                        <p className="text-text-secondary mb-4">
                            Nuestro equipo de soporte está listo para ayudarte
                        </p>
                        <Button>Contactar soporte</Button>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default HelpCenterPage;
