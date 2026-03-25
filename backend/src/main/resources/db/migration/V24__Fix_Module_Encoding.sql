-- V24: Fix encoding for module 5 (IA module)

UPDATE modules SET
    name = 'Introducción a la IA',
    description = 'Fundamentos de la Inteligencia Artificial y cómo aplicarla en el mundo real.'
WHERE id = 5;
