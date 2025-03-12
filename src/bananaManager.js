export const bananaManager = () => {
  // Массив для хранения бананов
  let bananas = [];
  // Лог для записи всех действий с бананами
  const actionsLog = [];

  // Функция для добавления нового банана
  const addBanana = (freshness = 10) => {
    if (freshness < 0 || freshness > 10) {
      throw new Error('Свежесть банана должна быть от 0 до 10');
    }
    const banana = { id: Date.now(), freshness, addedAt: new Date() };
    bananas.push(banana);
    actionsLog.push({ type: 'ADD', banana });
  };

  // Функция для удаления банана по ID
  const removeBanana = (id) => {
    const banana = bananas.find(b => b.id === id);
    if (banana) {
      bananas = bananas.filter(b => b.id !== id);
      actionsLog.push({ type: 'REMOVE', banana });
    }
  };

  // Функция для получения всех бананов
  const getBananas = () => bananas;

  // Функция для распределения бананов между пользователями
  const distributeBananas = (users) => {
    if (bananas.length < users.length) {
      throw new Error('Недостаточно бананов для всех пользователей');
    }
    const distributed = users.map((user, index) => ({
      user,
      banana: bananas[index]
    }));
    actionsLog.push({ type: 'DISTRIBUTE', distributed });
    return distributed;
  };

  // Функция для сортировки бананов по свежести (от самой высокой)
  const sortBananasByFreshness = () => {
    bananas.sort((a, b) => b.freshness - a.freshness);
    actionsLog.push({ type: 'SORT' });
  };

  // Функция для удаления испорченных бананов (свежесть <= 0)
  const removeSpoiledBananas = () => {
    const spoiled = bananas.filter(b => b.freshness <= 0);
    bananas = bananas.filter(b => b.freshness > 0);
    actionsLog.push({ type: 'REMOVE_SPOILED', spoiled });
    return spoiled;
  };

  // Функция для получения статистики по бананам
  const getBananaStatistics = () => {
    const total = bananas.length;
    const averageFreshness = total > 0
      ? bananas.reduce((sum, b) => sum + b.freshness, 0) / total
      : 0;
    return { total, averageFreshness };
  };

  // Функция для получения лога всех действий
  const getActionsLog = () => actionsLog;

  return {
    addBanana,
    removeBanana,
    getBananas,
    distributeBananas,
    sortBananasByFreshness,
    removeSpoiledBananas,
    getBananaStatistics,
    getActionsLog
  };
};