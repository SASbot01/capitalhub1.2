import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Target, Zap, ChevronRight, Check } from 'lucide-react';
import { Button } from '../ui/Button';

// Definición de las preguntas y puntuaciones
const QUESTIONS = [
    {
        id: 1,
        question: "¿Qué frase describe mejor tu objetivo actual?",
        options: [
            { text: "Quiero ganar dinero rápido con comisiones altas", scores: { commercial: 3, marketing: 1, tech: 0, ai: 0 } },
            { text: "Quiero crear sistemas y automatizar tareas", scores: { commercial: 0, marketing: 1, tech: 2, ai: 3 } },
            { text: "Quiero aprender a atraer clientes y vender online", scores: { commercial: 1, marketing: 3, tech: 1, ai: 0 } },
            { text: "Me gusta la parte técnica y organizar datos", scores: { commercial: 0, marketing: 0, tech: 3, ai: 1 } },
        ]
    },
    {
        id: 2,
        question: "¿Cómo te sientes interactuando con otras personas?",
        options: [
            { text: "Me encanta, soy persuasivo y sociable", scores: { commercial: 3, marketing: 1, tech: 0, ai: 0 } },
            { text: "Prefiero trabajar detrás de escena", scores: { commercial: 0, marketing: 1, tech: 2, ai: 2 } },
            { text: "Me gusta comunicar pero a través de contenido", scores: { commercial: 1, marketing: 3, tech: 0, ai: 1 } },
            { text: "Depende del contexto, soy adaptable", scores: { commercial: 1, marketing: 1, tech: 1, ai: 1 } },
        ]
    },
    {
        id: 3,
        question: "¿Qué herramienta te llama más la atención?",
        options: [
            { text: "El teléfono y las videollamadas (Ventas)", scores: { commercial: 3, marketing: 0, tech: 0, ai: 0 } },
            { text: "ChatGPT y herramientas de IA", scores: { commercial: 1, marketing: 1, tech: 1, ai: 3 } },
            { text: "Gestores de anuncios y redes sociales", scores: { commercial: 0, marketing: 3, tech: 0, ai: 0 } },
            { text: "CRMs y Dashboards de datos", scores: { commercial: 0, marketing: 0, tech: 3, ai: 1 } },
        ]
    },
    {
        id: 4,
        question: "¿Cuál es tu mayor fortaleza?",
        options: [
            { text: "Resiliencia y ambición", scores: { commercial: 3, marketing: 1, tech: 0, ai: 0 } },
            { text: "Creatividad y estrategia", scores: { commercial: 1, marketing: 3, tech: 1, ai: 1 } },
            { text: "Lógica y resolución de problemas", scores: { commercial: 0, marketing: 1, tech: 3, ai: 3 } },
            { text: "Curiosidad por el futuro", scores: { commercial: 0, marketing: 1, tech: 2, ai: 3 } },
        ]
    }
];

const RECOMMENDATIONS = {
    commercial: {
        title: "Comercial PRO",
        description: "Eres un tiburón de las ventas. Tu camino ideal es dominar el arte de la persuasión, el cierre y la gestión de clientes de alto valor.",
        routeId: "1",
        icon: Target
    },
    tech: {
        title: "Tech Specialist",
        description: "Tienes una mente estructurada. Las empresas necesitan expertos que dominen sus herramientas, CRMs y datos. Ese eres tú.",
        routeId: "2",
        icon: Zap
    },
    marketing: {
        title: "Meta Ads",
        description: "Eres un estratega nato. Tu perfil encaja perfectamente con la creación y gestión de campañas de publicidad en Meta Ads.",
        routeId: "3",
        icon: Target
    },
    ai: {
        title: "IA Specialist",
        description: "Vives en el futuro. La Inteligencia Artificial es tu mejor aliada y tu capacidad para implementarla te hará indispensable.",
        routeId: "4",
        icon: Brain
    }
};

