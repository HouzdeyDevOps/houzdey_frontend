declare module 'naija-state-local-government' {
  interface StateRecord {
    state: string;
    lgas: string[];
  }

  const NaijaStates: {
    states(): string[];
    lgas(state: string): StateRecord;
  };

  export default NaijaStates;
}
