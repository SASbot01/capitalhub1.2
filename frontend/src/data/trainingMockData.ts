// Mock data for training module demonstration
// This will be replaced with real API calls once backend is ready

export interface Route {
    id: number;
    name: string;
    description: string;
    displayOrder: number;
    imageUrl: string;
    active: boolean;
}

export interface Formation {
    id: number;
    routeId: number;
    name: string;
    description: string;
    level: 'Básico' | 'Intermedio' | 'Avanzado';
    displayOrder: number;
    estimatedHours?: number;
}

export interface TrainingModule {
    id: number;
    formationId: number;
    name: string;
    description: string;
    displayOrder: number;
}

export interface Lesson {
    id: number;
    moduleId: number;
    title: string;
    content: string;
    duration: string;
    position: number;
    videoUrl: string;
    status: 'locked' | 'in-progress' | 'completed';
}

export interface UserProgress {
    formationId: number;
    completedLessons: number;
    totalLessons: number;
    progressPercentage: number;
}

// MOCK DATA - Solo Comercial PRO y Marketing Digital
export const mockRoutes: Route[] = [
    {
        id: 1,
        name: 'Comercial PRO',
        description: 'Domina las profesiones digitales más demandadas en ventas. Aprende a generar valor real en el mercado comercial digital: Setter, Closer, SDR y Cold Caller.',
        displayOrder: 1,
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
        active: true
    },
    {
        id: 3,
        name: 'Marketing Digital',
        description: 'Campañas, embudos y estrategias de crecimiento. Aprende a escalar negocios con Meta Ads, Google Ads y lanzamientos digitales.',
        displayOrder: 2,
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
        active: true
    }
];

export const mockFormations: Formation[] = [
    // Comercial PRO
    {
        id: 1,
        routeId: 1,
        name: 'Appointment Setter',
        description: 'Aprende a llenar calendarios con leads cualificados. Domina la prospección y agendamiento de citas de alto valor.',
        level: 'Básico',
        displayOrder: 1,
        estimatedHours: 40
    },
    {
        id: 2,
        routeId: 1,
        name: 'Closer High Ticket',
        description: 'Domina el arte de cerrar ventas de alto valor. Aprende frameworks de cierre y gestión de objeciones.',
        level: 'Intermedio',
        displayOrder: 2,
        estimatedHours: 60
    },
    {
        id: 3,
        routeId: 1,
        name: 'SDR/MDR',
        description: 'Prospección y desarrollo de ventas B2B. Conviértete en un Sales Development Representative profesional.',
        level: 'Intermedio',
        displayOrder: 3,
        estimatedHours: 50
    },
    {
        id: 4,
        routeId: 1,
        name: 'Cold Caller',
        description: 'Optimización de llamadas en frío. Aprende a convertir llamadas frías en oportunidades calientes.',
        level: 'Avanzado',
        displayOrder: 4,
        estimatedHours: 45
    },
    // Marketing Digital
    {
        id: 7,
        routeId: 3,
        name: 'Meta Ads & Google Ads',
        description: 'Domina campañas de pago en las plataformas más importantes. Aprende a escalar con ROAS positivo.',
        level: 'Intermedio',
        displayOrder: 1,
        estimatedHours: 50
    },
    {
        id: 8,
        routeId: 3,
        name: 'Lanzamientos y Evergreen',
        description: 'Diseña y ejecuta lanzamientos digitales. Crea embudos evergreen que venden 24/7.',
        level: 'Avanzado',
        displayOrder: 2,
        estimatedHours: 65
    }
];

export const mockModules: TrainingModule[] = [
    // Appointment Setter modules
    {
        id: 1,
        formationId: 1,
        name: 'Módulo 1: Fundamentos del Setter',
        description: 'Mentalidad, herramientas y primeros pasos como setter profesional',
        displayOrder: 1
    },
    {
        id: 2,
        formationId: 1,
        name: 'Módulo 2: Scripts y Frameworks',
        description: 'Aprende los scripts que funcionan y cómo adaptarlos',
        displayOrder: 2
    },
    {
        id: 3,
        formationId: 1,
        name: 'Módulo 3: CRM y Seguimiento',
        description: 'Domina el uso del CRM y sistemas de seguimiento',
        displayOrder: 3
    },
    {
        id: 4,
        formationId: 1,
        name: 'Módulo 4: Optimización y KPIs',
        description: 'Métricas clave y cómo mejorar tu performance',
        displayOrder: 4
    }
];

export const mockLessons: Lesson[] = [
    // Module 1 lessons
    {
        id: 1,
        moduleId: 1,
        title: 'Bienvenida al programa Setter',
        content: 'Introducción al programa y qué esperar',
        duration: '8 min',
        position: 1,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        status: 'completed'
    },
    {
        id: 2,
        moduleId: 1,
        title: 'Mentalidad del setter de alto rendimiento',
        content: 'Cómo pensar como un setter profesional',
        duration: '12 min',
        position: 2,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        status: 'in-progress'
    },
    {
        id: 3,
        moduleId: 1,
        title: 'Herramientas esenciales',
        content: 'CRM, teléfono, calendario y más',
        duration: '15 min',
        position: 3,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        status: 'locked'
    },
    {
        id: 4,
        moduleId: 1,
        title: 'Tu primer día como setter',
        content: 'Paso a paso de tu primera jornada',
        duration: '10 min',
        position: 4,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        status: 'locked'
    },
    // Module 2 lessons
    {
        id: 5,
        moduleId: 2,
        title: 'Anatomía de un script efectivo',
        content: 'Estructura y componentes clave',
        duration: '14 min',
        position: 1,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        status: 'locked'
    },
    {
        id: 6,
        moduleId: 2,
        title: 'Scripts para diferentes nichos',
        content: 'Adaptación según industria',
        duration: '18 min',
        position: 2,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        status: 'locked'
    }
];

export const mockUserProgress: UserProgress = {
    formationId: 1,
    completedLessons: 1,
    totalLessons: 16,
    progressPercentage: 6
};

// Helper functions
export const getFormationsByRoute = (routeId: number): Formation[] => {
    return mockFormations.filter(f => f.routeId === routeId);
};

export const getModulesByFormation = (formationId: number): TrainingModule[] => {
    return mockModules.filter(m => m.formationId === formationId);
};

export const getLessonsByModule = (moduleId: number): Lesson[] => {
    return mockLessons.filter(l => l.moduleId === moduleId);
};

export const getRouteById = (id: number): Route | undefined => {
    return mockRoutes.find(r => r.id === id);
};

export const getFormationById = (id: number): Formation | undefined => {
    return mockFormations.find(f => f.id === id);
};
