/** Mientras sea propuesta, la web es demo salvo que se desactive explícitamente. */
export const isDemo: boolean = import.meta.env.PUBLIC_IS_DEMO !== 'false';
