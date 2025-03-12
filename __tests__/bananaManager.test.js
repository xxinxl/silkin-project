const bananaManager = require('./bananaManager');

describe('bananaManager', () => {
  let manager;

  beforeEach(() => {
    manager = bananaManager();
  });

  describe('addBanana', () => {
    test('должен добавлять банан с дефолтной свежестью 10', () => {
      manager.addBanana();
      const bananas = manager.getBananas();
      expect(bananas.length).toBe(1);
      expect(bananas[0].freshness).toBe(10);
    });

    test('должен добавлять банан с указанной свежестью', () => {
      manager.addBanana(7);
      const bananas = manager.getBananas();
      expect(bananas[0].freshness).toBe(7);
    });

    test('должен выбрасывать ошибку, если свежесть меньше 0', () => {
      expect(() => manager.addBanana(-1)).toThrow('Свежесть банана должна быть от 0 до 10');
    });

    test('должен выбрасывать ошибку, если свежесть больше 10', () => {
      expect(() => manager.addBanana(11)).toThrow('Свежесть банана должна быть от 0 до 10');
    });
  });

  describe('removeBanana', () => {
    test('должен удалять банан по ID', () => {
      manager.addBanana();
      const bananaId = manager.getBananas()[0].id;
      manager.removeBanana(bananaId);
      expect(manager.getBananas().length).toBe(0);
    });

    test('не должен падать, если банан с таким ID не существует', () => {
      expect(() => manager.removeBanana(999)).not.toThrow();
    });

    test('должен записывать действие в лог', () => {
      manager.addBanana();
      const bananaId = manager.getBananas()[0].id;
      manager.removeBanana(bananaId);
      const log = manager.getActionsLog();
      expect(log[1].type).toBe('REMOVE'); // Первое действие — ADD, второе — REMOVE
    });
  });

  describe('getBananas', () => {
    test('должен возвращать пустой массив, если бананов нет', () => {
      expect(manager.getBananas()).toEqual([]);
    });

    test('должен возвращать все добавленные бананы', () => {
      manager.addBanana();
      manager.addBanana();
      expect(manager.getBananas().length).toBe(2);
    });
  });

  describe('distributeBananas', () => {
    test('должен распределять бананы между пользователями', () => {
      manager.addBanana();
      manager.addBanana();
      const users = ['Alice', 'Bob'];
      const distributed = manager.distributeBananas(users);
      expect(distributed.length).toBe(2);
      expect(distributed[0].user).toBe('Alice');
      expect(distributed[1].user).toBe('Bob');
      expect(manager.getBananas().length).toBe(0); // Бананы должны быть удалены после распределения
    });

    test('должен выбрасывать ошибку, если бананов меньше, чем пользователей', () => {
      manager.addBanana();
      const users = ['Alice', 'Bob'];
      expect(() => manager.distributeBananas(users)).toThrow('Недостаточно бананов для всех пользователей');
    });

    test('должен записывать действие в лог', () => {
      manager.addBanana();
      manager.addBanana();
      const users = ['Alice', 'Bob'];
      manager.distributeBananas(users);
      const log = manager.getActionsLog();
      expect(log[2].type).toBe('DISTRIBUTE'); // Третье действие — DISTRIBUTE
    });
  });

  describe('sortBananasByFreshness', () => {
    test('должен сортировать бананы по свежести (от самой высокой)', () => {
      manager.addBanana(5);
      manager.addBanana(10);
      manager.addBanana(1);
      manager.sortBananasByFreshness();
      const bananas = manager.getBananas();
      expect(bananas[0].freshness).toBe(10);
      expect(bananas[1].freshness).toBe(5);
      expect(bananas[2].freshness).toBe(1);
    });

    test('должен записывать действие в лог', () => {
      manager.addBanana();
      manager.sortBananasByFreshness();
      const log = manager.getActionsLog();
      expect(log[1].type).toBe('SORT'); // Второе действие — SORT
    });
  });

  describe('removeSpoiledBananas', () => {
    test('должен удалять испорченные бананы (свежесть <= 0)', () => {
      manager.addBanana(0);
      manager.addBanana(5);
      const spoiled = manager.removeSpoiledBananas();
      expect(spoiled.length).toBe(1);
      expect(manager.getBananas().length).toBe(1);
    });

    test('должен записывать действие в лог', () => {
      manager.addBanana(0);
      manager.removeSpoiledBananas();
      const log = manager.getActionsLog();
      expect(log[1].type).toBe('REMOVE_SPOILED'); // Второе действие — REMOVE_SPOILED
    });

    test('не должен падать, если испорченных бананов нет', () => {
      manager.addBanana(5);
      expect(() => manager.removeSpoiledBananas()).not.toThrow();
    });
  });

  describe('getBananaStatistics', () => {
    test('должен возвращать корректную статистику', () => {
      manager.addBanana(5);
      manager.addBanana(10);
      const stats = manager.getBananaStatistics();
      expect(stats.total).toBe(2);
      expect(stats.averageFreshness).toBe(7.5);
    });

    test('должен возвращать нулевую статистику, если бананов нет', () => {
      const stats = manager.getBananaStatistics();
      expect(stats.total).toBe(0);
      expect(stats.averageFreshness).toBe(0);
    });
  });

  describe('getActionsLog', () => {
    test('должен возвращать лог всех действий', () => {
      manager.addBanana();
      manager.addBanana();
      manager.removeBanana(manager.getBananas()[0].id);
      const log = manager.getActionsLog();
      expect(log.length).toBe(3);
      expect(log[0].type).toBe('ADD');
      expect(log[1].type).toBe('ADD');
      expect(log[2].type).toBe('REMOVE');
    });
  });
});