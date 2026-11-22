import GameSavingLoader from './GameSavingLoader';

(async () => {
  try {
    const saving = await GameSavingLoader.load();
    // saving — объект класса GameSaving
    return saving;
  } catch (error) {
    // обработка ошибки
    return error;
  }
})();