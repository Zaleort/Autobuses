export default () => {
  const normalizeFrecuencias = (frecuencia: string): string => {
    switch (frecuencia) {
      case 'LV': {
        return 'Lunes a Viernes';
      }
      case 'SD': {
        return 'Sábados y Domingos';
      }
      case 'F': {
        return 'Festivos';
      }
      default: {
        console.log(`No se reconoce ${frecuencia}`);
        return '';
      }
    }
  };

  const hoursToMinutes = (hour: string): number => {
    const arr = hour.split(':');
    const hourInMinutes = parseInt(arr[0], 10) * 60;
    const minutes = parseInt(arr[1], 10);

    return hourInMinutes + minutes;
  };

  return {
    normalizeFrecuencias,
    hoursToMinutes,
  };
};