export function TrainingRecommendationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [scores, setScores] = useState({ commercial: 0, marketing: 0, tech: 0, ai: 0 });
    const [result, setResult] = useState<keyof typeof RECOMMENDATIONS | null>(null);

    if (!isOpen) return null;

    const handleOptionSelect = (optionScores: typeof scores) => {
        const newScores = {
            commercial: scores.commercial + optionScores.commercial,
            marketing: scores.marketing + optionScores.marketing,
            tech: scores.tech + optionScores.tech,
            ai: scores.ai + optionScores.ai,
        };
        setScores(newScores);

        if (currentStep < QUESTIONS.length) {
            setCurrentStep(prev => prev + 1);
        } else {
            analyzeResult(newScores);
        }
    };

    const analyzeResult = (finalScores: typeof scores) => {
        setCurrentStep(QUESTIONS.length + 1);

        setTimeout(() => {
            let maxScore = -1;
            let winner: keyof typeof RECOMMENDATIONS = 'commercial';

            (Object.keys(finalScores) as Array<keyof typeof scores>).forEach(key => {
                if (finalScores[key] > maxScore) {
                    maxScore = finalScores[key];
                    winner = key;
                }
            });

            setResult(winner);
            setCurrentStep(QUESTIONS.length + 2);
        }, 1500);
    };

    const handleStart = () => setCurrentStep(1);

    const handleComplete = () => {
        localStorage.setItem('hasCompletedTrainingQuiz', 'true');
        onClose();
    };

    const handleGoToRoute = () => {
        if (result) {
            localStorage.setItem('hasCompletedTrainingQuiz', 'true');
            const routeId = RECOMMENDATIONS[result].routeId;
            navigate(`/training/routes/${routeId}/formations`);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-carbon/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-panel rounded-xl shadow-card max-w-lg w-full overflow-hidden border border-graphite flex flex-col max-h-[90vh]">

                {/* Header con barra de progreso */}
                {currentStep > 0 && currentStep <= QUESTIONS.length && (
                    <div className="bg-graphite h-2 w-full">
                        <div
                            className="bg-accent h-full transition-all duration-300 ease-out"
                            style={{ width: `${(currentStep / QUESTIONS.length) * 100}%` }}
                        />
                    </div>
                )}

                <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">

                    {/* STEP 0: INTRO */}
                    {currentStep === 0 && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                            <div className="w-20 h-20 bg-accent/20 rounded-xl flex items-center justify-center mx-auto mb-4 border border-accent/30">
                                <Brain className="w-10 h-10 text-accent" />
                            </div>
                            <h2 className="text-3xl font-display font-bold text-offwhite">
                                Descubre tu Ruta Ideal
                            </h2>
                            <p className="text-muted text-lg">
                                Antes de comenzar, responde 4 preguntas rápidas para que nuestra IA te recomiende el camino de formación perfecto para ti.
                            </p>
                            <Button onClick={handleStart} className="w-full mt-4 h-12 text-lg">
                                Comenzar Test
                                <ChevronRight className="ml-2 w-5 h-5" />
                            </Button>
                        </div>
                    )}

                    {/* STEPS 1-4: PREGUNTAS */}
                    {currentStep > 0 && currentStep <= QUESTIONS.length && (
                        <div className="w-full space-y-6 animate-in slide-in-from-right-8 duration-300 key={currentStep}">
                            <span className="text-sm font-semibold text-accent tracking-wider uppercase">
                                Pregunta {currentStep} de {QUESTIONS.length}
                            </span>
                            <h3 className="text-2xl font-display font-bold text-offwhite">
                                {QUESTIONS[currentStep - 1].question}
                            </h3>
                            <div className="grid gap-3 pt-4">
                                {QUESTIONS[currentStep - 1].options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleOptionSelect(option.scores)}
                                        className="w-full p-4 text-left rounded-lg border border-graphite hover:border-accent/50 hover:bg-carbon transition-all duration-200 group flex items-center justify-between"
                                    >
                                        <span className="text-offwhite/80 font-medium group-hover:text-accent transition-colors">
                                            {option.text}
                                        </span>
                                        <div className="w-5 h-5 rounded-full border-2 border-graphite group-hover:border-accent ml-3" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 5: ANALIZANDO */}
                    {currentStep === QUESTIONS.length + 1 && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div className="relative w-24 h-24 mx-auto">
                                <div className="absolute inset-0 rounded-full border-4 border-graphite" />
                                <div className="absolute inset-0 rounded-full border-4 border-accent border-t-transparent animate-spin" />
                                <Brain className="absolute inset-0 m-auto w-10 h-10 text-accent animate-pulse" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-display font-bold text-offwhite mb-2">
                                    Analizando tu perfil...
                                </h3>
                                <p className="text-muted">
                                    Cruzando tus respuestas con nuestras rutas de éxito.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* STEP 6: RESULTADO */}
                    {currentStep === QUESTIONS.length + 2 && result && (
                        <div className="space-y-6 w-full animate-in zoom-in-95 duration-300">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-900/30 text-emerald-400 rounded-lg text-sm font-medium mb-2 border border-emerald-700/30">
                                <Check className="w-4 h-4" /> Recomendación Personalizada
                            </div>

                            <div className="w-24 h-24 bg-graphite rounded-xl mx-auto flex items-center justify-center shadow-glow mb-4">
                                {(() => {
                                    const Icon = RECOMMENDATIONS[result].icon;
                                    return <Icon className="w-12 h-12 text-offwhite" />;
                                })()}
                            </div>

                            <h2 className="text-3xl font-display font-bold text-offwhite">
                                {RECOMMENDATIONS[result].title}
                            </h2>

                            <p className="text-muted text-lg leading-relaxed">
                                {RECOMMENDATIONS[result].description}
                            </p>

                            <div className="pt-6 space-y-3">
                                <Button
                                    onClick={handleGoToRoute}
                                    className="w-full h-14 text-lg"
                                >
                                    Ir a mi Ruta Recomendada
                                </Button>

                                <button
                                    onClick={handleComplete}
                                    className="w-full py-3 text-muted hover:text-offwhite font-medium text-sm transition-colors"
                                >
                                    Prefiero explorar todas las rutas
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
