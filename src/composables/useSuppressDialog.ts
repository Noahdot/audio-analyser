import { getTomorrow } from '@/utils/formatDate';

export const useSuppressDialog = () => {
  const getSuppressArray = () => {
    const hasSuppress = localStorage.getItem('suppress');
    if (hasSuppress) {
      const suppressData = JSON.parse(hasSuppress);
      if (Array.isArray(suppressData) && suppressData.length !== 0) {
        return suppressData;
      }
    }
    return false;
  }

  const checkSuppressTime = (key: string): boolean => {
    const suppressData = getSuppressArray();
    if (suppressData) {
      const target = suppressData.find((item: any) => item.key === key);
      if (target) {
        return Date.now() > target.time;
      }
    }
    return true;
  }

  const setSuppressTime = (key: string): void => {
    const suppressData = getSuppressArray();
    if (suppressData) {
      const target = suppressData.find((item: any) => item.key === key);
      if (target) {
        target.time = getTomorrow();
      } else {
        suppressData.push({
          key,
          time: getTomorrow()
        });
      }
      localStorage.setItem('suppress', JSON.stringify(suppressData));
    } else {
      const data = {
        key,
        time: getTomorrow()
      };
      localStorage.setItem('suppress', JSON.stringify([data]));
    }
  }

  return {
    checkSuppressTime,
    setSuppressTime
  }
}