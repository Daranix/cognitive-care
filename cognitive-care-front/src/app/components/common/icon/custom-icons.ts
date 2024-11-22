const iconList = [
    "google"
] as const;

export type CusIcon = `cus-${typeof iconList[number]}`;