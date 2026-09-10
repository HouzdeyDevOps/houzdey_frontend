import NaijaStates from 'naija-state-local-government';

export const locationService = {
  getStates(): string[] {
    return NaijaStates.states();
  },

  getLGAs(state: string): string[] {
    if (!state) return [];
    try {
      const result = NaijaStates.lgas(state);
      return result?.lgas ?? [];
    } catch {
      return [];
    }
  },
};
