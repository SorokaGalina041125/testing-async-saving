import read from '../reader';
import GameSavingLoader from '../GameSavingLoader';
import GameSaving from '../GameSaving';

jest.mock('../reader');

const originalReaderModule = jest.requireActual('../reader');
const originalRead = originalReaderModule.default;

function stringToArrayBuffer(str) {
  const buffer = new ArrayBuffer(str.length * 2);
  const bufferView = new Uint16Array(buffer);
  for (let i = 0; i < str.length; i += 1) {
    bufferView[i] = str.charCodeAt(i);
  }
  return buffer;
}

describe('GameSavingLoader с моками read()', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('должен корректно работать с оригинальной функцией read() (100% покрытие reader.js)', async () => {
    read.mockImplementation(() => originalRead());

    const expected = new GameSaving({
      id: 9,
      created: 1546300800,
      userInfo: {
        id: 1,
        name: 'Hitman',
        level: 10,
        points: 2000,
      },
    });

    const result = await GameSavingLoader.load();

    expect(result).toBeInstanceOf(GameSaving);
    expect(result).toEqual(expected);
  });

  test('должен загружать данные при замоканном resolve от read()', async () => {
    const mockJson = JSON.stringify({
      id: 15,
      created: 1600000000,
      userInfo: {
        id: 2,
        name: 'Agent',
        level: 25,
        points: 5400,
      },
    });
    const buffer = stringToArrayBuffer(mockJson);

    read.mockResolvedValue(buffer);

    const result = await GameSavingLoader.load();

    expect(read).toHaveBeenCalledTimes(1);
    expect(result).toEqual(
      new GameSaving({
        id: 15,
        created: 1600000000,
        userInfo: {
          id: 2,
          name: 'Agent',
          level: 25,
          points: 5400,
        },
      }),
    );
  });

  test('должен отклоняться с ошибкой при замоканном reject от read()', async () => {
    read.mockRejectedValue(new Error('Ошибка чтения файла'));

    await expect(GameSavingLoader.load()).rejects.toThrow('Ошибка чтения файла');
    expect(read).toHaveBeenCalledTimes(1);
  });
});