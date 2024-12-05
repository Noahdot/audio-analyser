export const indexToAudio = (index: string): string => {
  switch (index) {
    case '0': return "0~10";
    case '1': return "10~20";
    case '2': return "10~30";
    case '3': return "30~60";
    case '4': return "60~80";
    case '5': return "80~100";
    case '6': return "100~130";
    case '7': return "130~150";
    case '8': return "150~170";
    case '9': return "170~200";
    case '10': return "200~220";
    case '11': return "220~240";
    case '12': return "240~270";
    case '13': return "270~290";
    case '14': return "290~310";
    case '15': return "310~340";
    case '16': return "340~360";
    case '17': return "360~380";
    case '18': return "380~400";
    default: return "> 400~999";
  }
}

export const FREQ_SEGMENT_COUNT = 20;